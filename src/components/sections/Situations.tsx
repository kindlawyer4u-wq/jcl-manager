import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/text";

// TODO(client): 카피 최종 검수
const cases = [
	{
		no: "CASE 01",
		title: "전입신고·실거주 요건이 불명확",
		body: "본인이 아닌 친척이나 전차인이 거주 중이거나 전입신고가 누락된 경우 대항력 취득 여부를 즉시 점검해야 합니다.",
	},
	{
		no: "CASE 02",
		title: "HUG 보증 기간 만료·갱신 거부",
		body: "임대인이 보증보험 갱신에 협조하지 않는 경우, 민간임대주택법상 계약 해지 사유에 해당해 법적 대응이 가능합니다.",
	},
	{
		no: "CASE 03",
		title: "전대차 계약으로 HUG 지급 거절 우려",
		body: "전차인이 입주해 있는 경우 HUG가 대항력을 문제 삼아 지급을 거절할 수 있습니다. 사전 대비가 필수입니다.",
	},
	{
		no: "CASE 04",
		title: "HUG에 이행청구를 했으나 지급 거절",
		body: "HUG가 부당하게 지급을 거부한 경우 HUG를 상대로 소송을 제기해 권리를 회복할 수 있습니다. 승소 경험 변호사의 조력이 필요합니다.",
	},
	{
		no: "CASE 05",
		title: "청구 기한·필요 서류를 모르는 경우",
		body: "이행청구는 짧게는 2개월, 길게는 8개월 이상 소요됩니다. 서류 미비로 심사가 지연되면 심리적·경제적 부담이 가중됩니다.",
	},
	{
		no: "CASE 06",
		title: "건설사 회생·파산 절차 진행 중",
		body: "회생·파산 절차 개시 후에는 채권 신고 기한이 정해집니다. 기한을 놓치면 보증금 회수 가능성이 급격히 낮아집니다.",
	},
];

export const Situations = () => (
	<section
		id="situations"
		className="bg-surface pt-[clamp(5rem,6vh,6rem)] pb-[clamp(2rem,4vh,3.5rem)] lg:flex lg:min-h-dvh lg:snap-start lg:flex-col lg:justify-center"
	>
		<Container>
			<Heading level={2} size="h2" className="text-ink">
				이런 상황이라면 지금 바로 검토가 필요합니다
			</Heading>
			<Text size="body-lg" className="mt-4 max-w-[900px] text-muted-foreground">
				아래 상황 중 하나라도 해당된다면 즉시 법률 검토를 받으세요.
			</Text>
			<div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{cases.map((c) => (
					<Card key={c.no} padding="none" className="p-5">
						<Badge className="px-4 py-1.5">{c.no}</Badge>
						<Heading level={3} size="title" className="mt-4 text-ink">
							{c.title}
						</Heading>
						<Text size="body-sm" className="mt-2.5 text-body">
							{c.body}
						</Text>
					</Card>
				))}
			</div>
		</Container>
	</section>
);
