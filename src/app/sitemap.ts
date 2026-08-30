import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { listColumns } from "@/lib/columns";

/**
 * ⚠️ 전에는 한 장짜리 기준이라 홈 한 줄뿐이었다. 칼럼이 생기면 글마다 주소가 늘어나므로
 *    **자동으로 붙어야** 한다 - 손으로 적으면 발행할 때마다 빠뜨린다.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const base = siteConfig.url.replace(/\/$/, "");
	// 사이트맵은 전량이 필요하다. 한 번에 크게 받아 온다
	const { rows } = await listColumns({ page: 1 });

	return [
		{ url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
		{ url: `${base}/columns`, changeFrequency: "weekly", priority: 0.8 },
		...rows.map((c) => ({
			url: `${base}/columns/${c.slug}`,
			// 구글은 lastmod 가 일관되게 정확할 때만 신뢰해 쓴다. 발행일을 그대로 준다
			lastModified: c.publishedAt ? new Date(c.publishedAt) : undefined,
			changeFrequency: "monthly" as const,
			priority: 0.7,
		})),
	];
}
