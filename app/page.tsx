"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient, type Post } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userSaves, setUserSaves] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExpired, setShowExpired] = useState(false);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    // Fetch posts with save counts
    const { data: postsData } = await supabase
      .from("posts_with_saves")
      .select("*")
      .order("expires_at", { ascending: true });

    if (postsData) {
      const now = Date.now();
      const sorted = postsData.sort((a: Post, b: Post) => {
        const aExp = new Date(a.expires_at).getTime() < now;
        const bExp = new Date(b.expires_at).getTime() < now;
        if (aExp && !bExp) return 1;
        if (!aExp && bExp) return -1;
        return new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime();
      });
      setPosts(sorted);
    }

    // Fetch user's saves
    if (user) {
      const { data: savesData } = await supabase
        .from("saves")
        .select("post_id")
        .eq("user_id", user.id);

      if (savesData) {
        setUserSaves(new Set(savesData.map((s: { post_id: string }) => s.post_id)));
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, [fetchData]);

  const activePosts = posts.filter(
    (p) => new Date(p.expires_at).getTime() > Date.now()
  );
  const expiredPosts = posts.filter(
    (p) => new Date(p.expires_at).getTime() <= Date.now()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-fomo-amber border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          <span className="text-fomo-amber">Live Feed</span>
        </h1>
        <p className="mt-1 text-sm text-fomo-muted">
          {activePosts.length} post{activePosts.length !== 1 ? "s" : ""} expiring
          {!userId && (
            <span className="ml-2">
              · <a href="/login" className="text-fomo-amber underline">Sign in</a> to save & post
            </span>
          )}
        </p>
      </div>

      {/* Active posts */}
      {activePosts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-fomo-border bg-fomo-card/50 py-16 text-center">
          <p className="text-fomo-muted">No active posts right now</p>
          <a
            href="/post"
            className="mt-3 inline-block text-sm text-fomo-amber underline"
          >
            Be the first to post
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {activePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={userId}
              isSaved={userSaves.has(post.id)}
            />
          ))}
        </div>
      )}

      {/* Expired posts toggle */}
      {expiredPosts.length > 0 && (
        <div>
          <button
            onClick={() => setShowExpired(!showExpired)}
            className="w-full rounded-lg border border-fomo-border bg-fomo-card/30 py-2 text-xs text-fomo-muted transition hover:bg-fomo-card"
          >
            {showExpired ? "Hide" : "Show"} {expiredPosts.length} expired post{expiredPosts.length !== 1 ? "s" : ""}
          </button>

          {showExpired && (
            <div className="mt-3 space-y-3">
              {expiredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={userId}
                  isSaved={userSaves.has(post.id)}
                  showExpiredState
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
