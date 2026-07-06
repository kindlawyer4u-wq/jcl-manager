import { Calendar, Phone } from "lucide-react";
import Image from "next/image";
import { Stat } from "@/components/ui/stat";
import { siteConfig } from "@/config/site";

// TODO(client): 통계 수치 사실 확인 (과장 금지)
const stats = [
	{
		value: "약 수억 원",
		icon: <span className="font-extrabold text-[26px] leading-none">₩</span>,
		label: "세대당 피해 보증금",
	},
	{
		value: "2~8개월",
		icon: <Calendar className="size-6" aria-hidden />,
		label: "HUG 이행청구 소요 기간",
	},
	{ value: "24시간", icon: <Phone className="size-6" aria-hidden />, label: "상담 접수" },
];

export const Hero = () => (
	<header
		id="top"
		className="relative isolate flex min-h-dvh items-center overflow-hidden bg-dark lg:snap-start"
	>
		<Image
			src="/images/hero.jpg"
			alt=""
			fill
			priority
			sizes="100vw"
			className="-z-20 object-cover"
		/>
		<div
			aria-hidden
			className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,7,11,0.95)_0%,rgba(5,7,11,0.8)_50%,rgba(5,7,11,0.55)_100%)]"
		/>
		<div className="w-full px-[clamp(1.5rem,4vw,4.5rem)] py-32 [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]">
			<h1 className="font-extrabold text-[clamp(2.25rem,5vw,4.75rem)] text-white leading-[1.15] tracking-[-0.02em]">
				HUG 보증보험 이행청구
				<br />
				부동산전문 변호사 상담
			</h1>
			<p className="mt-8 max-w-[760px] font-medium text-[clamp(1.0625rem,1.5vw,1.375rem)] text-white/95 leading-[1.7]">
				HUG의 부당한 지급 거절로 어려움을 겪고 계신가요?
				<br />
				대항력 요건부터 HUG 지급 거절 대응·소송까지 전담팀이 처음부터 끝까지 책임집니다.
			</p>
			<div className="mt-11 flex flex-wrap gap-4">
				<a
					href={siteConfig.primaryCta.href}
					className="inline-flex items-center gap-2.5 rounded-lg bg-brand px-9 py-4 font-bold text-[18px] text-white transition hover:brightness-110"
				>
					{siteConfig.primaryCta.label}
					<span aria-hidden>→</span>
				</a>
				<a
					href={siteConfig.secondaryCta.href}
					className="inline-flex items-center gap-2.5 rounded-lg border border-white/60 px-9 py-4 font-bold text-[18px] text-white transition hover:bg-white/10"
				>
					{siteConfig.secondaryCta.label}
					<span aria-hidden>→</span>
				</a>
			</div>
			<div className="mt-14 flex flex-wrap gap-[clamp(2rem,5vw,5rem)]">
				{stats.map((s) => (
					<Stat key={s.label} value={s.value} icon={s.icon} label={s.label} />
				))}
			</div>
		</div>
	</header>
);
