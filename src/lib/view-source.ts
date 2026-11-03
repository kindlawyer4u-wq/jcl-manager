/**
 * 유입경로 판정 — 칼럼 조회 한 건이 **어디서 왔는지** 정한다.
 *
 * `/api/view` 가 서버에서 부른다. 순수 함수라 테스트로 규칙을 고정한다(view-source.test.ts).
 *
 * ── 판정 순서 ─────────────────────────────────────────────────────────────
 * 위에서부터 먼저 맞는 하나로 정한다.
 *   ① UTM `utm_source`  — 우리가 붙인 링크 · ChatGPT 처럼 스스로 붙이는 곳. 가장 확실하다
 *   ② referrer 도메인   — 브라우저 정책상 **도메인까지만** 온다. 검색어는 없다
 *   ③ 앱 내 브라우저 UA — referrer 가 비어 있을 때. 카톡방에서 누른 링크가 여기로 온다
 *   ④ 아무것도 없으면 direct
 *
 * ⚠️ 여기 키를 바꾸면 이미 쌓인 행의 `source` 와 어긋난다. 이름을 바꾸지 말고 새로 더한다.
 *    어드민의 라벨 표(jcl-admin src/lib/view-sources.ts)도 같이 고친다.
 */

export const SOURCES = [
	"naver-search",
	"naver-blog",
	"naver-cafe",
	"naver-etc",
	"google",
	"daum",
	"kakao",
	"youtube",
	"instagram",
	"facebook",
	"ai",
	"internal",
	"direct",
	"other",
	// utm 이 붙었는데 위 어디에도 안 맞는 것 (예: 문자로 보낸 `utm_source=sms`). 원래 값은 utm_source 칸에 있다
	"campaign",
] as const;

export type Source = (typeof SOURCES)[number];

export type SourceInput = {
	/** `document.referrer` 원문. 빈 문자열이면 없음 */
	referrer?: string | null;
	utmSource?: string | null;
	userAgent?: string | null;
	/** 이 사이트의 호스트들. referrer 가 여기 속하면 사이트 안 이동이다 */
	ownHosts: string[];
};

export type SourceResult = {
	source: Source;
	referrerHost: string | null;
	inApp: string | null;
};

/** 앱 내 브라우저 표시 → [저장할 이름, 유입 분류] */
const IN_APP: [RegExp, string, Source][] = [
	[/KAKAOTALK/i, "kakaotalk", "kakao"],
	[/\bInstagram\b/i, "instagram", "instagram"],
	[/FBAN|FBAV|FB_IAB/i, "facebook", "facebook"],
	[/NAVER\(inapp/i, "naver", "naver-etc"],
	[/DaumApps/i, "daum", "daum"],
	[/\bLine\//i, "line", "other"],
	[/\bBAND\//i, "band", "other"],
];

/** AI 답변엔진. referrer 와 utm 양쪽에서 본다 */
const AI_HOSTS = [
	"chatgpt.com",
	"chat.openai.com",
	"perplexity.ai",
	"claude.ai",
	"gemini.google.com",
	"copilot.microsoft.com",
];

function endsWithHost(host: string, base: string): boolean {
	return host === base || host.endsWith(`.${base}`);
}

export function hostOf(url?: string | null): string | null {
	if (!url) return null;
	try {
		return new URL(url).hostname.toLowerCase().replace(/^www\./, "") || null;
	} catch {
		return null;
	}
}

function fromHost(host: string, own: string[]): Source {
	if (own.some((h) => endsWithHost(host, h))) return "internal";
	if (AI_HOSTS.some((h) => endsWithHost(host, h))) return "ai";
	if (host === "search.naver.com" || host === "m.search.naver.com") return "naver-search";
	if (endsWithHost(host, "blog.naver.com")) return "naver-blog";
	if (endsWithHost(host, "cafe.naver.com")) return "naver-cafe";
	if (endsWithHost(host, "naver.com") || host === "naver.me") return "naver-etc";
	// google.com · google.co.kr · m.google.com … (gemini 는 위에서 AI 로 갔다)
	if (/(^|\.)google\.[a-z.]+$/.test(host)) return "google";
	if (endsWithHost(host, "daum.net")) return "daum";
	if (endsWithHost(host, "kakao.com")) return "kakao";
	if (endsWithHost(host, "youtube.com") || host === "youtu.be") return "youtube";
	if (endsWithHost(host, "instagram.com")) return "instagram";
	if (endsWithHost(host, "facebook.com") || host === "fb.me") return "facebook";
	return "other";
}

/** `utm_source` 값 → 분류. 사람이 손으로 붙이는 값이라 느슨하게 맞춘다 */
function fromUtm(raw: string): Source {
	const s = raw.toLowerCase();
	if (/chatgpt|openai|perplexity|claude|gemini|copilot/.test(s)) return "ai";
	if (/kakao|katalk|카카오|카톡/.test(s)) return "kakao";
	if (/naver.*blog|blog.*naver|^blog$/.test(s)) return "naver-blog";
	if (/naver.*cafe|^cafe$/.test(s)) return "naver-cafe";
	if (/naver|네이버/.test(s)) return "naver-etc";
	if (/youtube|^yt$/.test(s)) return "youtube";
	if (/instagram|^ig$|인스타/.test(s)) return "instagram";
	if (/facebook|^fb$/.test(s)) return "facebook";
	if (/google/.test(s)) return "google";
	if (/daum/.test(s)) return "daum";
	return "campaign";
}

export function classifySource(input: SourceInput): SourceResult {
	const referrerHost = hostOf(input.referrer);
	const ua = input.userAgent ?? "";
	const app = IN_APP.find(([re]) => re.test(ua));
	const inApp = app ? app[1] : null;

	const utm = input.utmSource?.trim();
	if (utm) return { source: fromUtm(utm), referrerHost, inApp };

	if (referrerHost) return { source: fromHost(referrerHost, input.ownHosts), referrerHost, inApp };

	if (app) return { source: app[2], referrerHost, inApp };

	return { source: "direct", referrerHost, inApp };
}

/**
 * 봇·자동화 요청.
 * ⚠️ 카카오톡 **링크 미리보기 수집기**(kakaotalk-scrap)는 봇이다. 앱 내 브라우저(KAKAOTALK)와
 *    이름이 비슷해 한 정규식으로 합치면 카톡 유입을 통째로 버린다.
 */
export function isBot(ua?: string | null): boolean {
	if (!ua) return true;
	return /bot\b|bot\/|crawl|spider|slurp|mediapartners|headless|lighthouse|pagespeed|preview|facebookexternalhit|kakaotalk-scrap|yeti|daumoa|python|curl|wget|axios|node-fetch|undici|go-http|java\/|okhttp/i.test(
		ua,
	);
}

export function deviceOf(ua?: string | null): "mobile" | "tablet" | "desktop" {
	const s = ua ?? "";
	if (/iPad|Tablet|SM-T\d|Android(?!.*Mobile)/i.test(s)) return "tablet";
	if (/Mobi|iPhone|Android/i.test(s)) return "mobile";
	return "desktop";
}
