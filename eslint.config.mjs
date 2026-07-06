import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// TypeScript 룰은 Biome가 담당. ESLint는 Next.js 전용 룰(Image, Link, font 등)만 유지.
const eslintConfig = defineConfig([
	...nextVitals,
	globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
