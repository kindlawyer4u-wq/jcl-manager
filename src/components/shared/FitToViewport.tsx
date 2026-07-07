"use client";

import { useEffect } from "react";

/**
 * 데스크톱 전용 "한 화면 맞춤 축소".
 * 각 풀페이지 섹션의 정상 흐름 콘텐츠를 뷰포트 높이에 맞춰 transform: scale 로
 * 비례 축소해, 짧은 노트북 화면에서도 스크롤 없이 한 화면에 들어오게 한다.
 * - 섹션 높이는 뷰포트로 고정(overflow hidden)하므로 FullPageScroll 의 섹션 높이
 *   계산과 충돌하지 않는다(섹션은 항상 정확히 1화면).
 * - transform 은 리플로우가 없어(zoom 과 달리) 측정→적용이 1패스로 정확하다.
 * - 마지막 섹션(ContactCta = footer 포함)·모바일(<1024px)에서는 비활성.
 * - FLOOR 미만으로 줄여야 할 만큼 빽빽한 섹션은 축소하지 않고 내부 스크롤을 허용한다.
 */
const FLOOR = 0.6;

export const FitToViewport = () => {
	useEffect(() => {
		const desktop = window.matchMedia("(min-width: 1024px)");

		const sectionsOf = () =>
			Array.from(document.querySelectorAll<HTMLElement>("main > section, main > header"));

		// 섹션의 정상 흐름 콘텐츠(배경 이미지 등 absolute 는 제외). 정확히 하나일 때만 대상.
		const contentOf = (section: HTMLElement): HTMLElement | null => {
			const flow = (Array.from(section.children) as HTMLElement[]).filter((c) => {
				const pos = getComputedStyle(c).position;
				return pos !== "absolute" && pos !== "fixed";
			});
			return flow.length === 1 ? flow[0] : null;
		};

		const reset = (section: HTMLElement, content: HTMLElement) => {
			content.style.transform = "";
			content.style.transformOrigin = "";
			section.style.height = "";
			section.style.overflow = "";
		};

		const apply = () => {
			const on = desktop.matches;
			const vh = window.innerHeight;
			for (const section of sectionsOf()) {
				if (section.querySelector("footer")) continue; // 마지막 섹션(푸터 포함) 제외
				const content = contentOf(section);
				if (!content) continue;
				reset(section, content); // 자연 크기로 되돌린 뒤 측정
				if (!on) continue; // 모바일: 원복만 하고 종료
				const cs = getComputedStyle(section);
				const padY = Number.parseFloat(cs.paddingTop) + Number.parseFloat(cs.paddingBottom);
				const avail = vh - padY;
				const natural = content.offsetHeight;
				if (natural > avail + 1) {
					const scale = avail / natural;
					if (scale >= FLOOR) {
						content.style.transformOrigin = "center center";
						content.style.transform = `scale(${scale})`;
						section.style.height = `${vh}px`;
						section.style.overflow = "hidden";
					}
				}
			}
		};

		let raf = 0;
		const schedule = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(apply);
		};

		schedule();
		window.addEventListener("resize", schedule);
		window.addEventListener("load", schedule);
		if (document.fonts?.ready) document.fonts.ready.then(schedule).catch(() => {});
		const t1 = window.setTimeout(schedule, 300);
		const t2 = window.setTimeout(schedule, 1200);
		// 콘텐츠 높이를 바꾸는 이미지 로드 후 재계산
		const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("main img"));
		for (const img of imgs) {
			if (!img.complete) img.addEventListener("load", schedule, { once: true });
		}

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", schedule);
			window.removeEventListener("load", schedule);
			window.clearTimeout(t1);
			window.clearTimeout(t2);
			for (const section of sectionsOf()) {
				const content = contentOf(section);
				if (content) reset(section, content);
			}
		};
	}, []);

	return null;
};
