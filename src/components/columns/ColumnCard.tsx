import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ColumnCard as Card } from "@/lib/columns";

/**
 * 칼럼 카드 — 홈 섹션·목록·관련 글이 **모두 이것 하나를** 쓴다.
 *
 * ★ 홈에 있던 카드 마크업을 그대로 옮겼다. 목록에 새 디자인을 만들면 같은 것이
 *   두 벌이 되고, 한쪽만 고치는 날이 온다.
 * ★ 썸네일이 없는 글이 생긴다. 그때 그리드가 무너지지 않게 **분류 이름을 얹은
 *   단색 면**으로 대신한다 — 빈 칸을 두면 카드 높이가 서로 달라진다.
 */
export function ColumnCard({ item, date = true }: { item: Card; date?: boolean }) {
	return (
		<Link
			href={`/columns/${item.slug}`}
			className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
		>
			<div className="relative aspect-[16/10] bg-slate-800">
				{item.thumb ? (
					<Image
						src={item.thumb}
						alt=""
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
						className="object-cover object-bottom transition duration-300 group-hover:scale-105"
					/>
				) : (
					<div
						aria-hidden
						className="absolute inset-0 bg-gradient-to-br from-brand-700 to-slate-800"
					/>
				)}
				<div aria-hidden className="absolute inset-0 bg-slate-950/25" />
				{item.category && (
					<Badge variant="ghost" className="absolute top-4 left-4 px-4 py-1.5">
						{item.category}
					</Badge>
				)}
			</div>
			<div className="flex flex-1 flex-col p-6">
				<h3 className="font-bold text-body-lg text-ink leading-snug group-hover:text-brand">
					{item.title}
				</h3>
				<div className="mt-auto pt-7 text-right text-meta text-slate-400">
					{/* 법률 정보는 언제 쓴 글인지가 신뢰의 절반이다 */}
					{date && item.publishedAt
						? new Date(item.publishedAt).toLocaleDateString("ko-KR", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})
						: "제이씨엘파트너스 변호사 칼럼"}
				</div>
			</div>
		</Link>
	);
}
