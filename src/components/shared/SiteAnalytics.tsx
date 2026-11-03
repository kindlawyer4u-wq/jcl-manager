"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * GA4 태그 + 연락 버튼 클릭 이벤트. 어드민 「방문 현황」이 이 데이터를 읽는다(jcl-admin src/lib/ga4.ts).
 *
 * ★ /preview(어드민 미리보기 iframe)에서는 태그를 심지 않는다 — 편집할 때마다 방문으로 세면 숫자가 부푼다.
 *   미리보기는 iframe 에 새로 열리므로 첫 경로만 보면 된다.
 *
 * 연락 버튼 이벤트(버튼마다 onClick 을 달지 않고 문서 하나에서 위임으로 받는다 — 화면 편집으로 버튼이 늘어도 빠지지 않는다):
 *   tel_click         전화(tel:)
 *   kakao_click       카카오톡(pf.kakao.com · open.kakao.com)
 *   directions_click  지도·오시는길(네이버·카카오 지도, /location)
 *   booking_click     네이버 예약
 * place 매개변수는 버튼이 놓인 자리(data-place · header · footer · nav 이름 · section id)다.
 * ⚠️ 이벤트 이름을 바꾸면 어드민 집계와 끊긴다. 모든 사이트가 같은 이름을 쓴다.
 * ⚠️ GA 가 없으면(광고 차단 등) 아무것도 하지 않는다. 링크 이동은 막지 않는다.
 */
type Gtag = (cmd: "event", name: string, params: Record<string, string>) => void;

const eventOf = (href: string): string | null => {
	if (href.startsWith("tel:")) return "tel_click";
	if (/^https?:\/\/(pf|open)\.kakao\.com\//.test(href)) return "kakao_click";
	if (/booking\.naver\.com/.test(href)) return "booking_click";
	if (/map\.naver\.com|naver\.me\/|map\.kakao\.com|kko\.to\/|^\/location(\/|$|\?|#)/.test(href))
		return "directions_click";
	return null;
};

const placeOf = (el: Element): string => {
	const box = el.closest("[data-place],header,footer,nav[aria-label],section[id],aside");
	if (!box) return "body";
	return (
		box.getAttribute("data-place") ||
		(box.tagName === "NAV" ? box.getAttribute("aria-label") : null) ||
		box.id ||
		box.tagName.toLowerCase()
	);
};

export const SiteAnalytics = ({ gaId }: { gaId: string }) => {
	const preview = usePathname().startsWith("/preview");

	useEffect(() => {
		if (preview) return;
		const onClick = (e: MouseEvent) => {
			const a = (e.target as Element | null)?.closest?.("a[href]");
			if (!a) return;
			const href = a.getAttribute("href") ?? "";
			const name = eventOf(href);
			const gtag = (window as unknown as { gtag?: Gtag }).gtag;
			if (!name || typeof gtag !== "function") return;
			gtag("event", name, { place: placeOf(a), link_url: href.slice(0, 100) });
		};
		// capture — 새 창을 열거나 페이지를 떠나는 링크도 먼저 보낸다
		document.addEventListener("click", onClick, true);
		return () => document.removeEventListener("click", onClick, true);
	}, [preview]);

	if (preview || !gaId) return null;
	return <GoogleAnalytics gaId={gaId} />;
};
