import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type Tone = "light" | "surface" | "brand" | "dark";

// 섹션 배경 톤 — 디자인의 4가지 그라운드
const toneClass: Record<Tone, string> = {
	light: "bg-white text-ink",
	surface: "bg-surface text-ink",
	brand: "bg-brand text-white",
	dark: "bg-dark text-white",
};

/** 표준 세로 패딩(clamp 48→84px) + 배경 톤 + 내부 Container. */
export const Section = ({
	id,
	tone = "light",
	className,
	containerClassName,
	children,
}: {
	id?: string;
	tone?: Tone;
	className?: string;
	containerClassName?: string;
	children: ReactNode;
}) => (
	<section
		id={id}
		className={cn("scroll-mt-24 py-[clamp(3rem,6vh,5.25rem)]", toneClass[tone], className)}
	>
		<Container className={containerClassName}>{children}</Container>
	</section>
);
