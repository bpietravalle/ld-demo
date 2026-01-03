export function StandardHero() {
  return (
    <section className="py-20 px-8 text-center bg-slate-100 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-slate-800">
          Welcome to Our Platform
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          The standard experience for all users.
        </p>
        <button className="px-8 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors">
          Get Started
        </button>
      </div>
    </section>
  );
}
