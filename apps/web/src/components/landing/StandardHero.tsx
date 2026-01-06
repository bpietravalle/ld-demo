import { useFlags } from "launchdarkly-react-client-sdk";

interface ThemeConfig {
  mode?: "light" | "dark";
  accent?: "blue" | "purple" | "green";
  borderRadius?: "sm" | "md" | "lg";
}

/**
 * StandardHero - Default hero with theme-config flag support
 *
 * When theme-config flag is ON, applies:
 * - Accent color to CTA button
 * - Border radius to button
 * - Dark/light mode to background
 */
export function StandardHero() {
  const { themeConfig } = useFlags();

  // Parse theme config or use defaults
  const theme: ThemeConfig =
    themeConfig && typeof themeConfig === "object" ? themeConfig : {};

  const mode = theme.mode || "light";
  const accent = theme.accent || "blue";
  const radius = theme.borderRadius || "md";

  // Background styles based on mode + accent
  const sectionStyles = {
    light: {
      blue: "bg-gradient-to-br from-indigo-50 to-blue-100",
      purple: "bg-gradient-to-br from-purple-50 to-pink-100",
      green: "bg-gradient-to-br from-emerald-50 to-teal-100",
    },
    dark: {
      blue: "bg-gradient-to-br from-slate-900 to-indigo-950",
      purple: "bg-gradient-to-br from-slate-900 to-purple-950",
      green: "bg-gradient-to-br from-slate-900 to-emerald-950",
    },
  };

  const sectionBg = sectionStyles[mode][accent];
  const headingColor = mode === "dark" ? "text-white" : "text-slate-800";
  const textColor = mode === "dark" ? "text-slate-300" : "text-slate-600";

  // Button accent colors
  const buttonColors = {
    blue: "bg-indigo-600 hover:bg-indigo-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    green: "bg-emerald-600 hover:bg-emerald-700",
  };

  // Border radius
  const borderRadius = {
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-2xl",
  };

  return (
    <section
      className={`py-20 px-8 text-center ${sectionBg} animate-fade-in transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold mb-4 ${headingColor}`}>
          Welcome to Our Platform
        </h1>
        <p className={`text-lg ${textColor} mb-8`}>
          The standard experience for all users.
        </p>
        <button
          className={`px-8 py-3 ${buttonColors[accent]} text-white ${borderRadius[radius]} font-medium transition-colors`}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
