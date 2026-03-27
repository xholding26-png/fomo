# Fomo ⏳

Posts that disappear. Save them or lose them forever.

## Setup

1. Create a [Supabase](https://supabase.com) project
2. Run `supabase/schema.sql` in the SQL editor
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase URL + anon key
4. Enable **Email Auth** (magic link) in Supabase → Authentication → Providers
5. `pnpm install && pnpm dev`

## Features

- 🔥 Create posts with self-destruct timers (5min / 15min / 60min)
- ⚡ Save posts before they expire — preserved forever
- 💀 Expired unsaved posts are "lost forever"
- 📊 Profile with stats: posts created, saves given, saves received
- 🔐 Email magic link auth via Supabase
- 🎨 Dark theme with amber/yellow urgency accents
