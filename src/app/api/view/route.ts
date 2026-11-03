import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";
import { SUPABASE_URL } from "@/lib/supabase";
import { classifySource, deviceOf, hostOf, isBot } from "@/lib/view-source";

/**
 * 칼럼 조회 한 건 기록(jcl-criminal · jcl-lease 와 같은 구현) — 어드민 칼럼 통계의 조회수·유입경로가 이 표를 센다.
 * — 칼럼 상세의 `ViewBeacon` 이 `sendBeacon` 으로 부른다.
 *
 *   POST /api/view   (본문은 text/plain JSON — sendBeacon 은 헤더를 못 단다)
 *   { slug, referrer, utmSource, utmMedium, utmCampaign, landing, prev }
 *
 * ── 정확도를 위해 거르는 것 ───────────────────────────────────────────────
 *  ① 봇 · 자동화 UA                    → isBot()
 *  ② 다른 사이트에서 쏜 요청            → Origin 이 이 호스트가 아니면 버린다
 *  ③ 없는 글 · 미발행 글                → slug 로 **발행된** 칼럼을 찾아야 기록한다
 *  ④ 같은 사람이 30분 안에 같은 글 다시 → 새로고침·뒤로가기는 조회 한 번이다
 *  ⑤ 한 사람이 30분에 40건 넘게          → 폭주. 더 받지 않는다
 * 미리보기(draft)·관리자 제외는 브라우저 쪽(ViewBeacon)이 막는다.
 *
 * ── 응답 ─────────────────────────────────────────────────────────────────
 * 늘 204 다. 기록했는지 버렸는지 알려 주지 않는다 — 알려 주면 거르는 규칙을 더듬어 볼 수 있다.
 *
 * ⚠️ **운영 배포에서만 쓴다.** 미리보기·로컬에서 쓰면 우리가 확인하려고 연 조회가 실제 숫자에
 *    섞인다(GA 와 같은 규칙, layout.tsx). 로컬 검증은 `NEXT_PUBLIC_VIEWS_ALLOW_LOCAL=1` 로만 연다.
 */

// 칼럼과 같은 어드민 DB(lib/supabase.ts). 서비스 키는 Vercel 환경변수에만 있다
const URL_BASE = SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_KEY = "hug";
const ENABLED =
	process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_VIEWS_ALLOW_LOCAL === "1";

const DEDUPE_MIN = 30;
const BURST_MAX = 40;

const noContent = () => new Response(null, { status: 204 });

/** 문자열 칸 — 길이를 자르고 빈 값은 null. 공개 엔드포인트라 무엇이 올지 모른다 */
function str(v: unknown, max = 300): string | null {
	if (typeof v !== "string") return null;
	const t = v.trim();
	return t ? t.slice(0, max) : null;
}

/** 사이트 안 경로만 받는다 (`/columns/x`). 전체 URL·스킴이 오면 버린다 */
function path(v: unknown): string | null {
	const p = str(v, 200);
	return p?.startsWith("/") && !p.startsWith("//") ? p : null;
}

/**
 * 방문자 해시 — IP · UA 를 **오늘 날짜(서울)** 와 비밀키로 섞는다.
 * 원본 IP 는 어디에도 남지 않고, 날이 바뀌면 같은 사람도 다른 값이 된다.
 * 비밀키는 서버 전용 service_role 키에서 파생한다 — 새 환경변수를 늘리지 않는다.
 */
function visitorHash(ip: string, ua: string): string {
	const day = new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
	return createHmac("sha256", `${SERVICE}:column-views`)
		.update(`${day}|${ip}|${ua}`)
		.digest("base64url")
		.slice(0, 32);
}

async function sb(pathAndQuery: string, init?: RequestInit) {
	return fetch(`${URL_BASE}/rest/v1/${pathAndQuery}`, {
		...init,
		headers: {
			apikey: SERVICE ?? "",
			Authorization: `Bearer ${SERVICE}`,
			"Content-Type": "application/json",
			...init?.headers,
		},
		cache: "no-store",
	});
}

export async function POST(req: NextRequest) {
	if (!ENABLED || !URL_BASE || !SERVICE) return noContent();

	const ua = req.headers.get("user-agent") ?? "";
	if (isBot(ua)) return noContent();
	// 브라우저가 미리 불러오는 요청은 사람이 본 것이 아니다
	if (req.headers.get("sec-purpose")?.includes("prefetch")) return noContent();

	const reqHost = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "")
		.split(":")[0]
		.replace(/^www\./, "");
	const ownHosts = [reqHost, hostOf(siteConfig.url)].filter((h): h is string => Boolean(h));
	const origin = hostOf(req.headers.get("origin"));
	if (!origin || !ownHosts.includes(origin)) return noContent();

	let body: Record<string, unknown>;
	try {
		const text = await req.text();
		if (text.length > 4000) return noContent();
		body = JSON.parse(text);
	} catch {
		return noContent();
	}

	const slug = str(body.slug, 200);
	const siteRes = await sb(`sites?select=id&key=eq.${SITE_KEY}&limit=1`);
	const site = siteRes.ok ? ((await siteRes.json()) as { id: string }[])[0]?.id : null;
	if (!slug || !site) return noContent();

	// ③ 발행된 이 사이트의 글인가
	const colRes = await sb(
		`columns?select=id&slug=eq.${encodeURIComponent(slug)}&site_id=eq.${site}&is_published=eq.true&limit=1`,
	);
	if (!colRes.ok) return noContent();
	const column = ((await colRes.json()) as { id: string }[])[0];
	if (!column) return noContent();

	const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "0.0.0.0";
	const visitor = visitorHash(ip, ua);

	// ④⑤ 이 방문자의 최근 30분
	const since = new Date(Date.now() - DEDUPE_MIN * 60_000).toISOString();
	const recentRes = await sb(
		`column_views?select=column_id&visitor=eq.${visitor}&viewed_at=gte.${since}&limit=${BURST_MAX}`,
	);
	if (!recentRes.ok) return noContent();
	const recent = (await recentRes.json()) as { column_id: string }[];
	if (recent.length >= BURST_MAX || recent.some((r) => r.column_id === column.id)) {
		return noContent();
	}

	const utmSource = str(body.utmSource, 100);
	const { source, referrerHost, inApp } = classifySource({
		referrer: str(body.referrer, 500),
		utmSource,
		userAgent: ua,
		ownHosts,
	});

	await sb("column_views", {
		method: "POST",
		headers: { Prefer: "return=minimal" },
		body: JSON.stringify({
			site_id: site,
			column_id: column.id,
			visitor,
			source,
			referrer_host: referrerHost,
			utm_source: utmSource,
			utm_medium: str(body.utmMedium, 100),
			utm_campaign: str(body.utmCampaign, 100),
			in_app: inApp,
			landing_path: path(body.landing),
			prev_path: path(body.prev),
			device: deviceOf(ua),
		}),
	});

	return noContent();
}
