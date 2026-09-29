import { timingSafeEqual } from "node:crypto";
import { notFound } from "next/navigation";
import { sanitizeArticleHtml } from "@/lib/article-html";
import { getDraftColumn } from "@/lib/columns";

/**
 * 어드민 에디터 [미리보기] 탭이 iframe 으로 띄우는 **본문 전용** 초안 화면.
 *
 *   /preview/column/{slug}?token={PREVIEW_SECRET}
 *
 * ★ 공개 상세와 **같은 정화기·같은 `.hug-article` 조판**으로 그린다 — 발행하면 보일 모습 그대로.
 * ★ 토큰을 URL 로 받는다. 어드민은 다른 도메인이라 쿠키에 기댈 수 없다(jcl-homepage 와 같은 방식).
 * ⚠️ PREVIEW_SECRET · SUPABASE_SERVICE_ROLE_KEY 가 없으면 404 — 미리보기만 꺼지고 사이트는 멀쩡하다.
 * ⚠️ 이 경로만 어드민 도메인에서 프레임할 수 있다(next.config.ts 의 preview 헤더).
 */
export const dynamic = "force-dynamic";

export const metadata = {
	title: "초안 미리보기",
	robots: { index: false, follow: false },
};

function sameSecret(a: string, b: string) {
	const x = Buffer.from(a);
	const y = Buffer.from(b);
	return x.length === y.length && timingSafeEqual(x, y);
}

export default async function ColumnBodyPreview({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ token?: string }>;
}) {
	const [{ slug }, { token }] = await Promise.all([params, searchParams]);
	const secret = process.env.PREVIEW_SECRET;
	if (!secret || !sameSecret(token ?? "", secret)) notFound();

	const c = await getDraftColumn(decodeURIComponent(slug));
	if (!c) notFound();

	return (
		<>
			{/* 머리·바닥·떠 있는 버튼을 숨긴다 — 에디터 옆에서 본문만 본다 */}
			<style>{"header,footer,[data-floating]{display:none!important}"}</style>
			<div className="mx-auto max-w-[720px] px-5 py-8">
				<div
					className="hug-article"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitizeArticleHtml() 를 통과한 문자열만 들어온다
					dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(c.bodyHtml) }}
				/>
			</div>
		</>
	);
}
