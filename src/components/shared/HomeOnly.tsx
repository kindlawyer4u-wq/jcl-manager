"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * 홈에서만 그린다.
 *
 * ⚠️ 전체화면 넘기기·뷰포트 맞춤·스크롤 큐는 `main > section` 을 잡아 네이티브 스크롤을
 *    가로챈다. 칼럼처럼 **읽는 화면**에서 그게 걸리면 글을 읽는 중에 화면이 튄다.
 *    루트 레이아웃에 있으므로 여기서 경로로 가른다.
 */
export const HomeOnly = ({ children }: { children: ReactNode }) =>
	usePathname() === "/" ? children : null;
