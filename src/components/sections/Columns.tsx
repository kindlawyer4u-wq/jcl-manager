import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/text";
import { siteConfig } from "@/config/site";

// jclblog.com 실제 칼럼 연동. 광고규정상 '전부 승소' 등 결과 단정 대신 정보성 제목 사용.
const columns = [
	{
		tag: "민간임대",
		title: "삼일 파라뷰 사태, 민간임대 보증사고 이행청구 대응법",
		image: "/images/col-1.jpg",
		href: "https://jclblog.com/bbs/board.php?bo_table=column&wr_id=107",
	},
	{
		tag: "건설사 부도",
		title: "건설사 부도로 인한 민간임대 보증금, 반환받는 절차",
		image: "/images/col-2.jpg",
		href: "https://jclblog.com/bbs/board.php?bo_table=column&wr_id=111",
	},
	{
		tag: "지급 거절",
		title: "묵시적 갱신을 이유로 한 HUG 지급 거절, 대응 방법",
		image: "/images/col-3.jpg",
		href: "https://jclblog.com/bbs/board.php?bo_table=column&wr_id=106",
	},
	{
		tag: "강제집행",
		title: "HUG 지급 거절 시 소송·계좌압류로 보증금 회수하기",
		image: "/images/col-4.jpg",
		href: "https://jclblog.com/bbs/board.php?bo_table=column&wr_id=94",
	},
];

export const Columns = () => (
	<section
		id="columns"
		className="bg-surface pt-[clamp(6rem,7vh,7rem)] pb-[clamp(3rem,6vh,5.25rem)] lg:flex lg:min-h-dvh lg:snap-start lg:flex-col lg:justify-center"
	>
		<Container>
			<div className="text-center">
				<Heading level={2} size="h2" className="text-ink">
					HUG 보증보험 이행청구 알아두면 좋은 법률 정보
				</Heading>
				<Text size="body-lg" className="mx-auto mt-5 max-w-[820px] text-muted-foreground">
					전문 변호사가 직접 작성한 칼럼입니다. 보증보험 이행청구 전 꼭 읽어보세요.
				</Text>
			</div>
			<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{columns.map((c) => (
					<a
						key={c.title}
						href={c.href}
						target="_blank"
						rel="noopener noreferrer"
						className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
					>
						<div className="relative aspect-[16/10] bg-slate-800">
							<Image
								src={c.image}
								alt=""
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
								className="object-cover transition duration-300 group-hover:scale-105"
							/>
							<div aria-hidden className="absolute inset-0 bg-slate-950/25" />
							<Badge variant="ghost" className="absolute top-4 left-4 px-4 py-1.5">
								{c.tag}
							</Badge>
						</div>
						<div className="flex flex-1 flex-col p-6">
							<h3 className="font-bold text-body-lg text-ink leading-snug group-hover:text-brand">
								{c.title}
							</h3>
							<div className="mt-auto pt-7 text-right text-meta text-slate-400">
								제이씨엘파트너스 변호사 칼럼
							</div>
						</div>
					</a>
				))}
			</div>
			<div className="mt-11 text-center">
				<a
					href={siteConfig.contact.blog}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-4 rounded-full bg-brand px-8 py-4 font-bold text-body-lg text-white transition hover:brightness-110"
				>
					<span className="flex size-9 items-center justify-center rounded-full bg-white text-brand">
						<ArrowRight className="size-5" aria-hidden />
					</span>
					블로그에서 칼럼 전체 보기
				</a>
			</div>
		</Container>
	</section>
);
