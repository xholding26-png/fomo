"use client";

import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { createClient, type Post } from "@/lib/supabase";

type PostCardProps = {
  post: Post;
  currentUserId: string | null;
  isSaved?: boolean;
  showExpiredState?: boolean;
};

export default function PostCard({ post, currentUserId, isSaved: initialSaved = false, showExpiredState = true }: PostCardProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [saveCount, setSaveCount] = useState(post.save_count);
  const [saving, setSaving] = useState(false);

  const isExpired = new Date(post.expires_at).getTime() < Date.now();
  const isLostForever = isExpired && !saved && saveCount === 0;

  const handleSave = async () => {
    if (!currentUserId || saved || isExpired) return;
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase.from("saves").insert({
      user_id: currentUserId,
      post_id: post.id,
    });

    if (!error) {
      setSaved(true);
      setSaveCount((c) => c + 1);
    }
    setSaving(false);
  };

  return (
    <div
      className={`relative rounded-xl border p-4 transition-all ${
        isLostForever && showExpiredState
          ? "border-red-900/50 bg-red-950/20 opacity-60"
          : isExpired && showExpiredState
          ? "border-fomo-border bg-fomo-card/50 opacity-75"
          : "border-fomo-border bg-fomo-card hover:border-fomo-amber/30"
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-fomo-muted">
          {post.author_name}
        </span>
        <CountdownTimer expiresAt={post.expires_at} />
      </div>

      {/* Content */}
      <p className="mb-4 text-[15px] leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-fomo-muted">
          {saveCount} save{saveCount !== 1 ? "s" : ""}
        </span>

        {isLostForever && showExpiredState ? (
          <span className="text-xs font-medium text-red-400 italic">
            💀 Lost forever
          </span>
        ) : saved ? (
          <span className="text-xs font-medium text-fomo-amber">
            ✓ Saved
          </span>
        ) : !isExpired && currentUserId ? (
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-fomo-amber/10 px-3 py-1.5 text-xs font-semibold text-fomo-amber transition hover:bg-fomo-amber/20 disabled:opacity-50"
          >
            {saving ? "Saving..." : "⚡ Save"}
          </button>
        ) : null}
      </div>

      {/* Timer badge overlay */}
      <div className="absolute -top-2 -right-2">
        <span className="inline-block rounded-full bg-fomo-card border border-fomo-border px-2 py-0.5 text-[10px] text-fomo-muted">
          {post.timer_minutes}min
        </span>
      </div>
    </div>
  );
}
