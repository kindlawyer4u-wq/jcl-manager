import { Columns } from "@/components/sections/Columns";
import { ContactCta } from "@/components/sections/ContactCta";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Process } from "@/components/sections/Process";
import { Requirements } from "@/components/sections/Requirements";
import { Situations } from "@/components/sections/Situations";
import { Team } from "@/components/sections/Team";

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
