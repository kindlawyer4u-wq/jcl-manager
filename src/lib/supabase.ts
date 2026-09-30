import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase 읽기 클라이언트 — **서버에서만** 돈다.
 *
 * ★ anon 키를 쓴다. 이 사이트는 읽기만 하고, 무엇을 읽을 수 있는지는 RLS 가 정한다.
 *   `service_role` 은 RLS 를 통째로 우회하므로 공개 페이지에 절대 두지 않는다 —
 *   초안이 그대로 새어 나간다.
 * ★ 세션이 없다. 방문자는 로그인하지 않으므로 쿠키를 붙일 이유가 없다.
 */
/*
 * ★ 기본값을 코드에 둔다(2026-09-30). 이 사이트의 Vercel 은 어드민·부동산 사이트와 다른 계정이라
 *   환경변수를 넣을 수 없었고, 그래서 운영에서 칼럼이 **한 건도 안 나왔다**(발행 2건이 DB 에 있는데).
 *   부동산 사이트(jcl-homepage)와 **같은 프로젝트·같은 값**이다 — 두 사이트가 DB 하나를 쓰고
 *   `columns.site_id` 로 나눈다(`SITE_KEY`, lib/columns.ts).
 * ★ anon 키는 원래 브라우저에 내놓는 공개 키다. 읽을 수 있는 것은 RLS 가 정한다 — 실측(2026-09-30):
 *   발행한 글·분류·사이트 목록만 읽히고 초안·계정·조회 기록은 빈 배열이다.
 * ⚠️ service_role 키는 여기 두지 않는다. 그건 RLS 를 통째로 우회한다.
 * 환경변수가 있으면 그것이 이긴다.
 */
const PUBLIC_URL = "https://vutovfgblxptstaegfnf.supabase.co";
const PUBLIC_ANON =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dG92ZmdibHhwdHN0YWVnZm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMTA1MDYsImV4cCI6MjEwMjY4NjUwNn0.697CdcpSip3xiZ_GCWEjJ08hinHDa5FF3LbDYXM0ir8";

export const SUPABASE_URL = process.env.SUPABASE_URL || PUBLIC_URL;
const url = SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY || PUBLIC_ANON;

/**
 * ⚠️ 키가 없으면 **던지지 않고 null 을 준다.**
 *    칼럼은 이 사이트의 일부일 뿐이라, 환경변수가 빠졌다고 랜딩 전체가 500 이 되면 안 된다.
 *    호출부가 빈 목록으로 그리고 화면이 그 상태를 설명한다.
 */
export const db = () =>
	url && anon ? createClient(url, anon, { auth: { persistSession: false } }) : null;
