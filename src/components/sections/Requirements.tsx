import { Check, Info } from "lucide-react";
import { Container } from "@/components/ui/container";
import { IconCircle } from "@/components/ui/icon-circle";
import { Heading, Text } from "@/components/ui/text";

// TODO(client): 요건·설명 카피 최종 검수
const rows = [
	{
		title: "대항력 확보",
		desc: "확정일자 + 실거주(점유) + 전입신고, 세 가지가 모두 충족되어야 대항력이 인정됩니다. 전차인이 거주하는 경우에는 전차인 명의의 전입신고가 필수입니다.",
		note: "전입신고가 누락됐다면 지금 즉시 처리하세요. 이미 늦었다고 포기하지 마세요.",
	},
	{
		title: "보증 기간 유지·갱신",
		desc: "HUG 보증 기간 내에 계약이 종료되어야 청구권이 발생합니다. 임대인이 갱신을 거부할 경우, 임차인이 직접 수수료를 부담해서라도 갱신을 완료해야 합니다.",
		note: "보증 갱신 거부는 민간임대주택법상 계약 해지 사유. 법적 해지 통보 후 이행청구 진입 가능.",
	},
	{
		title: "내용증명·서류 완비",
		desc: "계약 해지 통보, 임차권 등기 명령, 이행청구 서류 등 각 단계별 문서가 법적 요건에 맞게 준비되어야 합니다. 내용증명 한 통에도 법률적 정교함이 필요합니다.",
		note: "서류 미비는 심사 지연·거절의 주요 원인. 초기부터 전문가 검토 필수.",
	},
	{
		title: "반드시 되찾겠다는 강한 의지",
		desc: "반드시 보증금을 돌려받겠다는 강한 의지가 있어야 합니다. 소송 결과는 당사자의 의지가 만들어냅니다. 포기하지 않고 끝까지 대응하는 의뢰인 곁에서 제이씨엘파트너스가 함께합니다.",
		note: "지금 당장 첫 걸음을 내딛으세요. 상담은 24시간 접수합니다.",
	},
];

export const Requirements = () => (
	<section
		id="requirements"
		className="bg-surface pt-[clamp(4rem,7vh,6.5rem)] pb-[clamp(2rem,5vh,4rem)] lg:flex lg:min-h-dvh lg:snap-start lg:flex-col lg:justify-center"
	>
		<Container className="max-w-[1400px]">
			<div className="text-center">
				<Heading level={2} size="h2" className="text-ink">
					보증보험 이행청구, 이 네 가지가 결정합니다
				</Heading>
				<Text size="body-lg" className="mx-auto mt-4 max-w-[820px] text-muted-foreground">
					HUG 심사는 아래 요건을 기준으로 진행됩니다. 하나라도 빠지면 지급이 거절되거나 지연될 수
					있습니다.
				</Text>
			</div>
			<div className="mt-[clamp(1rem,2.6vh,1.75rem)] flex flex-col gap-[clamp(0.6rem,1.4vh,1rem)]">
				{rows.map((r) => (
					<div key={r.title} className="grid items-stretch gap-2 md:grid-cols-[1.6fr_1fr] md:gap-5">
						{/* 왼쪽: 요건 카드 (파란 테두리 2px, 오른쪽과 높이 일치) */}
						<div className="flex h-full items-start gap-4 rounded-card border-2 border-brand-200 bg-white p-[clamp(0.9rem,1.9vh,1.5rem)]">
							<IconCircle tone="brand" size="sm">
								<Check className="size-4" aria-hidden />
							</IconCircle>
							<div>
								<Heading level={3} size="title" className="text-ink">
									{r.title}
								</Heading>
								<Text size="body-sm" className="mt-[clamp(0.25rem,0.8vh,0.5rem)] text-body">
									{r.desc}
								</Text>
							</div>
						</div>
						{/* 오른쪽: 말풍선 (왼쪽 카드와 동일 높이) */}
						<div className="relative flex h-full items-center gap-4 rounded-card bg-brand p-[clamp(0.9rem,1.9vh,1.5rem)]">
							<span
								aria-hidden
								className="absolute top-1/2 -left-3 hidden -translate-y-1/2 border-y-[12px] border-y-transparent border-r-[14px] border-r-brand md:block"
							/>
							<IconCircle tone="white" size="sm">
								<Info className="size-4" aria-hidden />
							</IconCircle>
							<Text size="body-sm" weight="medium" className="text-on-brand-2">
								{r.note}
							</Text>
						</div>
					</div>
				))}
			</div>
		</Container>
	</section>
);
