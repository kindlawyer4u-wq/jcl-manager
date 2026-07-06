import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { IconCircle } from "@/components/ui/icon-circle";
import { Heading, Text } from "@/components/ui/text";

// TODO(client): 카피 최종 검수 (대한변협 광고규정 포함)
const cards = [
	{
		n: "1",
		title: "건설사 회생신청",
		subtitle: "보증금 직접 반환이 어려워진 상황",
		body: "삼일파라뷰 건설사가 회생신청을 하면서 임차인이 임대인에게 직접 보증금을 돌려받기가 사실상 어렵게 됐습니다. 세대당 약 3억 원에 달하는 보증금을 지키려면 HUG(주택도시보증공사) 보증보험 이행청구 절차를 성공시키는 것이 손해를 최소화하는 가장 확실한 방법입니다.",
	},
	{
		n: "2",
		title: "HUG의 부당한 지급거절 증가",
		subtitle: "커져가는 세입자들의 불안",
		body: "보증보험에 가입했음에도 불구하고 이해할 수 없는 사유로 HUG가 지급거절을 하여 피해를 입는 사례가 증가하고 있습니다. 이로 인해 임차인들의 불안감이 커지고 있는 상황입니다.",
	},
	{
		n: "3",
		title: "보증 기간 만료",
		subtitle: "임대인 비협조로 갱신 불가",
		body: "임대차 계약 기간은 남아 있으나 HUG 보증 기간이 만료된 경우, 임대인이 갱신에 협조하지 않는 사례가 발생하고 있습니다. 임차인이 직접 수수료를 부담해서라도 보증 갱신을 완료하는 것이 보증금을 지키는 핵심입니다.",
	},
];

export const Problem = () => (
	<section
		id="problem"
		className="bg-brand pt-[clamp(6rem,7vh,7rem)] pb-[clamp(3rem,6vh,5.25rem)] lg:flex lg:min-h-dvh lg:snap-start lg:flex-col lg:justify-center"
	>
		<Container>
			<Heading level={2} size="h2" className="text-white">
				HUG 지급거절, 사태의 심각성
			</Heading>
			<Text size="body-lg" className="mt-5 max-w-[900px] text-on-brand">
				건설사 회생신청, 전대차로 인한 대항력 문제, HUG의 지급거절 움직임 등 상황이 복잡하게 얽혀
				있습니다. 현재 상황을 정확히 파악하고 대응해야 보증금을 돌려받을 수 있습니다.
			</Text>
			<div className="mt-10 grid gap-6 md:grid-cols-3">
				{cards.map((c) => (
					<Card key={c.n} variant="glass">
						<h3 className="font-extrabold text-h4 text-white">
							{c.n}. {c.title}
						</h3>
						<p className="mt-1 font-extrabold text-title text-white">{c.subtitle}</p>
						<p className="mt-5 text-body text-on-brand-2 leading-relaxed">{c.body}</p>
					</Card>
				))}
			</div>
			<Card variant="flat" className="mt-7 flex items-start gap-5 p-7">
				<IconCircle tone="brand">
					<AlertTriangle className="size-5" aria-hidden />
				</IconCircle>
				<Text className="text-ink-2">
					<strong className="font-extrabold">보증금 반환 문제는 시간과의 싸움</strong>입니다. 대응
					시기를 놓치면 피해가 걷잡을 수 없이 커질 수 있습니다. HUG 이행청구는 서류·기한 요건이
					엄격해 초기 단계부터 철저한 준비가 필요합니다.
				</Text>
			</Card>
		</Container>
	</section>
);
