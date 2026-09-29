import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// ─────────────────────────────────────────────────────────────────────────────
// 보안 헤더 — 프로덕션 빌드 전용 (dev에서는 Turbopack HMR 때문에 비활성)
// 카카오맵(오시는 길) 도메인 포함. 외부 서비스 추가 시 해당 도메인을 CSP에 추가.
// ─────────────────────────────────────────────────────────────────────────────
const securityHeaders = [
	{ key: "X-Frame-Options", value: "SAMEORIGIN" },
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
	{ key: "X-DNS-Prefetch-Control", value: "on" },
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload",
	},
	{
		key: "Content-Security-Policy",
		value: [
			"default-src 'self'",
			// 스크립트: self + GA + Vercel Analytics + 카카오맵 SDK
			"script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com https://t1.daumcdn.net https://dapi.kakao.com",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: blob: https:",
			"font-src 'self'",
			// 연결: self + GA + Vercel Analytics + 카카오맵 API
			"connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://dapi.kakao.com",
			// iframe: 카카오맵 임베드 허용
			"frame-src 'self' https://map.kakao.com",
			"media-src 'self' blob:",
			"worker-src 'self' blob:",
		].join("; "),
	},
];

/*
 * 초안 미리보기(/preview/column/…)는 **어드민 에디터가 iframe 으로 띄운다.** X-Frame-Options: SAMEORIGIN 은
 * 다른 오리진(어드민)을 허용할 수 없어서, 이 경로만 그 헤더를 빼고 CSP frame-ancestors 로 어드민 주소만 연다.
 * ⚠️ 와일드카드를 쓰지 않는다. 열거한 어드민 오리진만 프레임할 수 있다.
 */
const ADMIN_ORIGINS = [
	"https://admin.jwlawyer4u.co.kr",
	"https://jcl-admin.vercel.app",
	...(process.env.ADMIN_ORIGIN?.trim() ? [process.env.ADMIN_ORIGIN.trim()] : []),
];
const previewHeaders = [
	...securityHeaders.filter(
		(h) => h.key !== "X-Frame-Options" && h.key !== "Content-Security-Policy",
	),
	{
		key: "Content-Security-Policy",
		value: `${securityHeaders.find((h) => h.key === "Content-Security-Policy")?.value}; frame-ancestors 'self' ${ADMIN_ORIGINS.join(" ")}`,
	},
];

const nextConfig: NextConfig = {
	// MDX(.md/.mdx)를 페이지/모듈로 처리 — 콘텐츠는 src/content/**/*.mdx
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

	async headers() {
		if (process.env.NODE_ENV !== "production") return [];
		return [
			// 초안 미리보기만 따로 — 아래 주석
			{ source: "/((?!preview/).*)", headers: securityHeaders },
			{ source: "/preview/:path*", headers: previewHeaders },
		];
	},

	images: {
		qualities: [75, 90, 95],
		remotePatterns: [
			{
				// TODO(배포 전): 실제 사용하는 이미지 호스트로 좁힐 것
				protocol: "https",
				hostname: "**",
			},
		],
	},
};

// GFM(표 등) 지원. Turbopack 호환을 위해 플러그인은 문자열로 지정.
const withMDX = createMDX({
	options: {
		remarkPlugins: [["remark-gfm"]],
	},
});

export default withMDX(nextConfig);
