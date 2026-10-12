import { ArrowUp, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

const [phoneArea, ...phoneRest] = siteConfig.contact.tel.split("-");

const links = [
	{ label: "카톡", href: siteConfig.contact.kakaoChannel, img: "/kakao.svg" },
	{ label: "유튜브", href: siteConfig.contact.youtube, img: "/youtube.svg" },
	{ label: "블로그", href: siteConfig.contact.blog, img: "/blog.svg" },
];

const cell =
	"flex flex-col items-center gap-1.5 border-line border-t px-2 py-3 text-slate-700 transition hover:bg-surface hover:text-brand";

/** 모바일 하단 바의 칸 하나 — 아이콘 위, 이름 아래 */
const barCell =
	"flex h-[58px] min-w-0 flex-1 flex-col items-center justify-center gap-[5px] whitespace-nowrap text-[11px] tracking-[-0.02em]";

/**
 * 퀵메뉴.
 *  ≥lg : 우측 고정 세로 패널 — 전화상담(깜빡임/샤인/링) · 카톡 · 유튜브 · 블로그 · 오시는 길 · TOP
 *  <lg : 하단 고정 바 — 전화상담 · 카톡상담 · 오시는길 세 칸만(2026-10-12 요청, 부동산 사이트와 같은 모양).
 *        배경은 모바일 메뉴(Header)와 같은 먹색. 전화만 옅은 면을 깔아 1순위 경로임을 말한다.
 */
export const QuickRail = () => (
	<>
		<aside
			aria-label="빠른 상담"
			className="fixed top-1/2 right-0 z-40 hidden w-[90px] -translate-y-1/2 flex-col overflow-hidden rounded-l-2xl border border-line border-r-0 bg-white shadow-[-6px_14px_38px_rgba(20,40,90,0.22)] lg:flex"
		>
			<a
				href={`tel:${siteConfig.contact.tel}`}
				aria-label={`전화 상담 ${siteConfig.contact.tel}`}
				className="rail-phone flex flex-col items-center gap-2 bg-brand px-2 py-4 text-center text-white"
			>
				<span className="rail-ring relative z-[2] flex size-9 items-center justify-center rounded-full bg-white/15">
					<Phone className="size-5" aria-hidden />
				</span>
				<span className="relative z-[2] flex flex-col leading-tight">
					<span className="font-semibold text-[10.5px] text-brand-100">전화상담</span>
					<strong className="font-bold text-[11px] text-white/85">{phoneArea}</strong>
					<strong className="font-extrabold text-[15px] tracking-tight">
						{phoneRest.join("-")}
					</strong>
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

		<nav
			aria-label="빠른 상담"
			className="fixed inset-x-0 bottom-0 z-40 flex bg-[rgba(5,7,11,0.96)] lg:hidden"
		>
			<a
				href={`tel:${siteConfig.contact.tel}`}
				aria-label={`전화 상담 ${siteConfig.contact.tel}`}
				className={`${barCell} bg-white/12 text-white`}
			>
				<span aria-hidden className="rail-ring flex items-center">
					<Phone className="size-[19px]" strokeWidth={1.8} aria-hidden />
				</span>
				<span className="font-semibold text-mint-300">전화상담</span>
			</a>
			<a
				href={siteConfig.contact.kakaoChannel}
				target="_blank"
				rel="noopener noreferrer"
				className={`${barCell} text-white/85 active:bg-white/10`}
			>
				{/* 카카오 마크는 말풍선이 먹색이라 어두운 바 위에서 사라진다 — 카카오 노랑 타일 위에 얹는다 */}
				<span
					aria-hidden
					className="flex size-[21px] items-center justify-center rounded-[6px] bg-[#FEE500]"
				>
					<Image src="/kakao.svg" alt="" width={17} height={17} unoptimized />
				</span>
				카톡상담
			</a>
			<a
				href={siteConfig.contact.naverPlace}
				target="_blank"
				rel="noopener noreferrer"
				className={`${barCell} text-white/85 active:bg-white/10`}
			>
				<MapPin className="size-[19px]" strokeWidth={1.7} aria-hidden />
				오시는길
			</a>
		</nav>
	</>
);
