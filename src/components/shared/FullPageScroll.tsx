"use client";

import { useEffect } from "react";

/**
 * 데스크톱 전체화면 넘기기 스크롤 (fullPage 스타일).
 * - 화면에 맞는 섹션: 네이티브 스크롤을 완전히 차단하고 휠 한 번에 한 섹션씩 전환
 *   → 항상 섹션 경계에 정확히 정렬(중간에 걸치거나 이전 섹션이 남지 않음).
 * - 화면보다 확실히 큰 섹션(내용 오버플로): 끝/처음에 닿기 전까지 일반 스크롤 허용.
 * - 브라우저 줌/리사이즈 시 현재 섹션으로 자동 재정렬(어긋남 방지).
 * - 모바일(<1024px)·prefers-reduced-motion 에서는 비활성(네이티브 스크롤).
 */
export const FullPageScroll = () => {
	useEffect(() => {
		const desktop = window.matchMedia("(min-width: 1024px)");
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
		// 데스크톱(≥1024px)에서만 활성. 창 크기를 실시간 재확인하므로
		// 데스크톱→모바일 폭으로 줄여도 즉시 네이티브 스크롤로 전환된다.
		const enabled = () => desktop.matches && !reduce.matches;

		let animating = false;
		let timer: number | undefined;
		let resizeTimer: number | undefined;
		const topOf = (el: HTMLElement) => Math.round(el.getBoundingClientRect().top + window.scrollY);
		const getSections = () =>
			Array.from(document.querySelectorAll<HTMLElement>("main > section, main > header"));

		const onWheel = (e: WheelEvent) => {
			// 모바일 폭·감소된 모션: 페이지 넘김 비활성화 → 네이티브 스크롤
			if (!enabled()) return;
			// 애니메이션 중에는 모든 입력 차단
			if (animating) {
				e.preventDefault();
				return;
			}

			const sections = getSections();
			if (sections.length === 0) return;

			const y = window.scrollY;
			const vh = window.innerHeight;
			let idx = 0;
			sections.forEach((s, i) => {
				if (topOf(s) <= y + 2) idx = i;
			});
			const cur = sections[idx];
			const curTop = topOf(cur);
			const curBottom = curTop + cur.offsetHeight;
			const down = e.deltaY > 0;

			// 화면보다 "확실히" 큰 섹션만 내부 스크롤 허용.
			// 여유(80px)까지는 strict 페이징(패딩만 살짝 클리핑) → 애매한 내부 스크롤 방지
			const overflows = cur.offsetHeight > vh + 80;
			if (overflows) {
				if (down && y + vh < curBottom - 4) return; // 아직 섹션 끝이 아님 → 네이티브 스크롤
				if (!down && y > curTop + 4) return; // 아직 섹션 처음이 아님 → 네이티브 스크롤
			}

			// 여기부터는 페이지 전환 구간 → 네이티브 스크롤 완전 차단(미세 드리프트 방지)
			e.preventDefault();
			if (Math.abs(e.deltaY) < 4) return; // 미세 입력은 전환하지 않음(그대로 정렬 유지)

			const target = sections[down ? idx + 1 : idx - 1];
			if (!target) return;

			animating = true;
			window.scrollTo({ top: topOf(target), behavior: "smooth" });
			window.clearTimeout(timer);
			timer = window.setTimeout(() => {
				animating = false;
			}, 900);
		};

		// 줌/리사이즈 시 가장 가까운 섹션으로 즉시 재정렬 (해상도 변경에 자동 대응)
		const onResize = () => {
			if (!enabled()) return; // 모바일 폭에서는 재정렬하지 않음
			window.clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(() => {
				const sections = getSections();
				if (sections.length === 0) return;
				const y = window.scrollY;
				let nearest = sections[0];
				let best = Number.POSITIVE_INFINITY;
				for (const s of sections) {
					const d = Math.abs(topOf(s) - y);
					if (d < best) {
						best = d;
						nearest = s;
					}
				}
				window.scrollTo({ top: topOf(nearest), behavior: "auto" });
			}, 120);
		};

		window.addEventListener("wheel", onWheel, { passive: false });
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("wheel", onWheel);
			window.removeEventListener("resize", onResize);
			window.clearTimeout(timer);
			window.clearTimeout(resizeTimer);
		};
	}, []);

	return null;
};
