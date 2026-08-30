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
const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;

/**
 * ⚠️ 키가 없으면 **던지지 않고 null 을 준다.**
 *    칼럼은 이 사이트의 일부일 뿐이라, 환경변수가 빠졌다고 랜딩 전체가 500 이 되면 안 된다.
 *    호출부가 빈 목록으로 그리고 화면이 그 상태를 설명한다.
 */
export const db = () =>
	url && anon ? createClient(url, anon, { auth: { persistSession: false } }) : null;
