import type { Metadata } from "next";
import Link from "next/link";
import { ColumnCard } from "@/components/columns/ColumnCard";
import { ContactCta } from "@/components/sections/ContactCta";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/text";
import { listCategories, listColumns, PER_PAGE } from "@/lib/columns";
import { cn } from "@/lib/utils";

/**
 * 칼럼 목록.
 *
 * ── 왜 이 화면이 생겼나 ──────────────────────────────────────────────────
 * 홈의 칼럼 카드가 `jclblog.com` 으로 나가고 있었다. 어렵게 데려온 사람을 다른 사이트로
 * 보내고, 그 글이 쌓아 주는 검색 신뢰도 그쪽에 남는다. 칼럼을 이 사이트 안으로 들인다.
 *
 * ── 정한 것 ──────────────────────────────────────────────────────────────
 * ★ 카드는 홈 섹션의 것을 그대로 쓴다. 목록에 새 디자인을 만들지 않는다.
 * ★ 분류 칩은 **이미 이 사이트의 분류**다(민간임대·건설사 부도·지급 거절·강제집행).
 *   새로 만드는 것이 아니라 있는 것을 쓰는 것이고, 옆의 숫자가 어느 쪽 글이 부족한지 알려 준다.
 * ★ 필터와 페이지를 **주소에 둔다.** 상태로만 두면 뒤로가기가 깨지고 링크를 못 준다.
 * ⚠️ 무한 스크롤을 쓰지 않는다. 검색엔진이 2 페이지를 못 본다.
 */
export const metadata: Metadata = {
	title: "HUG 보증보험 법률 칼럼",
	description:
		"HUG 보증보험 이행청구·지급 거절 대응에 관한 법률 정보입니다. 전문 변호사가 직접 작성했습니다.",
	alternates: { canonical: "/columns" },
};

const num = (v: string | undefined) => {
	const n = Number(v);
	return Number.isInteger(n) && n > 0 ? n : 1;
};

export default async function ColumnsPage({
	searchParams,
}: {
	searchParams: Promise<{ tag?: string; page?: string }>;
}) {
	const { tag, page: rawPage } = await searchParams;
	const page = num(rawPage);

	const [{ rows, total }, categories] = await Promise.all([
		listColumns({ tag, page }),
		listCategories(),
	]);

	const pages = Math.max(1, Math.ceil(total / PER_PAGE));
	const href = (t?: string, p = 1) => {
		const q = new URLSearchParams();
		if (t) q.set("tag", t);
		if (p > 1) q.set("page", String(p));
		const s = q.toString();
		return s ? `/columns?${s}` : "/columns";
	};
	const all = categories.reduce((n, c) => n + c.count, 0);

	return (
		<>
			<section className="bg-surface pt-[clamp(6.5rem,12vh,9rem)] pb-14">
				<Container>
					<div className="text-center">
						<Heading level={1} size="h2" className="text-ink">
							HUG 보증보험 이행청구 법률 정보
						</Heading>
						<Text size="body-lg" className="mx-auto mt-5 max-w-[820px] text-muted-foreground">
							전문 변호사가 직접 작성한 칼럼입니다. 보증보험 이행청구 전 꼭 읽어보세요.
						</Text>
					</div>

					{categories.length > 0 && (
						<nav aria-label="분류" className="mt-9 flex flex-wrap justify-center gap-2">
							<Chip href={href()} on={!tag} label="전체" count={all} />
							{categories.map((c) => (
								<Chip
									key={c.slug}
									href={href(c.slug)}
									on={tag === c.slug}
									label={c.ko}
									count={c.count}
								/>
							))}
						</nav>
					)}

					{rows.length === 0 ? (
						<div className="mt-12 rounded-lg border border-slate-200 border-dashed bg-white/60 px-6 py-16 text-center">
							<p className="font-bold text-body-lg text-ink">
								{tag ? "이 분류에는 아직 글이 없습니다" : "칼럼을 준비하고 있습니다"}
							</p>
							{/* ⚠️ 막다른 길을 만들지 않는다. 다른 분류를 권한다 */}
							<p className="mt-3 text-muted-foreground text-sm">
								{tag ? (
									<Link href={href()} className="text-brand underline underline-offset-4">
										다른 분류 보기
									</Link>
								) : (
									"보증사고·지급 거절 대응에 관한 글이 곧 올라갑니다."
								)}
							</p>
						</div>
					) : (
						<>
							<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{rows.map((c) => (
									<ColumnCard key={c.slug} item={c} />
								))}
							</div>

							{pages > 1 && (
								<nav aria-label="페이지" className="mt-12 flex justify-center gap-2">
									{Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
										<Link
											key={n}
											href={href(tag, n)}
											aria-current={n === page ? "page" : undefined}
											className={cn(
												"min-w-10 rounded-md border px-3 py-2 text-center text-sm transition-colors",
												n === page
													? "border-brand bg-brand font-bold text-white"
													: "border-slate-200 bg-white text-slate-600 hover:border-brand hover:text-brand",
											)}
										>
											{n}
										</Link>
									))}
								</nav>
							)}
						</>
					)}
				</Container>
			</section>

			{/* 목록이 막다른 길이 되면 안 된다. 랜딩과 같은 CTA 를 그대로 놓는다 */}
			<ContactCta />
		</>
	);
}

function Chip({
	href,
	on,
	label,
	count,
}: {
	href: string;
	on: boolean;
	label: string;
	count: number;
}) {
	return (
		<Link
			href={href}
			className={cn(
				"rounded-full border px-4 py-1.5 text-sm transition-colors",
				on
					? "border-brand bg-brand font-bold text-white"
					: "border-slate-200 bg-white text-slate-600 hover:border-brand hover:text-brand",
			)}
		>
			{label}
			<span className={cn("ml-1.5 text-xs", on ? "text-white/70" : "text-slate-400")}>{count}</span>
		</Link>
	);
}
