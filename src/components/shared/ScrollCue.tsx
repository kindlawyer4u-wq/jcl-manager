"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// 배경 밝기로 큐 색상 결정 (헤더와 동일 로직)
const luminance = (color: string) => {
	const m = color.match(/rgba?\(([^)]+)\)/);
	if (!m) return 0;
	const [r, g, b] = m[1].split(",").map((n) => Number.parseFloat(n));
	return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

const getSections = () =>
	Array.from(document.querySelectorAll<HTMLElement>("main > section, main > header"));
const topOf = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

/**
 * 화면 하단 중앙 고정 스크롤 큐.
 * - 현재 섹션 배경에 맞춰 색 전환(다크→흰색, 라이트→검정)
 * - 마지막 섹션에서는 숨김
 * - 클릭 시 다음 섹션으로 부드럽게 이동
 * - 데스크톱(≥1024px)에서만 표시
 */
export const ScrollCue = () => {
	const [dark, setDark] = useState(true);
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		if (!window.matchMedia("(min-width: 1024px)").matches) {
			setHidden(true);
			return;
		}
		const update = () => {
			const sections = getSections();
			if (sections.length === 0) return;
			const y = window.scrollY;
			let idx = 0;
			sections.forEach((s, i) => {
				if (topOf(s) <= y + 2) idx = i;
			});
			setDark(luminance(getComputedStyle(sections[idx]).backgroundColor) < 0.6);
			setHidden(idx >= sections.length - 1);
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	const goNext = () => {
		const sections = getSections();
		const y = window.scrollY;
		let idx = 0;
		sections.forEach((s, i) => {
			if (topOf(s) <= y + 2) idx = i;
		});
		const next = sections[idx + 1];
		if (next) window.scrollTo({ top: topOf(next), behavior: "smooth" });
	};

	return (
		<button
			type="button"
			onClick={goNext}
			aria-label="다음 섹션으로 스크롤"
			className={cn(
				"fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 flex-col items-center gap-1 transition-opacity duration-300 lg:flex",
				hidden ? "pointer-events-none opacity-0" : "opacity-100",
				dark ? "text-white/75 hover:text-white" : "text-ink/60 hover:text-ink",
			)}
		>
			<span className="text-caption tracking-[0.15em]">Scroll</span>
			<ChevronDown className="size-5 motion-safe:animate-bounce" aria-hidden />
		</button>
	);
};
