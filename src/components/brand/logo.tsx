import Image from "next/image";
import { cn } from "@/lib/utils";

/** 헤더 로고 — JCL PARTNERS 워드마크 이미지.
 *  어두운 섹션(dark=true) 위에서는 남색 로고가 안 보이므로 흰색으로 반전. */
export const Logo = ({ dark, className }: { dark?: boolean; className?: string }) => (
	<Image
		src="/header-logo.png"
		alt=""
		width={1305}
		height={226}
		priority
		className={cn("h-8 w-auto md:h-11", dark && "brightness-0 invert", className)}
	/>
);

/** 푸터 워드마크 — JCL / PARTNERS. */
export const Wordmark = ({ className }: { className?: string }) => (
	<span className={cn("inline-flex items-baseline gap-3", className)}>
		<span className="font-extrabold text-[40px] text-ink leading-none">JCL</span>
		<span className="border-ink border-t-2 pt-0.5 font-normal text-h4 text-ink-2">PARTNERS</span>
	</span>
);
