// ─────────────────────────────────────────────────────────────────────────────
// 사이트 전역 설정 — 브랜드/연락처/네비게이션의 단일 출처
// 출처: design/home.html (제이씨엘파트너스 / JCL PARTNERS)
// TODO(client): 카카오 채널 URL·도메인·소유확인 코드 실제 값으로 교체
// ─────────────────────────────────────────────────────────────────────────────

/** placeholder 전화번호 감지용(실제 번호와 다르면 JSON-LD에 전화 포함). */
export const DUMMY_TEL = "02-000-0000";

export const siteConfig = {
	name: "제이씨엘파트너스",
	nameEn: "JCL PARTNERS",
	tagline: "HUG 보증보험 이행청구",
	/*
	 * 광고책임변호사. 대한변협 광고규정 대응으로 **칼럼 상세에 반드시 표기**한다.
	 * ⚠️ 글쓴이가 본문에 안 넣어도 화면이 붙인다 - 규정 준수를 사람의 기억에 맡기지 않는다.
	 */
	adResponsibleLawyer: "정종욱",
	// TODO(client): 실제 배포 도메인으로 교체
	url: "https://jclpartners.co.kr",
	title: {
		default: "제이씨엘파트너스 — HUG 보증보험 이행청구 부동산 변호사",
		template: "%s | 제이씨엘파트너스",
	},
	description:
		"HUG의 부당한 지급 거절로 전세보증금을 돌려받지 못하고 계신가요? 대항력 요건부터 지급 거절 대응·소송까지, HUG 보증보험 이행청구 전담팀이 처음부터 끝까지 함께합니다.",
	locale: "ko_KR",
	keywords: [
		"HUG 보증보험",
		"이행청구",
		"전세보증금 반환",
		"보증금 반환 소송",
		"대항력",
		"부동산 변호사",
		"전세사기",
		"강남 변호사",
		"제이씨엘파트너스",
		"JCL PARTNERS",
	],
	// 연락처 — design 기준 실제 값
	contact: {
		tel: "02-2135-4974",
		email: "kindlawyer4u@naver.com",
		address: "서울특별시 강남구 테헤란로 423, 4층",
		addressLocality: "강남구",
		addressRegion: "서울특별시",
		postalCode: "06160",
		kakaoChannel: "https://pf.kakao.com/_jfgxfG",
		naverBlog: "https://blog.naver.com/partners4u",
		blog: "https://jclblog.com/",
		youtube:
			"https://www.youtube.com/@%EC%A0%9C%EC%9D%B4%EC%94%A8%EC%97%98%ED%8C%8C%ED%8A%B8%EB%84%88%EC%8A%A4/videos",
		naverPlace: "https://naver.me/xHghsf16",
		mapUrl: "https://map.kakao.com/",
	},
	// 단일 랜딩 섹션 앵커 (design 기준)
	nav: [
		{ label: "사태의 심각성", href: "#problem" },
		{ label: "검토사항", href: "#situations" },
		{ label: "핵심 요건", href: "#requirements" },
		{ label: "진행 절차", href: "#process" },
		{ label: "전문 변호사", href: "#team" },
		{ label: "칼럼", href: "#columns" },
	],
	primaryCta: { label: "전화 상담", href: "#contact" },
	secondaryCta: { label: "카카오톡 상담", href: "#contact" },
} as const;

export type SiteConfig = typeof siteConfig;
