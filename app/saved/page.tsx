"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, type Post } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

export default function SavedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSaved = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      // Get saved post IDs
      const { data: saves } = await supabase
        .from("saves")
        .select("post_id")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false });

      if (saves && saves.length > 0) {
        const postIds = saves.map((s: { post_id: string }) => s.post_id);

        const { data: postsData } = await supabase
          .from("posts_with_saves")
          .select("*")
          .in("id", postIds);

        if (postsData) {
          // Sort in same order as saves
          const postsMap = new Map(postsData.map((p: Post) => [p.id, p]));
          const ordered = postIds
            .map((id: string) => postsMap.get(id))
            .filter(Boolean) as Post[];
          setPosts(ordered);
        }
      }

      setLoading(false);
    };

    fetchSaved();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-fomo-amber border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-fomo-amber">Saved Posts</h1>
        <p className="mt-1 text-sm text-fomo-muted">
          {posts.length} post{posts.length !== 1 ? "s" : ""} preserved forever
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-fomo-border bg-fomo-card/50 py-16 text-center">
          <p className="text-4xl">🫗</p>
          <p className="mt-3 text-fomo-muted">Nothing saved yet</p>
          <a
            href="/"
            className="mt-2 inline-block text-sm text-fomo-amber underline"
          >
            Browse the feed
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={userId}
              isSaved={true}
              showExpiredState={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
