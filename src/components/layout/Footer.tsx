import { Wordmark } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";

export const Footer = () => (
	<footer className="bg-surface px-6 py-16 text-center">
		<div className="flex items-baseline justify-center gap-2">
			<Wordmark />
			<span className="text-caption text-slate-500">제이씨엘 파트너스</span>
		</div>
		<p className="mt-6 text-caption text-slate-500 leading-relaxed">
			{siteConfig.contact.address}
			<br />
			copyright (c) 2024 JCLPARTNERS. All right reserved.
		</p>
	</footer>
);
