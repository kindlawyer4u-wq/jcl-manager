"use client";

import { useEffect, useRef } from "react";

/**
 * 카카오맵 「지도 퍼가기」(roughmap) — **API 키 없이** 사무소 장소를 띄운다.
 *
 * 코드는 카카오맵 → 사무소 장소(place 1435774095) → 지도공유 → HTML 태그 복사 → 소스 생성하기에서 받았다
 * (2026-10-20). 장소가 같으면 `key` 는 바뀌지 않는다. 사무소 장소를 바꾸면 거기서 다시 받는다.
 *
 * ── 왜 공식 붙여넣기 코드를 그대로 쓰지 않나 ──────────────────────────────
 * 카카오 설치 스크립트(roughmapLoader.js)는 다음 스크립트를 **`document.write`** 로 싣는다.
 * 페이지가 다 그려진 뒤(지연 로드)에 부르면 `document.write` 가 막히거나 문서를 지운다.
 * 그래서 불러오는 순간에만 `document.write` 를 가로채, 같은 `<script>` 를 정상적으로 붙인다.
 *
 * ── 왜 화면에 들어올 때 부르나 ────────────────────────────────────────────
 * 지도는 홈 아래쪽(오시는 길)에 있어 첫 화면에서는 카카오 요청이 나가지 않는다
 * — jcl-criminal kakao-roughmap.tsx 와 같은 파일이다(같은 사무소 장소).
 *
 * ⚠️ CSP: script-src 에 t1.kakaocdn.net 이 있어야 한다(next.config.ts).
 * ⚠️ 지도 아래 주소·전화 칸은 globals.css 에서 숨긴다 — 카카오 등록 번호가 대표번호와 다르다.
 * ⚠️ 지도 크기는 픽셀로만 받는다. 그릴 때 칸의 실제 폭·높이를 재서 넘기고, 폭이 바뀌면 다시 그린다.
 */

const ROUGHMAP = { timestamp: "1792462290189", key: "3kcour33rkn" } as const;
const LOADER = "https://t1.kakaocdn.net/kakaomapweb/roughmap/loader/prod/roughmapLoader.js";
/** 지도 아래에 카카오가 붙이는 장소명·로드뷰·길찾기 줄의 높이(px). 칸 높이에서 빼고 지도를 그린다 */
const FOOTER_H = 32;

type Lander = new (o: Record<string, string>) => { render(): void };
declare global {
	interface Window {
		daum?: { roughmap?: { Lander?: Lander } };
	}
}

let loading: Promise<void> | null = null;

function loadRoughmap(): Promise<void> {
	if (window.daum?.roughmap?.Lander) return Promise.resolve();
	if (loading) return loading;
	loading = new Promise<void>((resolve, reject) => {
		const write = document.write;
		/*
		 * 로더가 쓰려는 `<script src="…roughmapLander.js">` 를 받아 직접 붙인다.
		 * ⚠️ 로더가 끝나면 바로 원래 함수로 되돌린다 — 다른 코드의 document.write 를 건드리지 않는다.
		 */
		document.write = (html: string) => {
			const src = /src="([^"]+)"/.exec(html)?.[1]?.replace(/^http:/, "https:");
			if (!src) return;
			/*
			 * ★ 카카오 스크립트는 **페이지의 프로토콜**로 다음 파일·데이터 주소를 만든다. http 로 열린
			 *   화면(로컬 운영 빌드 등)에서는 `http://t1.kakaocdn.net/…` 이 되어 CSP(https 만 허용)에 막혔다(실측).
			 *   항상 https 로 고정한다.
			 */
			const rm = (window.daum as { roughmap?: Record<string, unknown> } | undefined)?.roughmap;
			if (rm) {
				rm.url_protocal = "https:";
				rm.URL_KEY_DATA_LOAD_PRE = "https://t1.kakaocdn.net/roughmap/";
			}
			const lander = document.createElement("script");
			lander.charset = "UTF-8";
			lander.src = src;
			lander.onload = () => resolve();
			lander.onerror = () => reject(new Error("roughmapLander"));
			document.head.appendChild(lander);
		};
		const s = document.createElement("script");
		s.charset = "UTF-8";
		s.className = "daum_roughmap_loader_script";
		s.src = LOADER;
		s.onload = () => {
			document.write = write;
		};
		s.onerror = () => {
			document.write = write;
			reject(new Error("roughmapLoader"));
		};
		document.head.appendChild(s);
	}).catch((e) => {
		loading = null;
		throw e;
	});
	return loading;
}

export function KakaoRoughmap({ title, className }: { title: string; className?: string }) {
	const box = useRef<HTMLElement>(null);

	useEffect(() => {
		const el = box.current;
		if (!el) return;
		let drawnWidth = 0;
		let cancelled = false;

		const draw = () => {
			const Lander = window.daum?.roughmap?.Lander;
			const w = Math.round(el.clientWidth);
			const h = Math.round(el.clientHeight);
			if (!Lander || cancelled || w === 0 || w === drawnWidth) return;
			drawnWidth = w;
			const node = el.querySelector<HTMLDivElement>(`#daumRoughmapContainer${ROUGHMAP.timestamp}`);
			if (node) node.innerHTML = "";
			new Lander({
				timestamp: ROUGHMAP.timestamp,
				key: ROUGHMAP.key,
				mapWidth: String(w),
				mapHeight: String(Math.max(160, h - FOOTER_H)),
			}).render();
		};

		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				io.disconnect();
				loadRoughmap()
					.then(draw)
					.catch(() => {
						// 지도가 못 떠도 주소·길찾기 버튼은 화면에 있다. 칸만 비워 둔다
					});
			},
			{ rootMargin: "300px" },
		);
		io.observe(el);

		let t: ReturnType<typeof setTimeout> | undefined;
		const ro = new ResizeObserver(() => {
			clearTimeout(t);
			t = setTimeout(draw, 200);
		});
		ro.observe(el);

		return () => {
			cancelled = true;
			io.disconnect();
			ro.disconnect();
			clearTimeout(t);
		};
	}, []);

	return (
		<section ref={box} aria-label={title} className={className}>
			<div
				id={`daumRoughmapContainer${ROUGHMAP.timestamp}`}
				className="root_daum_roughmap root_daum_roughmap_landing"
			/>
		</section>
	);
}
