import Image from "next/image";
import Link from "next/link";
import type { ColumnCard as Card } from "@/lib/columns";

/**
 * 칼럼 **목록** 카드 — `/columns` 전용(2026-09-30 변호사님 요청: 「jcl-homepage 처럼」).
 *
 * ★ 홈 섹션 카드(ColumnCard)는 그대로 둔다. 홈은 사진 위에 분류를 얹은 광고형 카드이고,
 *   목록은 **읽을 글을 고르는 곳**이라 요약·날짜가 보여야 한다. 부동산 사이트 목록과 같은 조판이다:
 *   16:10 이미지 → 분류·날짜 한 줄 → 제목 3줄 → 요약 2줄. 모서리 없이 괘선 하나로 나눈다.
 * ★ 제목·요약을 줄 수로 잘라 같은 줄의 카드 높이를 맞춘다.
 * ★ 잘릴 때 **아래를 남긴다**(object-bottom). 대표 이미지는 오른쪽 아래에 JCL 로고가 박힌 형식인데,
 *   4:3 이미지가 16:10 칸에서 가운데 기준으로 잘리면 로고가 반쯤 잘려 나갔다(실측 2026-09-30).
 * ★ 대표 이미지가 없는 글은 남색 판 위에 로고를 깐다 — 빈 칸이면 카드 높이가 어긋나 보인다.
 * ⚠️ 안쪽은 전부 `span` 이다. `<a>` 안에 `h3`·`p` 를 넣으면 하이드레이션 경고가 난다.
 */
export function ColumnListCard({ item }: { item: Card }) {
	return (
		<Link
			href={`/columns/${item.slug}`}
			className="group flex h-full flex-col border border-line bg-white transition-colors hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
		>
			<span className="relative block aspect-[16/10] w-full overflow-hidden bg-brand-950">
				{item.thumb ? (
					<Image
						src={item.thumb}
						alt=""
						fill
						sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
						className="object-cover object-bottom transition-transform duration-500 group-hover:scale-[1.03]"
					/>
				) : (
					<span aria-hidden className="absolute inset-0 flex items-center justify-center">
						<Image
							src="/header-logo.png"
							alt=""
							width={1305}
							height={226}
							className="w-[46%] opacity-80 brightness-0 invert"
						/>
					</span>
				)}
			</span>

			<span className="flex flex-1 flex-col p-6 max-sm:p-5">
				<span className="flex items-baseline justify-between gap-3 text-[13px]">
					<span className="truncate font-semibold text-brand">{item.category}</span>
					{item.publishedAt && (
						<time dateTime={item.publishedAt} className="shrink-0 text-slate-500 tabular-nums">
							{new Date(item.publishedAt).toLocaleDateString("ko-KR", {
								year: "numeric",
								month: "2-digit",
								day: "2-digit",
							})}
						</time>
					)}
				</span>

				<span className="mt-3 line-clamp-3 break-keep font-bold text-[19px] text-ink leading-[1.5] tracking-tight group-hover:underline max-sm:text-[18px]">
					{item.title}
				</span>

				{item.description && (
					<span className="mt-2.5 line-clamp-2 break-keep text-[15px] text-slate-600 leading-[1.7]">
						{item.description}
					</span>
				)}
			</span>
		</Link>
	);
}
