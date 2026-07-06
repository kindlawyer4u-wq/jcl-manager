import { expect, test } from "@playwright/test";

// 최상위 섹션들의 문서상 top 좌표를 반환
const sectionTops = () =>
	Array.from(document.querySelectorAll<HTMLElement>("main > section, main > header")).map((s) =>
		Math.round(s.getBoundingClientRect().top + window.scrollY),
	);

test.describe("전체화면 넘기기 스크롤 (FullPageScroll)", () => {
	test("휠로 모든 섹션을 순차 이동하고, 되돌아오며, 콘솔 에러가 없다", async ({ page }) => {
		const errors: string[] = [];
		// Vercel Analytics/SpeedInsights 스크립트는 로컬 next start 에서 404 (배포 시 정상) → 노이즈 제외
		const isVercelNoise = (t: string) =>
			t.includes("_vercel") ||
			t.includes("Failed to load resource") ||
			t.includes("Refused to execute script");
		page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
		page.on("response", (res) => {
			if (res.status() >= 400 && !res.url().includes("/_vercel/")) {
				errors.push(`http ${res.status()}: ${res.url()}`);
			}
		});
		page.on("console", (m) => {
			if (m.type() === "error" && !isVercelNoise(m.text())) errors.push(`console: ${m.text()}`);
		});

		await page.goto("/");
		await page.waitForLoadState("networkidle");
		await page.mouse.move(720, 640);

		const tops = await page.evaluate(sectionTops);
		expect(tops.length).toBeGreaterThanOrEqual(8);

		// 시작: 최상단
		expect(await page.evaluate(() => Math.round(window.scrollY))).toBeLessThan(5);

		// 아래로: 한 번 휠에 다음 섹션으로 이동
		for (let i = 1; i < tops.length; i++) {
			await page.mouse.wheel(0, 220);
			await page.waitForFunction((t) => Math.abs(window.scrollY - t) < 4, tops[i], {
				timeout: 5000,
			});
			await page.waitForTimeout(1000); // 스크롤 락 해제 대기
		}
		expect(await page.evaluate(() => Math.round(window.scrollY))).toBe(tops[tops.length - 1]);

		// 위로: 한 번 휠에 이전 섹션으로 복귀
		for (let i = tops.length - 2; i >= 0; i--) {
			await page.mouse.wheel(0, -220);
			await page.waitForFunction((t) => Math.abs(window.scrollY - t) < 4, tops[i], {
				timeout: 5000,
			});
			await page.waitForTimeout(1000);
		}
		expect(await page.evaluate(() => Math.round(window.scrollY))).toBeLessThan(5);

		expect(errors, errors.join("\n")).toEqual([]);
	});

	test("각 섹션이 뷰포트 높이를 꽉 채운다 (걸침 없음)", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		const vh = 1300;
		const heights = await page.evaluate(() =>
			Array.from(document.querySelectorAll<HTMLElement>("main > section, main > header")).map(
				(s) => s.offsetHeight,
			),
		);
		for (const h of heights) {
			expect(h).toBeGreaterThanOrEqual(vh - 2);
		}
	});

	test("스크롤해도 헤더가 투명으로 유지된다", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		const header = page.locator("body > header").first();
		const bgTop = await header.evaluate((el) => getComputedStyle(el).backgroundColor);
		await page.mouse.move(720, 640);
		await page.mouse.wheel(0, 300);
		await page.waitForTimeout(1200);
		const bgScrolled = await header.evaluate((el) => getComputedStyle(el).backgroundColor);
		expect(bgScrolled).toBe(bgTop);
		expect(bgTop).toBe("rgba(0, 0, 0, 0)");
	});

	test("헤더 글자색이 섹션 배경에 따라 바뀐다 (다크→흰색, 라이트→검정)", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		await page.mouse.move(720, 640);
		const header = page.locator("body > header").first();
		const cHero = await header.evaluate((el) => getComputedStyle(el).color);
		// 라이트 섹션(검토사항, index 2)까지 이동
		for (let i = 0; i < 2; i++) {
			await page.mouse.wheel(0, 220);
			await page.waitForTimeout(1100);
		}
		const cLight = await header.evaluate((el) => getComputedStyle(el).color);
		expect(cHero).toBe("rgb(255, 255, 255)"); // 히어로(다크) 위 → 흰 글자
		expect(cLight).not.toBe(cHero); // 라이트 섹션 위 → 어두운 글자
	});

	test("가로 스크롤(overflow)이 발생하지 않는다", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
		);
		expect(overflow).toBe(false);
	});

	test("작은 휠 입력에도 위치가 어긋나지 않는다 (드리프트 없음)", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		await page.mouse.move(720, 640);
		const tops = await page.evaluate(sectionTops);
		await page.mouse.wheel(0, 220);
		await page.waitForFunction((t) => Math.abs(window.scrollY - t) < 4, tops[1], { timeout: 5000 });
		await page.waitForTimeout(1000);
		// 아주 작은 휠 입력을 여러 번 보내도 섹션에 정확히 정렬 유지(네이티브 드리프트 없음)
		for (let k = 0; k < 6; k++) {
			await page.mouse.wheel(0, 2);
			await page.waitForTimeout(60);
		}
		const y = await page.evaluate(() => Math.round(window.scrollY));
		expect(Math.abs(y - tops[1])).toBeLessThan(3);
	});

	test("오른쪽 스크롤바가 없다", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		const barWidth = await page.evaluate(
			() => window.innerWidth - document.documentElement.clientWidth,
		);
		expect(barWidth).toBeLessThanOrEqual(1);
	});

	test("해상도를 바꿔도 섹션이 뷰포트에 맞춰 리사이즈된다", async ({ page }) => {
		for (const vp of [
			{ width: 1920, height: 1080 },
			{ width: 1600, height: 900 },
			{ width: 1366, height: 768 },
		]) {
			await page.setViewportSize(vp);
			await page.goto("/");
			await page.waitForLoadState("networkidle");
			const innerH = await page.evaluate(() => window.innerHeight);
			const heights = await page.evaluate(() =>
				Array.from(document.querySelectorAll<HTMLElement>("main > section, main > header")).map(
					(s) => s.offsetHeight,
				),
			);
			for (const h of heights) {
				expect(h).toBeGreaterThanOrEqual(innerH - 2);
			}
		}
	});

	test("모든 섹션 제목이 충분히 크게 렌더된다", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		const sizes = await page.evaluate(() =>
			["#problem", "#situations", "#requirements", "#process", "#team", "#columns", "#contact"].map(
				(sel) => {
					const h = document.querySelector(`${sel} h2`);
					return h ? Number.parseFloat(getComputedStyle(h).fontSize) : 0;
				},
			),
		);
		for (const s of sizes) expect(s).toBeGreaterThanOrEqual(36);
	});

	test("줌/리사이즈 시 현재 섹션으로 재정렬된다 (어긋남 없음)", async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1300 });
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		await page.mouse.move(720, 640);
		const tops = await page.evaluate(sectionTops);
		await page.mouse.wheel(0, 220);
		await page.waitForFunction((t) => Math.abs(window.scrollY - t) < 4, tops[1], { timeout: 5000 });
		await page.waitForTimeout(1000);
		// 뷰포트 높이 변경(줌 유사) 후 가장 가까운 섹션으로 재정렬돼야 함
		await page.setViewportSize({ width: 1440, height: 980 });
		await page.waitForTimeout(500);
		const aligned = await page.evaluate(() => {
			const t = Array.from(
				document.querySelectorAll<HTMLElement>("main > section, main > header"),
			).map((s) => Math.round(s.getBoundingClientRect().top + window.scrollY));
			const y = Math.round(window.scrollY);
			return t.some((v) => Math.abs(v - y) < 4);
		});
		expect(aligned).toBe(true);
	});

	test("헤더 메뉴 클릭 시 해당 섹션에 정확히 정렬된다 (걸침 없음)", async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1300 });
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		for (const sel of [
			"#problem",
			"#situations",
			"#requirements",
			"#process",
			"#team",
			"#columns",
		]) {
			await page.locator(`body > header nav a[href="${sel}"]`).first().click();
			await page.waitForTimeout(900);
			const ok = await page.evaluate((s) => {
				const el = document.querySelector<HTMLElement>(s);
				if (!el) return false;
				const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
				return Math.abs(top - Math.round(window.scrollY)) < 4;
			}, sel);
			expect(ok, `${sel} 정렬 실패`).toBe(true);
		}
	});

	test("스크롤 큐가 보이고 마지막 섹션에서 숨는다", async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1300 });
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		await page.mouse.move(720, 640);
		const cue = page.locator('button[aria-label="다음 섹션으로 스크롤"]');
		expect(Number(await cue.evaluate((el) => getComputedStyle(el).opacity))).toBeGreaterThan(0.5);
		// 마지막 섹션까지 휠로 이동
		const tops = await page.evaluate(sectionTops);
		for (let i = 1; i < tops.length; i++) {
			await page.mouse.wheel(0, 220);
			await page.waitForFunction((t) => Math.abs(window.scrollY - t) < 4, tops[i], {
				timeout: 5000,
			});
			await page.waitForTimeout(1000);
		}
		await page.waitForTimeout(400);
		expect(Number(await cue.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(0.5);
	});

	test("모든 섹션이 뷰포트+80 이내 (내부 스크롤 버그 방지)", async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 820 });
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		const { heights, vh } = await page.evaluate(() => ({
			heights: Array.from(
				document.querySelectorAll<HTMLElement>("main > section, main > header"),
			).map((s) => s.offsetHeight),
			vh: window.innerHeight,
		}));
		heights.forEach((h, i) => {
			expect(h, `섹션 ${i} 오버플로(내부 스크롤 유발)`).toBeLessThanOrEqual(vh + 80);
		});
	});

	test("우측 고정 퀵메뉴가 실제 링크로 연결된다", async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		const rail = page.locator('aside[aria-label="빠른 상담"]');
		await expect(rail).toBeVisible();
		await expect(rail.locator('a[href="https://pf.kakao.com/_jfgxfG"]')).toHaveCount(1);
		await expect(rail.locator('a[href="https://blog.naver.com/partners4u"]')).toHaveCount(1);
		await expect(rail.locator('a[href="https://naver.me/xHghsf16"]')).toHaveCount(1);
		await expect(rail.locator('a[href="tel:02-2135-4974"]')).toHaveCount(1);
	});
});
