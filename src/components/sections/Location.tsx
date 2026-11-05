import { KakaoRoughmap } from "@/components/shared/KakaoRoughmap";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/text";
import { siteConfig } from "@/config/site";

const rows = [
	{ k: "전화번호", v: siteConfig.contact.tel },
	{ k: "이메일", v: siteConfig.contact.email },
	{ k: "상담시간", v: "24시간 접수 (전화 · 카카오톡)" },
];

/**
 * 오시는 길 — 2026-11-05 요청. jcl-criminal 오시는 길(main-location.tsx)과 같은 짜임:
 * 좌 교통편 · 주소 · 연락처 · [지도 바로가기] / 우 카카오맵 퍼가기(API 키 없음, KakaoRoughmap).
 * ★ 상담 CTA(푸터 포함) 바로 위 — 마지막 화면은 푸터가 붙은 CTA 여야 휠 페이징이 끝에서 멈춘다.
 * ★ 섹션 자식은 Container 하나 — FitToViewport 가 자식이 하나일 때만 짧은 화면에 맞춰 줄인다.
 */
export const Location = () => (
	<section
		id="location"
		className="bg-white pt-[clamp(4rem,7vh,6.5rem)] pb-[clamp(3rem,6vh,5rem)] lg:flex lg:min-h-dvh lg:snap-start lg:flex-col lg:justify-center"
	>
		<Container className="grid max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-14">
			<div>
				<Badge variant="soft">오시는 길</Badge>
				{/* h2 크기면 1440 에서 「3분」만 셋째 줄로 떨어진다 — 두 줄에 들어가게 줄인다 */}
				<Heading level={2} size="h2" className="mt-5 text-ink lg:text-[clamp(2rem,2.8vw,2.75rem)]">
					{siteConfig.contact.transit}
					<br />
					{siteConfig.contact.transitDetail}
				</Heading>

				<div className="mt-8 border-ink border-t py-7">
					<p className="pb-6 font-bold text-[clamp(1.1875rem,1.6vw,1.5rem)] text-ink leading-snug">
						{siteConfig.contact.address}
					</p>
					<dl className="space-y-3">
						{rows.map((r) => (
							<div key={r.k} className="flex text-body">
								<dt className="w-[96px] flex-none font-semibold text-ink">{r.k}</dt>
								<dd className="min-w-0 text-muted-foreground tabular-nums">{r.v}</dd>
							</div>
						))}
					</dl>
				</div>

				<div className="flex flex-col gap-4 border-line border-t pt-7 sm:flex-row sm:items-center sm:justify-between">
					<Text size="body-sm" className="text-muted-foreground">
						보증금이 묶인 순간, 제이씨엘파트너스가 함께하겠습니다
					</Text>
					<a
						href={siteConfig.contact.mapLink}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="지도 바로가기 (카카오맵, 새 창)"
						className="inline-flex h-12 flex-none items-center justify-center self-start rounded-md bg-brand px-7 font-bold text-[16px] text-white transition hover:bg-brand-700 sm:self-auto lg:h-14"
					>
						지도 바로가기 +
					</a>
				</div>
			</div>

			{/* ⚠️ lg 오른쪽 퀵메뉴(90px)가 지도 확대 버튼을 덮지 않게 오른쪽을 비운다 */}
			<div className="h-[300px] overflow-hidden rounded-lg border border-line bg-surface md:h-[380px] lg:mr-[clamp(0px,calc(100px-5vw),40px)] lg:h-[clamp(320px,52vh,480px)]">
				<KakaoRoughmap title="제이씨엘파트너스 위치 지도" className="size-full overflow-hidden" />
			</div>
		</Container>
	</section>
);
