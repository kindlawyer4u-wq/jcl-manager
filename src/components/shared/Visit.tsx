"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * 칼럼 조회 수집의 브라우저 쪽 — 서버 쪽은 `app/api/view/route.ts`.
 *
 * ── 왜 "탭의 첫 진입"을 따로 적어 두나 ─────────────────────────────────────
 * Next 는 페이지를 옮겨도 문서를 새로 불러오지 않는다. 그래서 `document.referrer` 는
 * **탭을 연 순간의 값**에 머문다 — 네이버로 들어와 홈 → 칼럼으로 옮겨도 칼럼에서
 * referrer 는 여전히 네이버다. 그 성질을 그대로 이용한다: 탭을 연 순간 한 번 적어 두고
 * (`jcl:entry`), 그 탭의 모든 조회에 "이 방문은 어디서 시작됐나" 로 붙인다.
 * 사이트 안에서 어느 페이지를 거쳐 왔는지는 `jcl:last` 가 따로 말한다.
 *
 * ★ sessionStorage 다(쿠키가 아니다). 탭을 닫으면 사라지고 서버로 가지 않는다.
 * ⚠️ 저장소가 막힌 브라우저(사생활 보호 모드 일부)에서는 조용히 넘어간다 — 조회는 그대로 센다.
 */

const ENTRY = "jcl:entry";
const LAST = "jcl:last";
/** 이 브라우저를 집계에서 뺀다. 관리자가 `?notrack=1` 로 한 번 켠다 */
const NOTRACK = "jcl:notrack";

type Entry = {
	referrer: string;
	utmSource: string | null;
	utmMedium: string | null;
	utmCampaign: string | null;
	landing: string;
};

function decode(p: string): string {
	try {
		return decodeURIComponent(p);
	} catch {
		return p;
	}
}

function ss(): Storage | null {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}

/**
 * 이 탭의 첫 진입. 없으면 **지금** 적는다.
 * ⚠️ 칼럼 페이지로 바로 착지하면 `ViewBeacon` 의 effect 가 `VisitTracker` 보다 먼저 돈다
 *    (자식 effect 가 부모보다 먼저다). 그래서 적는 일을 한쪽에 맡기지 않고 읽는 쪽이 채운다.
 */
function ensureEntry(): Entry {
	const store = ss();
	const saved = store?.getItem(ENTRY);
	if (saved) {
		try {
			return JSON.parse(saved) as Entry;
		} catch {}
	}
	const q = new URLSearchParams(window.location.search);
	const entry: Entry = {
		referrer: document.referrer,
		utmSource: q.get("utm_source"),
		utmMedium: q.get("utm_medium"),
		utmCampaign: q.get("utm_campaign"),
		landing: decode(window.location.pathname),
	};
	try {
		store?.setItem(ENTRY, JSON.stringify(entry));
	} catch {}
	return entry;
}

function notTracked(): boolean {
	try {
		return window.localStorage.getItem(NOTRACK) === "1";
	} catch {
		return false;
	}
}

/** 레이아웃에 한 번. 첫 진입을 적고, 페이지를 옮길 때마다 "직전 페이지"를 갱신한다 */
export function VisitTracker() {
	const pathname = usePathname();

	useEffect(() => {
		ensureEntry();
		// 관리자 제외 스위치 — `?notrack=1` 켜기, `?notrack=0` 끄기. 이 브라우저에만 남는다
		const flag = new URLSearchParams(window.location.search).get("notrack");
		try {
			if (flag === "1") window.localStorage.setItem(NOTRACK, "1");
			if (flag === "0") window.localStorage.removeItem(NOTRACK);
		} catch {}
		// ★ 페이지의 ViewBeacon 이 먼저 읽은 **뒤에** 덮어쓴다(부모 effect 가 나중이다)
		try {
			ss()?.setItem(LAST, decode(pathname));
		} catch {}
	}, [pathname]);

	return null;
}

/**
 * 칼럼 상세에 하나. 화면에 **실제로 보일 때** 한 번 보낸다.
 *
 * ★ 백그라운드 탭으로 열어 두기만 한 것은 세지 않는다 — 보이게 되는 순간까지 기다린다.
 * ★ `sendBeacon` 이라 페이지를 바로 떠나도 요청이 끝까지 간다.
 * ⚠️ 미리보기(초안)에서는 이 컴포넌트를 그리지 않는다(페이지가 막는다).
 */
export function ViewBeacon({ slug }: { slug: string }) {
	useEffect(() => {
		if (notTracked() || navigator.webdriver) return;

		// ★ 직전 페이지는 **지금** 읽는다. 보일 때까지 기다리는 사이 VisitTracker 가 덮어쓴다
		const here = decode(window.location.pathname);
		const last = ss()?.getItem(LAST) ?? null;
		// 새로고침이면 last 가 지금 페이지다 — 직전 페이지가 아니다
		const prev = last && last !== here ? last : null;

		const send = () => {
			const entry = ensureEntry();
			const body = JSON.stringify({ slug, ...entry, prev });
			if (!navigator.sendBeacon?.("/api/view", body)) {
				fetch("/api/view", { method: "POST", body, keepalive: true }).catch(() => {});
			}
		};

		if (document.visibilityState === "visible") {
			send();
			return;
		}
		const onVisible = () => {
			if (document.visibilityState !== "visible") return;
			document.removeEventListener("visibilitychange", onVisible);
			send();
		};
		document.addEventListener("visibilitychange", onVisible);
		return () => document.removeEventListener("visibilitychange", onVisible);
	}, [slug]);

	return null;
}
