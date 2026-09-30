"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// 배경색 밝기(luminance) 계산 — 헤더 글자색(흰/검정) 자동 결정
const luminance = (color: string) => {
	const m = color.match(/rgba?\(([^)]+)\)/);
	if (!m) return 0;
	const [r, g, b] = m[1].split(",").map((n) => Number.parseFloat(n));
	return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

export const Header = () => {
	const [open, setOpen] = useState(false);
	/*
	 * ★ 섹션 앵커(#problem 등)는 홈에서만 통한다. 칼럼 화면에서 누르면 아무 일도 없었다 —
	 *   홈 밖에서는 `/#problem` 으로 바꿔 홈의 그 섹션으로 보낸다.
	 */
	const home = usePathname() === "/";
	const to = (href: string) => (!home && href.startsWith("#") ? `/${href}` : href);
	// 헤더 뒤 섹션이 어두우면 흰 글자, 밝으면 검정 글자 (헤더 자체는 항상 투명)
	const [dark, setDark] = useState(true);

	useEffect(() => {
		const update = () => {
			const probeY = window.scrollY + 8;
			const sections = Array.from(
				/*
				 * ⚠️ `main > article` 을 함께 본다. 칼럼 상세가 <article> 로 감싸는데
				 *    이걸 빼면 아무 것도 안 맞아 기본값(어두움)으로 떨어지고,
				 *    흰 배경 위에 흰 글씨가 되어 헤더가 통째로 안 보인다(실측).
				 */
				document.querySelectorAll<HTMLElement>("main > section, main > header, main > article"),
			);
			let bg = "rgb(5, 7, 11)";
			for (const s of sections) {
				const top = s.getBoundingClientRect().top + window.scrollY;
				if (probeY >= top && probeY < top + s.offsetHeight) {
					bg = getComputedStyle(s).backgroundColor;
					break;
				}
			}
			setDark(luminance(bg) < 0.6);
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	return (
		<header
			className={cn(
				"fixed inset-x-0 top-0 z-50 bg-transparent transition-colors duration-200",
				dark ? "text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]" : "text-ink",
			)}
		>
			<div className="flex h-16 items-center justify-between px-[clamp(1rem,2.5vw,2.5rem)] md:h-[88px]">
				<a href={home ? "#top" : "/"} className="shrink-0" aria-label={siteConfig.name}>
					<Logo dark={dark} />
				</a>

				<nav className="hidden items-center gap-[clamp(0.5rem,1.5vw,2rem)] lg:flex">
					{siteConfig.nav.map((item) => (
						<a
							key={item.href}
							href={to(item.href)}
							className="w-[clamp(5rem,6.5vw,8rem)] text-center font-bold text-[clamp(15px,1.05vw,18px)] text-current/90 transition-colors hover:text-current"
						>
							{item.label}
						</a>
					))}
				</nav>

				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					className="lg:hidden"
					aria-label="메뉴 토글"
					aria-expanded={open}
				>
					{open ? <X aria-hidden /> : <Menu aria-hidden />}
				</button>
			</div>

			{open ? (
				<nav className="border-white/10 border-t bg-[rgba(5,7,11,0.96)] px-[clamp(1rem,2.5vw,2.5rem)] py-4 text-white lg:hidden">
					<div className="flex flex-col gap-1">
						{siteConfig.nav.map((item) => (
							<a
								key={item.href}
								href={to(item.href)}
								onClick={() => setOpen(false)}
								className="rounded-lg px-2 py-3 font-bold text-body hover:bg-white/5"
							>
								{item.label}
							</a>
						))}
					</div>
				</nav>
			) : null}
		</header>
	);
};
