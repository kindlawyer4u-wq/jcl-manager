import { Mail, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/text";
import { siteConfig } from "@/config/site";

const channels = [
	{
		label: "전화 상담",
		value: siteConfig.contact.tel,
		href: `tel:${siteConfig.contact.tel}`,
		Icon: Phone,
		pill: "border border-mint text-mint",
	},
	{
		label: "카카오톡 상담",
		value: "채널 바로가기 →",
		href: siteConfig.contact.kakaoChannel,
		Icon: MessageCircle,
		pill: "bg-highlight text-ink",
	},
	{
		label: "이메일",
		value: siteConfig.contact.email,
		href: `mailto:${siteConfig.contact.email}`,
		Icon: Mail,
		pill: "border border-mint text-mint",
	},
];

// 마지막 섹션 = 상담 CTA(다크) + 푸터를 한 패널에 포함
export const ContactCta = () => (
	<section
		id="contact"
		className="relative isolate flex flex-col overflow-hidden bg-dark lg:min-h-dvh lg:snap-start"
	>
		<Image src="/images/contact-bg.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover" />
		<div
			aria-hidden
			className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,7,11,0.9)_0%,rgba(5,7,11,0.82)_100%)]"
		/>
		<div className="flex flex-1 flex-col justify-center pt-[clamp(6rem,7vh,7rem)] pb-[clamp(2.5rem,5vh,4rem)]">
			<Container>
				<Heading level={2} size="h2" className="text-white">
					지금 바로 법률 상담을 신청하세요
				</Heading>
				<Text size="body-lg" className="mt-5 max-w-[820px] text-on-dark">
					대항력 요건 충족 여부, 보증 청구 가능성, 필요 서류를 전문 변호사가 직접 검토합니다.
				</Text>
				<div className="mt-10 grid gap-6 sm:grid-cols-3">
					{channels.map(({ label, value, href, Icon, pill }) => (
						<a
							key={label}
							href={href}
							className="flex flex-col rounded-lg border border-white/15 bg-white/5 p-7 transition hover:bg-white/10"
						>
							<span
								className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 font-bold text-body-sm ${pill}`}
							>
								<Icon className="size-4" aria-hidden />
								{label}
							</span>
							<span className="mt-auto break-all pt-8 font-bold text-[clamp(1.0625rem,1.4vw,1.375rem)] text-white">
								{value}
							</span>
							<span className="mt-3 text-right text-body-sm text-on-dark-muted">24시간 접수</span>
						</a>
					))}
				</div>
			</Container>
		</div>
		<Footer />
	</section>
);
