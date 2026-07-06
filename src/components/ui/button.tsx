import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-bold transition-[filter,background-color,color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				// 파란 솔리드 (주 CTA)
				primary: "bg-brand text-white hover:brightness-110",
				// 다크/브랜드 배경 위 아웃라인
				onDark: "border border-white/35 text-white hover:bg-white/10",
				// 라이트 배경 위 아웃라인
				outline: "border border-brand text-brand hover:bg-brand-50",
				// 텍스트 버튼
				ghost: "text-brand hover:bg-brand-50",
			},
			size: {
				lg: "px-10 py-[18px] text-body-lg",
				md: "px-7 py-3.5 text-body",
				sm: "px-5 py-2.5 text-caption",
			},
		},
		defaultVariants: { variant: "primary", size: "lg" },
	},
);

type Variants = VariantProps<typeof buttonVariants>;

export const Button = ({
	variant,
	size,
	className,
	...props
}: ComponentProps<"button"> & Variants) => (
	<button className={cn(buttonVariants({ variant, size }), className)} {...props} />
);

/** 앵커(<a>)로 렌더되는 버튼. 섹션 앵커/외부 링크 CTA 용. */
export const ButtonLink = ({
	variant,
	size,
	className,
	children,
	...props
}: ComponentProps<"a"> & Variants) => (
	<a className={cn(buttonVariants({ variant, size }), className)} {...props}>
		{children}
	</a>
);
