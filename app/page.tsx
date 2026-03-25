export default function Home() {
  const posts = [
    { preview: "The real reason Solana Foundation is accumulating this token...", timer: "4:32", saves: 89, cost: "0.5 SOL", author: "@insider" },
    { preview: "I found a 100x that nobody is talking about yet", timer: "12:15", saves: 234, cost: "0.2 SOL", author: "@alpha_caller" },
    { preview: "This whale wallet just did something very interesting...", timer: "1:07", saves: 567, cost: "1.0 SOL", author: "@whale_watcher" },
    { preview: "The meta shift happening right now that will define Q2", timer: "23:45", saves: 45, cost: "0.3 SOL", author: "@narrative_king" },
    { preview: "Screenshot of a conversation you weren't supposed to see", timer: "0:38", saves: 1203, cost: "2.0 SOL", author: "@anon" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-yellow-500/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏳</span>
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Fomo
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://x.com" target="_blank" className="text-gray-400 hover:text-white transition">𝕏</a>
            <button className="bg-yellow-600 hover:bg-yellow-500 px-5 py-2 rounded-lg font-medium transition text-black">
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/20 to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-300 text-sm mb-6">
            ⏱️ 23 posts expiring in the next hour
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            Disappearing{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Posts
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Your post exists for X minutes. Pay to save it before it vanishes forever. More saves = more you earn. Scarcity meets content.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-yellow-500 hover:bg-yellow-400 px-8 py-3.5 rounded-xl font-semibold text-lg transition shadow-lg shadow-yellow-600/25 text-black">
              Post Something
            </button>
            <button className="border border-gray-700 hover:border-gray-500 px-8 py-3.5 rounded-xl font-semibold text-lg transition text-gray-300">
              Save Before Gone
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            How It <span className="text-yellow-400">Works</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "📝", title: "Post", desc: "Write something. Set a timer: 5, 15, or 60 minutes. After that, it's gone forever." },
              { step: "02", icon: "💾", title: "Save", desc: "Others pay SOL to save your post before it expires. The clock is ticking." },
              { step: "03", icon: "💰", title: "Earn", desc: "More saves = more you earn. If nobody saves it, it vanishes into the void." },
            ].map((item) => (
              <div key={item.step} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:border-yellow-500/30 transition group">
                <div className="text-yellow-500/40 font-mono text-sm mb-4">{item.step}</div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-300 transition">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expiring Soon */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Expiring <span className="text-yellow-400">Soon</span>
          </h2>
          <p className="text-gray-500 text-center mb-12">Save them or lose them forever</p>
          <div className="space-y-3">
            {posts.map((p, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-6 py-5 hover:border-yellow-500/20 transition cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-sm">{p.author}</span>
                  <span className={`font-mono text-sm font-bold ${
                    parseInt(p.timer) < 5 ? "text-red-400 animate-pulse" : "text-yellow-400"
                  }`}>
                    ⏱️ {p.timer}
                  </span>
                </div>
                <p className="text-gray-200 group-hover:text-white transition mb-3">{p.preview}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">💾 {p.saves} saves</span>
                  <span className="text-yellow-400 font-medium">{p.cost} to save</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-b from-yellow-900/30 to-transparent border border-yellow-500/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-4">Nothing Lasts Forever.</h2>
            <p className="text-gray-400 mb-8">That&apos;s what makes it valuable.</p>
            <button className="bg-yellow-500 hover:bg-yellow-400 px-8 py-3.5 rounded-xl font-semibold text-lg transition shadow-lg shadow-yellow-600/25 text-black">
              Create a Moment
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⏳</span>
            <span className="text-gray-500">Fomo © 2026</span>
          </div>
          <div className="flex gap-6 text-gray-500">
            <a href="https://x.com" className="hover:text-white transition">𝕏</a>
            <a href="#" className="hover:text-white transition">Docs</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
