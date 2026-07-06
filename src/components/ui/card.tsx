import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const cardVariants = cva("rounded-card", {
	variants: {
		variant: {
			// 흰 카드 + 부드러운 그림자 (라이트 섹션)
			default: "bg-white text-ink shadow-card",
			// 흰 카드 + 브랜드 톤 테두리
			outline: "border-[1.5px] border-brand-200 bg-white text-ink",
			// 브랜드/다크 배경 위 글래스
			glass: "border border-white/20 bg-white/10 text-white backdrop-blur-sm",
			// 그림자 없는 플랫
			flat: "bg-white text-ink",
		},
		padding: {
			none: "",
			sm: "p-6",
			md: "p-8",
			lg: "p-8 sm:p-9",
		},
	},
	defaultVariants: { variant: "default", padding: "md" },
});

export const Card = ({
	variant,
	padding,
	className,
	...props
}: ComponentProps<"div"> & VariantProps<typeof cardVariants>) => (
	<div className={cn(cardVariants({ variant, padding }), className)} {...props} />
);
