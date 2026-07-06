import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

// 타이포그래피 스케일 — globals.css 의 --text-* 토큰과 1:1 대응
const sizeClass = {
	display: "text-display",
	h1: "text-h1",
	h2: "text-h2",
	h3: "text-h3",
	h4: "text-h4",
	title: "text-title",
	lead: "text-lead",
	"body-lg": "text-body-lg",
	body: "text-body",
	"body-sm": "text-body-sm",
	caption: "text-caption",
	meta: "text-meta",
	overline: "text-overline uppercase",
} as const;

const weightClass = {
	thin: "font-thin",
	extralight: "font-extralight",
	light: "font-light",
	normal: "font-normal",
	medium: "font-medium",
	semibold: "font-semibold",
	bold: "font-bold",
	extrabold: "font-extrabold",
	black: "font-black",
} as const;

export type TextSize = keyof typeof sizeClass;
export type TextWeight = keyof typeof weightClass;

type TextProps = {
	as?: ElementType;
	size?: TextSize;
	weight?: TextWeight;
	balance?: boolean;
	className?: string;
	children: ReactNode;
};

/** 사이즈·굵기를 prop으로 제어하는 텍스트 프리미티브. */
export const Text = ({
	as: Tag = "p",
	size = "body",
	weight,
	balance,
	className,
	children,
}: TextProps) => (
	<Tag
		className={cn(
			sizeClass[size],
			weight && weightClass[weight],
			balance && "text-balance",
			className,
		)}
	>
		{children}
	</Tag>
);

const defaultSize = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "title", 6: "body-lg" } as const;

type HeadingProps = {
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	size?: TextSize;
	weight?: TextWeight;
	className?: string;
	children: ReactNode;
};

/** 시맨틱 heading(h1~h6). level이 태그를, size가 시각 크기를 결정(분리 제어 가능). */
export const Heading = ({
	level = 2,
	size,
	weight = "extrabold",
	className,
	children,
}: HeadingProps) => (
	<Text
		as={`h${level}` as ElementType}
		size={size ?? defaultSize[level]}
		weight={weight}
		balance
		className={className}
	>
		{children}
	</Text>
);
