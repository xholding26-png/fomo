"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, type Post } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

type Stats = {
  totalPosts: number;
  savesGiven: number;
  savesReceived: number;
};

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [stats, setStats] = useState<Stats>({ totalPosts: 0, savesGiven: 0, savesReceived: 0 });
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [userSaves, setUserSaves] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? "");

      // Get user's posts
      const { data: postsData } = await supabase
        .from("posts_with_saves")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (postsData) {
        setMyPosts(postsData);
      }

      // Saves given
      const { data: savesGivenData } = await supabase
        .from("saves")
        .select("post_id")
        .eq("user_id", user.id);

      const savesGiven = savesGivenData?.length ?? 0;
      if (savesGivenData) {
        setUserSaves(new Set(savesGivenData.map((s: { post_id: string }) => s.post_id)));
      }

      // Saves received (saves on my posts)
      let savesReceived = 0;
      if (postsData && postsData.length > 0) {
        savesReceived = postsData.reduce((acc: number, p: Post) => acc + (p.save_count || 0), 0);
      }

      setStats({
        totalPosts: postsData?.length ?? 0,
        savesGiven,
        savesReceived,
      });

      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-fomo-amber border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="rounded-xl border border-fomo-border bg-fomo-card p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-fomo-amber/10 text-2xl">
          {email[0]?.toUpperCase() ?? "?"}
        </div>
        <p className="mt-3 font-semibold text-white">{email.split("@")[0]}</p>
        <p className="text-sm text-fomo-muted">{email}</p>

        <button
          onClick={handleSignOut}
          className="mt-4 rounded-lg border border-fomo-border px-4 py-1.5 text-xs text-fomo-muted transition hover:bg-fomo-card hover:text-white"
        >
          Sign out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-fomo-border bg-fomo-card p-4 text-center">
          <p className="text-2xl font-bold text-fomo-amber">{stats.totalPosts}</p>
          <p className="text-xs text-fomo-muted">Posts</p>
        </div>
        <div className="rounded-xl border border-fomo-border bg-fomo-card p-4 text-center">
          <p className="text-2xl font-bold text-fomo-amber">{stats.savesGiven}</p>
          <p className="text-xs text-fomo-muted">Saves Given</p>
        </div>
        <div className="rounded-xl border border-fomo-border bg-fomo-card p-4 text-center">
          <p className="text-2xl font-bold text-fomo-amber">{stats.savesReceived}</p>
          <p className="text-xs text-fomo-muted">Saves Received</p>
        </div>
      </div>

      {/* My posts */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Your Posts</h2>
        {myPosts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-fomo-border bg-fomo-card/50 py-8 text-center">
            <p className="text-fomo-muted">No posts yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={userId}
                isSaved={userSaves.has(post.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
