import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// 커스텀 타이포 토큰(text-h1/h2/title/lead/...)을 font-size 그룹으로 등록한다.
// 미등록 시 tailwind-merge 가 이를 색상 클래스(text-ink/text-white)와 같은 그룹으로 오인해
// 사이즈 클래스를 제거 → 제목이 작게 렌더되는 버그가 발생한다.
const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [
				{
					text: [
						"display",
						"h1",
						"h2",
						"h3",
						"h4",
						"title",
						"lead",
						"body-lg",
						"body",
						"body-sm",
						"caption",
						"meta",
						"overline",
					],
				},
			],
		},
	},
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
