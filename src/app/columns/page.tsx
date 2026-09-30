import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ColumnListCard } from "@/components/columns/ColumnListCard";
import { ContactCta } from "@/components/sections/ContactCta";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/text";
import { listCategories, listColumns, PER_PAGE } from "@/lib/columns";

/**
 * 칼럼 목록.
 *
 * ── 왜 이 화면이 생겼나 ──────────────────────────────────────────────────
 * 홈의 칼럼 카드가 `jclblog.com` 으로 나가고 있었다. 어렵게 데려온 사람을 다른 사이트로
 * 보내고, 그 글이 쌓아 주는 검색 신뢰도 그쪽에 남는다. 칼럼을 이 사이트 안으로 들인다.
 *
 * ── 정한 것 ──────────────────────────────────────────────────────────────
 * ★ 카드는 목록 전용(ColumnListCard) — 부동산 사이트 목록과 같은 조판(2026-09-30).
 * ★ 분류 필터는 **이미 이 사이트의 분류**다(민간임대·건설사 부도·지급 거절·강제집행).
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

	/*
	 * ★ 없는 페이지(`?page=99`)는 마지막 페이지로 보낸다. 전에는 「칼럼을 준비하고 있습니다」 가 떠서
	 *   글이 한 건도 없는 사이트처럼 보였다. 범위를 넘으면 DB 가 건수도 주지 않으므로 1쪽으로 센다.
	 */
	if (page > 1 && rows.length === 0) {
		const first = await listColumns({ tag, page: 1 });
		redirect(href(tag, Math.max(1, Math.ceil(first.total / PER_PAGE))));
	}
	/*
	 * 번호는 현재 쪽 앞뒤로 둘씩(최대 다섯)만 보인다 — 글이 쌓여 스무 쪽이 되면 번호가 줄을 넘는다.
	 * 처음·끝으로 가는 길은 «·» 가 맡는다.
	 */
	const from = Math.max(1, Math.min(page - 2, pages - 4));
	const nums = Array.from({ length: Math.min(5, pages) }, (_, i) => from + i);

	return (
		<>
			{/*
			 * ★ 부동산 사이트 칼럼 목록과 같은 구조(2026-09-30): 어두운 머리 → 괘선 필터 → 카드 3열 → 페이지.
			 *   가운데 정렬 제목 + 알약 필터였던 것을 왼쪽 정렬·빵부스러기로 바꿨다 — 「어디에 와 있는지」가
			 *   먼저 보이고, 헤더는 어두운 머리 위에서 흰 글씨로 바뀐다(Header 가 배경 밝기를 잰다).
			 */}
			<header className="bg-dark pt-[clamp(8rem,16vh,11.5rem)] pb-[clamp(3.5rem,8vh,5.5rem)] text-white">
				<Container>
					<nav aria-label="현재 위치" className="mb-7 text-[13px] text-on-dark-muted">
						<Link href="/" className="hover:text-white">
							홈
						</Link>
						<span className="mx-2">·</span>
						<span className="text-white">칼럼</span>
					</nav>
					<p className="font-semibold text-[15px] text-brand-300 tracking-wide">법률 칼럼</p>
					<Heading level={1} size="h1" className="mt-3 break-keep text-white">
						HUG 보증보험 이행청구 법률 정보
					</Heading>
					<Text size="body-lg" className="mt-6 max-w-[640px] break-keep text-on-dark">
						전문 변호사가 직접 작성한 칼럼입니다. 보증보험 이행청구 전 꼭 읽어보세요.
					</Text>
				</Container>
			</header>

			<section className="bg-white pt-12 pb-[clamp(4rem,10vh,7rem)] max-sm:pt-8">
				<Container>
					{/* 분류가 하나뿐이면 필터 줄을 그리지 않는다 — 「전체 · 칼럼」 은 같은 말을 두 번 한다 */}
					{categories.length > 1 && (
						<nav aria-label="분류" className="mb-10 border-line border-b pb-5">
							<ul className="flex flex-wrap items-center gap-x-7 gap-y-3 max-sm:gap-x-5">
								<li>
									<Tab href={href()} on={!tag} label="전체" count={all} />
								</li>
								{categories.map((c) => (
									<li key={c.slug}>
										<Tab href={href(c.slug)} on={tag === c.slug} label={c.ko} count={c.count} />
									</li>
								))}
							</ul>
						</nav>
					)}

					{rows.length === 0 ? (
						<div className="border border-line border-dashed px-6 py-16 text-center">
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
							<ul className="grid grid-cols-3 gap-6 max-sm:grid-cols-1 max-lg:grid-cols-2">
								{rows.map((c) => (
									<li key={c.slug}>
										<ColumnListCard item={c} />
									</li>
								))}
							</ul>

							{/* 한 페이지뿐이어도 그린다 — 목록의 끝이라는 것 자체가 정보다 */}
							<nav aria-label="페이지 목록" className="mt-14 flex justify-center">
								<ul className="flex items-center gap-1">
									{page > 1 && (
										<li>
											<PageLink href={href(tag, 1)} label="첫 페이지">
												«
											</PageLink>
										</li>
									)}
									{page > 1 && (
										<li>
											<PageLink href={href(tag, page - 1)} label="이전 페이지">
												‹
											</PageLink>
										</li>
									)}
									{nums.map((n) => (
										<li key={n}>
											{n === page ? (
												<span
													aria-current="page"
													className="flex size-10 items-center justify-center border-brand border-b-2 font-bold text-brand tabular-nums"
												>
													{n}
												</span>
											) : (
												<PageLink href={href(tag, n)}>{n}</PageLink>
											)}
										</li>
									))}
									{page < pages && (
										<li>
											<PageLink href={href(tag, page + 1)} label="다음 페이지">
												›
											</PageLink>
										</li>
									)}
									{page < pages && (
										<li>
											<PageLink href={href(tag, pages)} label="마지막 페이지">
												»
											</PageLink>
										</li>
									)}
								</ul>
							</nav>
						</>
					)}
				</Container>
			</section>

			{/* 목록이 막다른 길이 되면 안 된다. 랜딩과 같은 CTA 를 그대로 놓는다 */}
			<ContactCta />
		</>
	);
}

/** 분류 하나 — 알약 대신 밑줄. 현재 분류는 링크가 아니다(눌러도 제자리인 링크는 거짓말이다) */
function Tab({
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
	const num = <span className="ml-1.5 text-[13px] text-slate-500 tabular-nums">{count}</span>;
	if (on)
		return (
			<span
				aria-current="true"
				className="border-brand border-b-2 pb-1.5 font-bold text-[17px] text-ink max-sm:text-[16px]"
			>
				{label}
				{num}
			</span>
		);
	return (
		<Link
			href={href}
			className="border-transparent border-b-2 pb-1.5 text-[17px] text-slate-600 transition-colors hover:text-ink max-sm:text-[16px]"
		>
			{label}
			{num}
		</Link>
	);
}

function PageLink({
	href,
	label,
	children,
}: {
	href: string;
	label?: string;
	children: React.ReactNode;
}) {
	return (
		<Link
			href={href}
			aria-label={label}
			className="flex size-10 items-center justify-center text-slate-600 tabular-nums transition-colors hover:text-ink"
		>
			{children}
		</Link>
	);
}
