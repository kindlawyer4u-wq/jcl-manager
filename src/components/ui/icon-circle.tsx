import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const sizeClass = {
	sm: "size-8 text-body-sm",
	md: "size-[42px] text-body-lg",
	lg: "size-[54px] text-h4",
} as const;

const toneClass = {
	brand: "bg-brand text-white",
	white: "bg-white text-brand",
	mint: "bg-mint text-dark",
	outline: "border-[1.5px] border-brand text-brand",
} as const;

/** 원형 아이콘/번호 뱃지 (단계 번호, 체크, i, ! 등). */
export const IconCircle = ({
	children,
	size = "md",
	tone = "brand",
	className,
}: {
	children: ReactNode;
	size?: keyof typeof sizeClass;
	tone?: keyof typeof toneClass;
	className?: string;
}) => (
	<span
		className={cn(
			"inline-flex flex-none items-center justify-center rounded-full font-extrabold leading-none",
			sizeClass[size],
			toneClass[tone],
			className,
		)}
	>
		{children}
	</span>
);
