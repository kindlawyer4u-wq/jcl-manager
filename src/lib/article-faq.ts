/**
 * 칼럼 본문에서 FAQ(질문·답) 쌍을 뽑는다 — FAQPage JSON-LD 용.
 *
 * ── 왜 본문에서 뽑나 ──────────────────────────────────────────────────────
 * 변호사님은 어드민 에디터에 FAQ 를 **글로** 쓴다(「Q. …」 다음 문단 「A. …」).
 * 따로 입력 칸을 만들면 두 곳을 맞춰야 하고, 결국 한쪽이 비게 된다.
 * 본문이 원본이고 구조화 데이터는 거기서 파생한다.
 *
 * ── 규칙 ──────────────────────────────────────────────────────────────────
 * 블록 태그(div · p · li · h1~h6 · tr · td · th · dt · dd) 경계에서 줄을 나눠 글을 줄 단위로 읽는다.
 * 「Q.」로 시작하는 줄 **바로 다음 줄**이 답이다.
 *  - 답이 「A.」로 시작하면 그대로 쓴다.
 *  - 「A.」가 없어도 다음 줄이 질문이 아니고 15자 이상이면 답으로 본다 — 실제로 「A.」 없이
 *    답만 쓴 글이 있다(부동산 `승소사례-상가권리금`, 2026-10-12).
 * ★ 실제 글의 FAQ 모양이 셋이다(2026-10-12 운영 57편 실측). 셋 다 읽는다.
 *    ① `<p>Q.</p><p>A.</p>`  ② `<div><strong>Q.</strong><p>A.</p></div>`  ③ `<div>Q.</div><p>A.</p>`
 *    표 안에 있어도 된다.
 * ⚠️ 답은 한 줄만 쓴다. 뒤 줄까지 이어 붙이면 FAQ 뒤에 오는 「기업 정보」 표 같은 것을
 *    답으로 삼키게 된다.
 * ⚠️ 구글은 FAQ 리치결과를 정부·보건 사이트에만 보여 준다. 이것은 검색 결과 장식이 아니라
 *    AI 답변엔진·네이버가 질문과 답을 기계적으로 읽게 하려는 것이다.
 */

const BREAK =
	/<\/?(div|p|li|h[1-6]|tr|td|th|dt|dd|ul|ol|table|tbody|thead|section|blockquote)\b[^>]*>/gi;
const Q = /^Q\s*\d*\s*[.:．)]\s*/i;
const A = /^A\s*\d*\s*[.:．)]\s*/i;

const ENTITIES: Record<string, string> = {
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&quot;": '"',
	"&#39;": "'",
	"&#x27;": "'",
	"&nbsp;": " ",
};

function lines(html: string): string[] {
	return (
		html
			// `<br>` 은 줄을 나누지 않는다 — 한 문장 안의 줄바꿈이다
			.replace(/<br\s*\/?>/gi, " ")
			.replace(BREAK, "\n")
			.replace(/<[^>]+>/g, "")
			.replace(/&(amp|lt|gt|quot|nbsp|#39|#x27);/g, (m) => ENTITIES[m] ?? m)
			.split("\n")
			.map((l) => l.replace(/\s+/g, " ").trim())
			.filter(Boolean)
	);
}

export function extractFaq(html: string): { q: string; a: string }[] {
	const ls = lines(html);
	const out: { q: string; a: string }[] = [];
	for (let i = 0; i < ls.length - 1; i += 1) {
		const q = ls[i] as string;
		const a = ls[i + 1] as string;
		if (!Q.test(q) || Q.test(a)) continue;
		if (!A.test(a) && a.length < 15) continue;
		out.push({ q: q.replace(Q, ""), a: a.replace(A, "") });
		i += 1;
	}
	return out;
}
