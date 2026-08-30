import sanitizeHtml from "sanitize-html";

/**
 * 붙여넣은 칼럼 HTML 정화 — **조판형 프로필**.
 *
 * ── 부동산 홈페이지와 반대로 간다 ────────────────────────────────────────
 * 그쪽(`jcl-homepage`)의 계약은 「붙여넣은 대로 보이는 것」이다. 그누보드에서 옮겨 온
 * 글이 스타일을 전부 인라인 `style` 에 갖고 있어서, 사이트는 깨지는 곳만 고친다.
 *
 * 이 사이트는 사정이 다르다. **옮겨 올 글이 없고**, 강한 시각 정체성이 있다
 * (brand #1E6BF1 · 라운드 · 900 두께). 회색 세리프로 붙여넣은 본문이 그 안에 들어오면
 * **다른 사이트에서 퍼온 글처럼 보인다.** 그래서 여기서는 **사이트가 모양을 정한다.**
 *
 * ── 무엇을 남기고 무엇을 버리나 ──────────────────────────────────────────
 * ★ 버린다  `style` 전부. 색·크기·굵기·정렬이 글마다 달라지면 조판이 아니다.
 * ★ 남긴다  구조(제목·문단·목록·표·인용·이미지)와 **의미 마커 `data-box`**.
 *
 * ⚠️ `class` 는 통과시키지 않는다. 통과시키면 글쓴이가 사이트의 내부 클래스에 기대게 되고,
 *    CSS 를 고칠 때 글이 깨진다. 의미는 정해진 다섯 개의 `data-box` 로만 받는다.
 */

/** 정해진 다섯 개만. 값을 열어 두면 곧 아무 문자열이나 들어온다 */
const BOXES = ["point", "info", "warn", "sum", "disclaimer"];

export function sanitizeArticleHtml(dirty: string): string {
	if (!dirty) return "";

	const clean = sanitizeHtml(dirty, {
		allowedTags: [
			"div",
			"p",
			"span",
			"br",
			"hr",
			// h1 은 받지 않는다. 페이지 제목이 h1 이라 본문은 h2 부터다
			"h2",
			"h3",
			"h4",
			"strong",
			"b",
			"em",
			"i",
			"u",
			"s",
			"ul",
			"ol",
			"li",
			"blockquote",
			"table",
			"thead",
			"tbody",
			"tfoot",
			"tr",
			"th",
			"td",
			"img",
			"a",
			"figure",
			"figcaption",
		],
		allowedAttributes: {
			// ★ style 이 없다. 이것이 보존형과의 유일하고 결정적인 차이다
			"*": ["data-box"],
			a: ["href", "target", "rel", "title"],
			img: ["src", "alt", "width", "height", "loading"],
			th: ["colspan", "rowspan", "scope"],
			td: ["colspan", "rowspan"],
		},
		allowedSchemes: ["http", "https", "mailto", "tel"],
		allowedSchemesByTag: { img: ["https"] },
		// 모르는 태그는 껍데기만 벗기고 내용은 살린다. 글이 사라지는 것이 더 나쁘다
		nonTextTags: ["style", "script", "textarea", "option", "noscript"],
		transformTags: {
			"*": (tagName, attribs) => {
				const out: Record<string, string> = { ...attribs };

				// 정해진 값이 아닌 data-box 는 버린다
				if (out["data-box"] && !BOXES.includes(out["data-box"])) delete out["data-box"];

				// h1 이 섞여 오면 h2 로 낮춘다. 페이지에 h1 이 둘이면 문서 개요가 깨진다
				if (tagName === "h1") return { tagName: "h2", attribs: out };

				// 바깥 링크는 새 창 + rel. 같은 사이트 링크는 그대로 둔다
				if (tagName === "a" && /^https?:\/\//i.test(out.href ?? "")) {
					out.target = "_blank";
					out.rel = "noreferrer noopener";
				}
				// 본문 이미지는 늦게 불러도 된다. 첫 화면 밖에 있는 것이 대부분이다
				if (tagName === "img") out.loading = "lazy";

				return { tagName, attribs: out };
			},
		},
	});

	return (
		clean
			/*
			 * 표를 가로 스크롤 상자로 감싼다.
			 * ⚠️ 표는 좁은 화면에서 컨테이너를 뚫는다. 조상에 `overflow-x:hidden` 이 있으면
			 *    오른쪽이 **잘려서 읽을 수 없다.** 감싸면 스크롤로 읽힌다.
			 */
			.replace(/<table/g, '<div class="article-scroll"><table')
			.replace(/<\/table>/g, "</table></div>")
			/* 빈 캡션은 아래 여백만 남긴다 */
			.replace(/<figcaption>\s*<\/figcaption>/g, "")
	);
}
