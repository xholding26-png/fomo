import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type Post = {
  id: string;
  user_id: string;
  content: string;
  timer_minutes: number;
  created_at: string;
  expires_at: string;
  author_name: string;
  save_count: number;
};

export type Save = {
  id: string;
  user_id: string;
  post_id: string;
  saved_at: string;
};
