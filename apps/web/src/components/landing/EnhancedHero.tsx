import { HeroCTA } from "../HeroCTA";

export function EnhancedHero() {
  return (
    <section className="py-20 px-8 text-center bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 text-white animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <span className="inline-block mb-4 px-4 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
          New Experience
        </span>
        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          Experience the Future
        </h1>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          You're seeing the enhanced hero — powered by LaunchDarkly feature
          flags. Toggle it off to see the difference instantly.
        </p>
        <HeroCTA />
      </div>
    </section>
  );
}
