import type { ReactNode } from "react";

/** 히어로 통계 — 큰 숫자 + 민트 아이콘 + 라벨 (다크 배경 기준). */
export const Stat = ({
	value,
	icon,
	label,
	className,
}: {
	value: string;
	icon?: ReactNode;
	label: string;
	className?: string;
}) => (
	<div className={className}>
		<div className="flex items-center gap-2">
			<span className="font-extrabold text-[clamp(1.875rem,3vw,2.625rem)] text-white">{value}</span>
			{icon ? <span className="flex items-center text-mint">{icon}</span> : null}
		</div>
		<div className="mt-1.5 text-body text-slate-200">{label}</div>
	</div>
);
