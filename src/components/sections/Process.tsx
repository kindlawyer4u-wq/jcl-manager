import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { IconCircle } from "@/components/ui/icon-circle";
import { Text } from "@/components/ui/text";

// TODO(client): 단계별 카피 최종 검수
const steps = [
	{
		n: "01",
		title: "초기 상담 및 사실관계 진단",
		desc: "계약서, 보증증서, 전입 상태, 점유 현황을 검토해 대항력과 보증 구조를 먼저 파악합니다.",
		tag: "전화·카카오·온라인",
	},
	{
		n: "02",
		title: "대항력·보증 기간·계약 종료 구조 정리",
		desc: "전입신고 누락, 갱신 거부, 종료 통지 문제를 정리하고 어떤 순서로 대응할지 결정합니다.",
		tag: "초기 대응 설계",
	},
	{
		n: "03",
		title: "HUG 이행청구 및 보완 대응",
		desc: "필요 서류를 정리해 이행청구를 진행하고, 추가 자료 요구나 심사 지연에 대응합니다.",
		tag: "통상 2~8개월",
	},
	{
		n: "04",
		title: "지급 거절 시 이의신청·소송 대응",
		desc: "부당한 거절 사유가 있다면 이의신청과 후속 소송까지 연결해 권리 회복 절차를 검토합니다.",
		tag: "후속 분쟁 대응",
	},
];

export const Process = () => (
	<section
		id="process"
		className="bg-brand pt-[clamp(5.5rem,7vh,6.5rem)] pb-[clamp(2.5rem,5vh,4rem)] lg:flex lg:min-h-dvh lg:snap-start lg:flex-col lg:justify-center"
	>
		<Container className="grid items-center gap-[clamp(2rem,5vw,4.5rem)] lg:grid-cols-[1fr_1.4fr]">
			<div>
				<h2 className="font-extrabold text-[clamp(2.5rem,4.5vw,4rem)] text-white leading-[1.14] tracking-[-0.02em]">
					HUG 보증보험
					<br />
					이행청구절차
				</h2>
				<Text size="lead" className="mt-6 text-on-brand">
					HUG 상대로 승소 경험을 보유한 부동산전문변호사가 이행청구 절차를 진행해드립니다.
				</Text>
			</div>
			<div className="flex flex-col gap-4">
				{steps.map((s) => (
					<Card key={s.n} padding="sm" className="flex gap-5">
						<IconCircle tone="brand" size="md">
							{s.n}
						</IconCircle>
						<div>
							<h3 className="inline-block border-brand border-b-2 pb-1 font-extrabold text-ink text-title">
								{s.title}
							</h3>
							<Text size="body-sm" className="mt-2.5 text-body">
								{s.desc}
							</Text>
							<div className="mt-2.5 font-bold text-body-sm text-brand">{s.tag}</div>
						</div>
					</Card>
				))}
			</div>
		</Container>
	</section>
);
