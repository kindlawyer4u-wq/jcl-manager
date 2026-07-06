import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Header } from "@/components/layout/Header";
import { FullPageScroll } from "@/components/shared/FullPageScroll";
import { QuickRail } from "@/components/shared/QuickRail";
import { ScrollCue } from "@/components/shared/ScrollCue";
import { siteConfig } from "@/config/site";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import "./globals.css";

const pretendard = localFont({
	src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
	variable: "--font-pretendard",
	display: "swap",
	weight: "45 920",
	adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: siteConfig.title,
	description: siteConfig.description,
	keywords: [...siteConfig.keywords],
	openGraph: {
		type: "website",
		locale: siteConfig.locale,
		url: siteConfig.url,
		siteName: siteConfig.name,
		title: siteConfig.title.default,
		description: siteConfig.description,
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.title.default,
		description: siteConfig.description,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: { index: true, follow: true, "max-image-preview": "large" },
	},
	alternates: { canonical: siteConfig.url },
	// TODO(client): 구글 서치콘솔 / 네이버 서치어드바이저 소유확인 코드로 교체
	verification: {
		google: "TODO-google-search-console-verification",
		other: { "naver-site-verification": "TODO-naver-search-advisor-verification" },
	},
};

// GA4 측정 ID. NEXT_PUBLIC_GA_ID=G-XXXXXXXX 설정 시에만 로드.
const gaId = process.env.NEXT_PUBLIC_GA_ID;

const RootLayout = ({ children }: { children: ReactNode }) => (
	<html lang="ko" className={`${pretendard.variable} h-full`} suppressHydrationWarning>
		<body className="flex min-h-full flex-col" suppressHydrationWarning>
			<JsonLd data={organizationSchema()} />
			<JsonLd data={websiteSchema()} />
			<Header />
			<FullPageScroll />
			<ScrollCue />
			<QuickRail />
			<main className="flex-1">{children}</main>
			<Analytics />
			<SpeedInsights />
			{gaId ? <GoogleAnalytics gaId={gaId} /> : null}
		</body>
	</html>
);

export default RootLayout;
