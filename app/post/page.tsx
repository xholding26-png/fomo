"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const TIMER_OPTIONS = [
  { value: 5, label: "5 min", emoji: "🔥", desc: "Pure chaos" },
  { value: 15, label: "15 min", emoji: "⚡", desc: "Quick window" },
  { value: 60, label: "60 min", emoji: "⏰", desc: "Generous" },
];

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [timer, setTimer] = useState(15);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
      } else {
        setUserId(user.id);
        setUserEmail(user.email ?? "Anonymous");
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !content.trim()) return;
    setLoading(true);

    const supabase = createClient();
    const expiresAt = new Date(Date.now() + timer * 60 * 1000).toISOString();

    const { error } = await supabase.from("posts").insert({
      user_id: userId,
      content: content.trim(),
      timer_minutes: timer,
      expires_at: expiresAt,
      author_name: userEmail.split("@")[0],
    });

    if (!error) {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-fomo-amber">Create Post</h1>
        <p className="mt-1 text-sm text-fomo-muted">
          It'll disappear when the timer runs out
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Content */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's worth sharing right now?"
            maxLength={500}
            rows={4}
            required
            className="w-full resize-none rounded-xl border border-fomo-border bg-fomo-card px-4 py-3 text-white placeholder:text-fomo-muted focus:border-fomo-amber focus:outline-none focus:ring-1 focus:ring-fomo-amber"
          />
          <p className="mt-1 text-right text-xs text-fomo-muted">
            {content.length}/500
          </p>
        </div>

        {/* Timer selector */}
        <div>
          <label className="mb-2 block text-sm font-medium text-fomo-muted">
            Self-destruct timer
          </label>
          <div className="grid grid-cols-3 gap-3">
            {TIMER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTimer(opt.value)}
                className={`rounded-xl border p-3 text-center transition ${
                  timer === opt.value
                    ? "border-fomo-amber bg-fomo-amber/10 text-fomo-amber"
                    : "border-fomo-border bg-fomo-card text-fomo-muted hover:border-fomo-amber/30"
                }`}
              >
                <div className="text-2xl">{opt.emoji}</div>
                <div className="mt-1 text-sm font-bold">{opt.label}</div>
                <div className="text-[10px]">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full rounded-xl bg-fomo-amber py-3 font-bold text-black transition hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? "Posting..." : `Post · Expires in ${timer}min`}
        </button>
      </form>
    </div>
  );
}
