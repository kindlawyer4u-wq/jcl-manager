import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/text";

// TODO(client): 등록 전문분야명·약력 최종 확인. (세 분 모두 부동산 전문분야 등록 확인됨)
const members = [
	{
		name: "정종욱",
		role: "대표변호사",
		photo: "/images/team/jeong-jonguk.jpg",
		bullets: ["부동산전문 변호사", "HUG 상대 소송 승소 경험 보유"],
	},
	{
		name: "최성민",
		role: "대표변호사",
		photo: "/images/team/choi-seongmin.jpg",
		bullets: ["부동산전문 변호사", "HUG 상대 소송 승소 경험 보유"],
	},
	{
		name: "이상덕",
		role: "대표변호사",
		photo: "/images/team/lee-sangdeok.jpg",
		bullets: ["부동산전문 변호사", "HUG 상대 소송 승소 경험 보유"],
	},
];

export const Team = () => (
	<section
		id="team"
		className="bg-white pt-[clamp(6rem,7vh,7rem)] pb-[clamp(3rem,6vh,5.25rem)] lg:flex lg:min-h-dvh lg:snap-start lg:flex-col lg:justify-center"
	>
		<Container>
			<div className="text-center">
				<Heading level={2} size="h2">
					<span className="text-brand">제이씨엘파트너스</span>{" "}
					<span className="text-ink">HUG 보증보험 이행청구 전담팀</span>
				</Heading>
				<Text size="body-lg" className="mx-auto mt-5 max-w-[820px] text-muted-foreground">
					HUG 보증보험 이행청구 전담팀이 처음부터 끝까지 직접 담당합니다.
				</Text>
			</div>
			<div className="mx-auto mt-11 grid max-w-[1000px] gap-8 sm:grid-cols-3">
				{members.map((m) => (
					<div key={m.name}>
						<div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-slate-900">
							<Image
								src={m.photo}
								alt={`${m.role} ${m.name}`}
								fill
								sizes="(max-width: 640px) 100vw, 320px"
								className="object-cover"
							/>
							<div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(90deg,var(--color-brand-900)_0%,var(--color-brand-600)_50%,var(--color-brand-900)_100%)] px-4 py-3.5 text-center shadow-[0_-12px_26px_rgba(5,7,11,0.4)]">
								<span className="font-medium text-[17px] text-white">
									{m.role} <strong className="font-extrabold">{m.name}</strong>
								</span>
							</div>
						</div>
						<ul className="mt-5 flex flex-col gap-1.5">
							{m.bullets.map((b) => (
								<li key={b} className="flex items-start gap-2.5">
									<span className="mt-2 size-[7px] flex-none rounded-full bg-mint" />
									<span className="text-body text-slate-700">{b}</span>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</Container>
	</section>
);
