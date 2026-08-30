import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ColumnCard } from "@/components/columns/ColumnCard";
import { JsonLd } from "@/components/JsonLd";
import { ContactCta } from "@/components/sections/ContactCta";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { sanitizeArticleHtml } from "@/lib/article-html";
import { getColumn, relatedColumns } from "@/lib/columns";

/**
 * 칼럼 상세.
 *
 * ── 이 화면의 순서 ───────────────────────────────────────────────────────
 * 읽히는 것이 첫째, 상담으로 이어지는 것이 둘째다. 그래서 본문 폭을 좁히고(720px),
 * 목차를 위에 두고, 끝은 항상 상담으로 닫는다.
 *
 * ── 반드시 있어야 하는 것 ────────────────────────────────────────────────
 * ⚠️ **면책 문구와 광고책임변호사 표기.** 대한변협 광고규정 대응이다.
 *    글쓴이가 빠뜨려도 화면이 붙인다 - 사람이 매번 기억하게 두지 않는다.
 */

const site = (p: string) => `${siteConfig.url.replace(/\/$/, "")}${p}`;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const c = await getColumn(decodeURIComponent(slug));
	if (!c) return { title: "찾을 수 없는 글" };
	return {
		title: c.title,
		description: c.description,
		alternates: { canonical: `/columns/${c.slug}` },
		openGraph: {
			title: c.title,
			description: c.description,
			type: "article",
			url: site(`/columns/${c.slug}`),
			...(c.thumb ? { images: [{ url: c.thumb }] } : {}),
			...(c.publishedAt ? { publishedTime: c.publishedAt } : {}),
		},
	};
}

/** 본문 H2 를 긁어 목차를 만든다. 글쓴이가 따로 적지 않아도 생긴다 */
function toc(html: string) {
	const out: { id: string; text: string }[] = [];
	let i = 0;
	for (const m of html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)) {
		const text = m[1].replace(/<[^>]*>/g, "").trim();
		if (text) out.push({ id: `h-${i}`, text });
		i += 1;
	}
	return out;
}

/** 목차가 걸 수 있게 H2 에 id 를 심는다 */
function withIds(html: string) {
	let i = 0;
	return html.replace(/<h2(\s[^>]*)?>/gi, (_m, attrs = "") => {
		const tag = `<h2 id="h-${i}"${attrs ?? ""}>`;
		i += 1;
		return tag;
	});
}

const fmtDate = (iso: string | null) =>
	iso
		? new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
		: "";

export default async function ColumnDetail({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const c = await getColumn(decodeURIComponent(slug));
	if (!c) notFound();

	const clean = sanitizeArticleHtml(c.bodyHtml);
	const items = toc(clean);
	const body = items.length > 0 ? withIds(clean) : clean;
	const related = await relatedColumns(c.slug, c.categorySlug);

	return (
		<>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "Article",
					headline: c.title,
					description: c.description,
					datePublished: c.publishedAt ?? undefined,
					mainEntityOfPage: site(`/columns/${c.slug}`),
					author: { "@type": "Organization", name: siteConfig.name },
					publisher: { "@type": "Organization", name: siteConfig.name },
					...(c.thumb ? { image: c.thumb } : {}),
				}}
			/>

			<article className="bg-surface pt-[clamp(6.5rem,12vh,9rem)] pb-16">
				<Container>
					<div className="mx-auto max-w-[720px]">
						<nav aria-label="위치" className="text-meta text-slate-400">
							<Link href="/" className="hover:text-brand">
								홈
							</Link>
							<span className="mx-1.5">›</span>
							<Link href="/columns" className="hover:text-brand">
								칼럼
							</Link>
							{c.category && (
								<>
									<span className="mx-1.5">›</span>
									<Link href={`/columns?tag=${c.categorySlug}`} className="hover:text-brand">
										{c.category}
									</Link>
								</>
							)}
						</nav>

						<h1 className="mt-4 font-extrabold text-[clamp(1.6rem,3.4vw,2.1rem)] text-ink leading-[1.32] tracking-tight">
							{c.title}
						</h1>
						<p className="mt-3 text-meta text-slate-400">
							{fmtDate(c.publishedAt)}
							{/* ★ 변호사 이름이 붙은 글과 안 붙은 글은 신뢰가 다르다. AI 답변엔진도 저자 표기를 본다 */}
							<span className="mx-1.5">·</span>
							{siteConfig.adResponsibleLawyer}
						</p>

						{c.thumb && (
							<div className="relative mt-7 aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
								<Image src={c.thumb} alt="" fill sizes="720px" className="object-cover" priority />
							</div>
						)}

						{items.length > 1 && (
							<nav
								aria-label="이 글의 순서"
								className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-4"
							>
								<p className="text-meta text-slate-400">이 글의 순서</p>
								<ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
									{items.map((it) => (
										<li key={it.id}>
											<a href={`#${it.id}`} className="text-brand hover:underline">
												{it.text}
											</a>
										</li>
									))}
								</ol>
							</nav>
						)}

						{/* 본문 조판은 globals.css 의 `.hug-article` 이 전부 그린다 */}
						<div
							className="hug-article mt-9"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitizeArticleHtml() 를 통과한 문자열만 들어온다
							dangerouslySetInnerHTML={{ __html: body }}
						/>

						{/*
						 * ⚠️ 면책·광고책임변호사. 글쓴이가 본문에 안 넣어도 화면이 붙인다 —
						 *    광고규정 대응을 사람의 기억에 맡기지 않는다.
						 */}
						<p className="mt-11 border-slate-200 border-t pt-5 text-slate-500 text-xs leading-relaxed">
							본 칼럼은 일반적인 법률 정보 제공을 목적으로 하며 개별 사건에 대한 법률자문이
							아닙니다. 구체적 사안은 반드시 변호사와 상담하시기 바랍니다.
							<span className="mx-1.5">·</span>
							광고책임변호사 {siteConfig.adResponsibleLawyer}
						</p>

						{related.length > 0 && (
							<section className="mt-14">
								<h2 className="font-bold text-body-lg text-ink">같은 분류의 다른 글</h2>
								<div className="mt-4 grid gap-6 sm:grid-cols-2">
									{related.map((r) => (
										<ColumnCard key={r.slug} item={r} />
									))}
								</div>
							</section>
						)}
					</div>
				</Container>
			</article>

			<ContactCta />
		</>
	);
}
