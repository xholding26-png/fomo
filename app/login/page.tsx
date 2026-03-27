"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            <span className="text-fomo-amber">fomo</span>
          </h1>
          <p className="mt-2 text-sm text-fomo-muted">
            Sign in to save posts before they vanish
          </p>
        </div>

        {sent ? (
          <div className="rounded-xl border border-fomo-amber/30 bg-fomo-amber/5 p-6 text-center">
            <p className="text-lg font-semibold text-fomo-amber">✉️ Check your email</p>
            <p className="mt-2 text-sm text-fomo-muted">
              We sent a magic link to <span className="text-white">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full rounded-xl border border-fomo-border bg-fomo-card px-4 py-3 text-white placeholder:text-fomo-muted focus:border-fomo-amber focus:outline-none focus:ring-1 focus:ring-fomo-amber"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-fomo-amber py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-fomo-muted">
          No password needed. We'll email you a link.
        </p>
      </div>
    </div>
  );
}
