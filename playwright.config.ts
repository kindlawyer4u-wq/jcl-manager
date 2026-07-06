import { defineConfig, devices } from "@playwright/test";

const PORT = 3123;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
	testDir: "./tests",
	timeout: 60_000,
	expect: { timeout: 8_000 },
	fullyParallel: false,
	retries: 0,
	workers: 1,
	reporter: [["list"]],
	use: {
		baseURL: BASE_URL,
		trace: "retain-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1300 } },
		},
	],
	webServer: {
		command: `pnpm start -p ${PORT}`,
		url: BASE_URL,
		timeout: 60_000,
		reuseExistingServer: true,
	},
});
