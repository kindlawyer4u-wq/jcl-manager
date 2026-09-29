import { Columns } from "@/components/sections/Columns";
import { ContactCta } from "@/components/sections/ContactCta";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Process } from "@/components/sections/Process";
import { Requirements } from "@/components/sections/Requirements";
import { Situations } from "@/components/sections/Situations";
import { Team } from "@/components/sections/Team";

/*
 * ★ 5분마다 다시 만든다(ISR). 홈에 최신 칼럼 네 건이 나오는데, 전에는 배포할 때 한 번 굽고
 *   끝이라 **새 칼럼을 발행해도 다시 배포하기 전까지 홈에 안 나왔다**(실측: 캐시 나이 30일).
 *   어드민 발행 시 /api/revalidate 가 즉시 비우지만(REVALIDATE_SECRET 이 있을 때), 그게 없어도
 *   5분 안에는 반영되게 이 값을 둔다.
 */
export const revalidate = 300;

// 제이씨엘파트너스 — HUG 보증보험 이행청구 단일 랜딩 (디자인: design/home.html)
export default function HomePage() {
	return (
		<>
			<Hero />
			<Problem />
			<Situations />
			<Requirements />
			<Process />
			<Team />
			<Columns />
			<ContactCta />
		</>
	);
}
