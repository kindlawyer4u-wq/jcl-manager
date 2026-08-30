import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ColumnCard } from "@/components/columns/ColumnCard";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/text";
import { homeColumns } from "@/lib/columns";

/**
 * 홈 칼럼 섹션.
 *
 * ★ 전에는 칼럼 네 건이 **코드 배열에 박혀** 있었고 클릭하면 `jclblog.com` 으로 나갔다.
 *   어렵게 데려온 사람을 다른 사이트로 보내고, 그 글이 쌓아 주는 검색 신뢰도 그쪽에 남았다.
 *   이제 DB 에서 최신 네 건을 읽고 `/columns/[slug]` 로 들어간다 — **사이트를 안 떠난다.**
 */
export const Columns = async () => {
	const items = await homeColumns(4);
	// 글이 아직 없으면 섹션을 통째로 비운다. 빈 카드 네 장을 그리지 않는다
	if (items.length === 0) return null;

	return (
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
					{items.map((c) => (
						<ColumnCard key={c.slug} item={c} date={false} />
					))}
				</div>
				<div className="mt-11 text-center">
					<Link
						href="/columns"
						className="inline-flex items-center gap-4 rounded-full bg-brand px-8 py-4 font-bold text-body-lg text-white transition hover:brightness-110"
					>
						<span className="flex size-9 items-center justify-center rounded-full bg-white text-brand">
							<ArrowRight className="size-5" aria-hidden />
						</span>
						칼럼 전체 보기
					</Link>
				</div>
			</Container>
		</section>
	);
};
