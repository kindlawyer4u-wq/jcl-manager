import { ArrowUp, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

const [phoneArea, ...phoneRest] = siteConfig.contact.tel.split("-");

const links = [
	{ label: "카톡", href: siteConfig.contact.kakaoChannel, img: "/kakao.svg" },
	{ label: "유튜브", href: siteConfig.contact.youtube, img: "/youtube.svg" },
	{ label: "블로그", href: siteConfig.contact.naverBlog, img: "/blog.svg" },
];

const cell =
	"flex flex-col items-center gap-1.5 border-line border-t px-2 py-3 text-slate-700 transition hover:bg-surface hover:text-brand";

/** 우측 고정 퀵메뉴 — 전화상담(깜빡임/샤인/링) · 카톡 · 유튜브 · 블로그 · 오시는 길 · TOP (데스크톱). */
export const QuickRail = () => (
	<aside
		aria-label="빠른 상담"
		className="fixed top-1/2 right-0 z-40 hidden w-[90px] -translate-y-1/2 flex-col overflow-hidden rounded-l-2xl border border-line border-r-0 bg-white shadow-[-6px_14px_38px_rgba(20,40,90,0.22)] lg:flex"
	>
		<a
			href={`tel:${siteConfig.contact.tel}`}
			aria-label={`전화 상담 ${siteConfig.contact.tel}`}
			className="relative flex flex-col items-center gap-2 overflow-hidden bg-brand px-2 py-4 text-center text-white before:absolute before:inset-0 before:z-[1] before:bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.5)_50%,transparent_65%)] before:content-[''] motion-safe:animate-[rail-blink_1.4s_ease-in-out_infinite] motion-safe:before:animate-[rail-shine_2.6s_ease-in-out_infinite]"
		>
			<span className="relative z-[2] flex size-9 items-center justify-center rounded-full bg-white/15 motion-safe:animate-[rail-ring_1.7s_ease-in-out_infinite]">
				<Phone className="size-5" aria-hidden />
			</span>
			<span className="relative z-[2] flex flex-col leading-tight">
				<span className="font-semibold text-[10.5px] text-brand-100">전화상담</span>
				<strong className="font-bold text-[11px] text-white/85">{phoneArea}</strong>
				<strong className="font-extrabold text-[15px] tracking-tight">{phoneRest.join("-")}</strong>
			</span>
		</a>
		{links.map((l) => (
			<a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={cell}>
				<Image src={l.img} alt="" width={26} height={26} unoptimized />
				<span className="font-medium text-[12px]">{l.label}</span>
			</a>
		))}
		<a
			href={siteConfig.contact.naverPlace}
			target="_blank"
			rel="noopener noreferrer"
			className={cell}
		>
			<MapPin className="size-6 text-mint-700" aria-hidden />
			<span className="font-medium text-[12px]">오시는 길</span>
		</a>
		<a href="#top" className={cell}>
			<ArrowUp className="size-5" aria-hidden />
			<span className="font-bold text-[11px]">TOP</span>
		</a>
	</aside>
);
