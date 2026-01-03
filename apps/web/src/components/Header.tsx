export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LD</span>
          </div>
          <span className="font-semibold text-slate-800">Demo App</span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#docs"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Docs
          </a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </button>
          <button className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
