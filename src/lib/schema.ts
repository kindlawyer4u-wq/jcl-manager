// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD 구조화 데이터 빌더 (SEO + AEO)
// schema.org 타입으로 검색엔진·AI 답변엔진이 콘텐츠를 이해하게 한다.
// 콘텐츠 아키텍처(단일/멀티)와 무관하게 쓸 수 있도록 파라미터 타입을 자체 정의.
// ─────────────────────────────────────────────────────────────────────────────
import { DUMMY_TEL, siteConfig } from "@/config/site";

const abs = (path: string) => new URL(path, siteConfig.url).toString();

/** 조직 + 법률서비스(LegalService = LocalBusiness 확장). 전역 레이아웃에서 1회 렌더. */
export const organizationSchema = () => ({
	"@context": "https://schema.org",
	"@type": ["Organization", "LegalService"],
	"@id": `${siteConfig.url}/#organization`,
	name: siteConfig.name,
	alternateName: siteConfig.nameEn,
	url: siteConfig.url,
	// 검색 결과·지식 패널의 로고. 파비콘(src/app/icon.png)과 같은 JCL 마크다
	logo: `${siteConfig.url}/icon.png`,
	description: siteConfig.description,
	// placeholder 전화번호는 노출하지 않는다 (실제 번호 입력 시 자동 포함)
	...((siteConfig.contact.tel as string) !== DUMMY_TEL && { telephone: siteConfig.contact.tel }),
	email: siteConfig.contact.email,
	address: {
		"@type": "PostalAddress",
		streetAddress: siteConfig.contact.address,
		addressLocality: siteConfig.contact.addressLocality,
		addressRegion: siteConfig.contact.addressRegion,
		postalCode: siteConfig.contact.postalCode,
		addressCountry: "KR",
	},
	areaServed: { "@type": "Country", name: "대한민국" },
	priceRange: "상담 문의",
	serviceType: ["HUG 보증보험 이행청구", "전세보증금 반환 소송", "임대차 분쟁", "부동산 소송"],
	knowsAbout: [
		"주택도시보증공사(HUG) 이행청구",
		"전세보증금 반환보증",
		"대항력 및 우선변제권",
		"임차권등기명령",
		"전세사기 피해 대응",
	],
	sameAs: [siteConfig.contact.naverBlog, siteConfig.contact.kakaoChannel],
});

/** 웹사이트 스키마. */
export const websiteSchema = () => ({
	"@context": "https://schema.org",
	"@type": "WebSite",
	"@id": `${siteConfig.url}/#website`,
	url: siteConfig.url,
	name: siteConfig.name,
	description: siteConfig.description,
	inLanguage: "ko-KR",
	publisher: { "@id": `${siteConfig.url}/#organization` },
});

type AttorneyLike = {
	slug: string;
	name: string;
	role: string;
	practices: readonly string[];
	education: readonly string[];
};

/** 변호사(구성원) — Person. E-E-A-T 신호. */
export const personSchema = (attorney: AttorneyLike) => ({
	"@context": "https://schema.org",
	"@type": "Person",
	"@id": abs(`/attorneys/${attorney.slug}#person`),
	name: attorney.name,
	jobTitle: attorney.role,
	worksFor: { "@id": `${siteConfig.url}/#organization` },
	knowsAbout: attorney.practices,
	alumniOf: attorney.education,
	url: abs(`/attorneys/${attorney.slug}`),
});

/** FAQ — AEO 인용률을 크게 높이는 핵심 타입. */
export const faqPageSchema = (faq: readonly { q: string; a: string }[]) => ({
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: faq.map((item) => ({
		"@type": "Question",
		name: item.q,
		acceptedAnswer: { "@type": "Answer", text: item.a },
	})),
});

/** 빵부스러기 경로. */
export const breadcrumbSchema = (items: readonly { name: string; path: string }[]) => ({
	"@context": "https://schema.org",
	"@type": "BreadcrumbList",
	itemListElement: items.map((item, index) => ({
		"@type": "ListItem",
		position: index + 1,
		name: item.name,
		item: abs(item.path),
	})),
});

type InsightLike = {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	updatedAt: string;
	keywords: readonly string[];
};

/** 인사이트/칼럼 글 — BlogPosting. */
export const blogPostingSchema = (insight: InsightLike, authorName: string) => ({
	"@context": "https://schema.org",
	"@type": "BlogPosting",
	"@id": abs(`/insights/${insight.slug}#article`),
	headline: insight.title,
	description: insight.description,
	datePublished: insight.publishedAt,
	dateModified: insight.updatedAt,
	author: { "@type": "Person", name: authorName },
	publisher: { "@id": `${siteConfig.url}/#organization` },
	keywords: insight.keywords.join(", "),
	inLanguage: "ko-KR",
	mainEntityOfPage: abs(`/insights/${insight.slug}`),
});
