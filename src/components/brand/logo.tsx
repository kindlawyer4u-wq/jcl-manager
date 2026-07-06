import { cn } from "@/lib/utils";

/** 헤더 마크 — 테두리 박스 "JCL" + 라벨. 색상은 부모(currentColor) 상속(다크/화이트 헤더 겸용).
 *  TODO(client): 실제 로고 이미지가 있으면 박스 대신 next/image 로 교체. */
export const Logo = ({ label, className }: { label?: string; className?: string }) => (
	<span className={cn("flex items-center gap-3", className)}>
		<span className="flex size-[38px] items-center justify-center rounded-md border-[1.5px] border-current/40 font-extrabold text-caption tracking-tight">
			JCL
		</span>
		{label ? <span className="font-extrabold text-title">{label}</span> : null}
	</span>
);

/** 푸터 워드마크 — JCL / PARTNERS. */
export const Wordmark = ({ className }: { className?: string }) => (
	<span className={cn("inline-flex items-baseline gap-3", className)}>
		<span className="font-extrabold text-[40px] text-ink leading-none">JCL</span>
		<span className="border-ink border-t-2 pt-0.5 font-normal text-h4 text-ink-2">PARTNERS</span>
	</span>
);
