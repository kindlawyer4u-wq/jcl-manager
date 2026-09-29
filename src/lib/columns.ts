import "server-only";
import { createClient } from "@supabase/supabase-js";
import { db } from "@/lib/supabase";

/**
 * 칼럼 조회 — HUG 사이트 것만.
 *
 * ── 사이트 필터가 이 파일의 존재 이유다 ──────────────────────────────────
 * ⚠️ 공개 읽기 RLS 는 `is_published` 만 본다. **사이트 구분은 앱이 건다.**
 *    조회를 화면마다 흩어 두면 한 곳에서 `site_id` 를 빼먹는 날 부동산 글이
 *    이 사이트에 뜬다. 그래서 `from("columns")` 를 **여기 밖에서 부르지 않는다.**
 *    화면은 이 파일의 함수만 쓴다.
 */

/** 이 사이트의 키. `sites.key` 와 같아야 한다 */
const SITE_KEY = "hug";

export type ColumnCard = {
	slug: string;
	title: string;
	description: string;
	thumb: string | null;
	category: string;
	categorySlug: string;
	publishedAt: string | null;
};

export type ColumnDetail = ColumnCard & { bodyHtml: string };

export type Category = { slug: string; ko: string; count: number };

const CARD = "slug,title,description,thumb_path,published_at,column_categories(slug,ko)";

type Row = {
	slug: string;
	title: string;
	description: string | null;
	thumb_path: string | null;
	published_at: string | null;
	body_html?: string | null;
	column_categories: { slug: string; ko: string } | { slug: string; ko: string }[] | null;
};

const cat = (v: Row["column_categories"]) => {
	const one = Array.isArray(v) ? v[0] : v;
	return { slug: one?.slug ?? "", ko: one?.ko ?? "" };
};

const toCard = (r: Row): ColumnCard => {
	const c = cat(r.column_categories);
	return {
		slug: r.slug,
		title: r.title,
		description: r.description ?? "",
		thumb: r.thumb_path,
		category: c.ko,
		categorySlug: c.slug,
		publishedAt: r.published_at,
	};
};

/** 이 사이트의 id. 한 번 찾아 두고 모든 조회가 같은 값을 쓴다 */
async function siteId(): Promise<string | null> {
	const sb = db();
	if (!sb) return null;
	const { data } = await sb.from("sites").select("id").eq("key", SITE_KEY).maybeSingle();
	return (data?.id as string) ?? null;
}

/** 한 페이지에 몇 장. 카드가 한 줄 3장이라 3의 배수로 둔다 */
export const PER_PAGE = 9;

export async function listColumns(opts: { tag?: string; page?: number } = {}) {
	const sb = db();
	const id = await siteId();
	if (!sb || !id) return { rows: [] as ColumnCard[], total: 0 };

	const page = Math.max(1, opts.page ?? 1);
	const from = (page - 1) * PER_PAGE;

	let q = sb
		.from("columns")
		.select(CARD, { count: "exact" })
		// ★ 사이트 필터. 빠지면 다른 사이트 글이 이 사이트에 뜬다
		.eq("site_id", id)
		.eq("is_published", true)
		.not("published_at", "is", null)
		.order("published_at", { ascending: false })
		.range(from, from + PER_PAGE - 1);

	if (opts.tag) q = q.eq("column_categories.slug", opts.tag);

	const { data, count } = await q;
	return { rows: ((data ?? []) as Row[]).map(toCard), total: count ?? 0 };
}

export async function getColumn(slug: string): Promise<ColumnDetail | null> {
	const sb = db();
	const id = await siteId();
	if (!sb || !id) return null;

	const { data } = await sb
		.from("columns")
		.select(`${CARD},body_html`)
		.eq("site_id", id)
		.eq("slug", slug)
		.eq("is_published", true)
		.maybeSingle();

	if (!data) return null;
	const r = data as Row;
	return { ...toCard(r), bodyHtml: r.body_html ?? "" };
}

/** 분류 칩. 글이 한 건도 없는 분류는 보여 주지 않는다 - 눌러 봐야 빈 화면이다 */
export async function listCategories(): Promise<Category[]> {
	const sb = db();
	const id = await siteId();
	if (!sb || !id) return [];

	const { data } = await sb
		.from("columns")
		.select("column_categories(slug,ko)")
		.eq("site_id", id)
		.eq("is_published", true);

	const out = new Map<string, Category>();
	for (const r of (data ?? []) as Row[]) {
		const c = cat(r.column_categories);
		if (!c.slug) continue;
		const prev = out.get(c.slug);
		out.set(c.slug, { slug: c.slug, ko: c.ko, count: (prev?.count ?? 0) + 1 });
	}
	return [...out.values()].sort((a, b) => b.count - a.count);
}

/**
 * 같은 분류의 다른 글. 다 읽은 사람을 목록으로 되돌리지 않는다.
 * 두 건이면 충분하다 - 많이 깔면 고르다 지친다.
 */
export async function relatedColumns(slug: string, categorySlug: string, limit = 2) {
	const sb = db();
	const id = await siteId();
	if (!sb || !id || !categorySlug) return [] as ColumnCard[];

	const { data } = await sb
		.from("columns")
		.select(CARD)
		.eq("site_id", id)
		.eq("is_published", true)
		.eq("column_categories.slug", categorySlug)
		.neq("slug", slug)
		.order("published_at", { ascending: false })
		.limit(limit);

	return ((data ?? []) as Row[]).map(toCard);
}

/** 홈 칼럼 섹션 — 최신 네 건. 코드에 박아 두던 배열을 대체한다 */
export async function homeColumns(limit = 4) {
	const { rows } = await listColumns({ page: 1 });
	return rows.slice(0, limit);
}

/**
 * 초안까지 읽는다 — **어드민 미리보기(/preview/column/…) 전용.**
 *
 * ⚠️ service_role 키를 쓴다(RLS 가 초안을 막으므로). 공개 페이지에서 부르면 초안이 새어 나간다.
 *    호출부가 PREVIEW_SECRET 토큰을 먼저 확인해야 한다. 키가 없으면 null — 미리보기만 꺼진다.
 */
export async function getDraftColumn(slug: string): Promise<ColumnDetail | null> {
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	const id = await siteId();
	if (!url || !key || !id) return null;
	const sb = createClient(url, key, { auth: { persistSession: false } });
	const { data } = await sb
		.from("columns")
		.select(`${CARD},body_html`)
		.eq("site_id", id)
		.eq("slug", slug)
		.maybeSingle();
	if (!data) return null;
	const r = data as Row;
	return { ...toCard(r), bodyHtml: r.body_html ?? "" };
}

/**
 * 사이트맵용 — 발행된 글 **전부**의 주소와 발행일.
 * ⚠️ `listColumns` 는 한 페이지(9건)만 준다. 사이트맵이 그걸 쓰던 때는 10번째 글부터 빠졌다.
 * Supabase 는 한 번에 최대 1,000행이라 1,000건씩 끊어 받는다.
 */
export async function allColumnSlugs(): Promise<{ slug: string; publishedAt: string | null }[]> {
	const sb = db();
	const id = await siteId();
	if (!sb || !id) return [];
	const out: { slug: string; publishedAt: string | null }[] = [];
	for (let from = 0; ; from += 1000) {
		const { data } = await sb
			.from("columns")
			.select("slug,published_at")
			.eq("site_id", id)
			.eq("is_published", true)
			.order("published_at", { ascending: false })
			.range(from, from + 999);
		const rows = (data ?? []) as { slug: string; published_at: string | null }[];
		out.push(...rows.map((r) => ({ slug: r.slug, publishedAt: r.published_at })));
		if (rows.length < 1000) break;
	}
	return out;
}
