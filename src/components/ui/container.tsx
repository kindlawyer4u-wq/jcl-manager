import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 콘텐츠 최대폭 1240px + 반응형 좌우 여백(clamp 24→80px). */
export const Container = ({ className, children }: { className?: string; children: ReactNode }) => (
	<div className={cn("mx-auto w-full max-w-[1240px] px-[clamp(1.5rem,5vw,5rem)]", className)}>
		{children}
	</div>
);
