import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

/**
 * 발행 웹훅 — 어드민이 칼럼을 발행·수정·삭제한 뒤 부른다(jcl-admin src/lib/site.ts revalidateSite).
 *
 *   POST /api/revalidate   Authorization: Bearer <REVALIDATE_SECRET>   { "tag": "columns", "slug": "…" }
 *
 * ★ 홈(최신 칼럼 네 건)과 사이트맵은 미리 구운 페이지라 여기서 비워야 **즉시** 바뀐다.
 *   목록·상세는 매번 새로 읽으므로 비울 것이 없지만 함께 비워도 해가 없다.
 * ⚠️ 시크릿이 없으면 **닫는다**(404). 홈은 5분 ISR 이 받쳐 주므로 이 경로 없이도 결국 반영된다.
 */
function sameSecret(a: string, b: string) {
	const x = Buffer.from(a);
	const y = Buffer.from(b);
	return x.length === y.length && timingSafeEqual(x, y);
}

export async function POST(req: NextRequest) {
	const secret = process.env.REVALIDATE_SECRET;
	const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
	if (!secret || !sameSecret(bearer, secret)) return Response.json({ ok: false }, { status: 404 });

	const body = (await req.json().catch(() => ({}))) as { slug?: unknown };
	const paths = ["/", "/columns", "/sitemap.xml"];
	if (typeof body.slug === "string" && /^[a-z0-9가-힣-]{1,165}$/i.test(body.slug)) {
		paths.push(`/columns/${body.slug}`);
	}
	for (const p of paths) revalidatePath(p);
	// 목록·글 조회 캐시(lib/columns.ts)도 비운다 — 경로만 비우면 캐시된 조회값으로 다시 그린다
	revalidateTag("columns", "max");
	return Response.json({ ok: true, revalidated: paths });
}
