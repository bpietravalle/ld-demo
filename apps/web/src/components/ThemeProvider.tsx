import { createContext, useContext, useEffect, ReactNode } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";

/**
 * ThemeProvider - Demonstrates JSON flag type for dynamic theming
 *
 * Required LaunchDarkly setup:
 * Create flag: "theme-config" (JSON type - multivariate)
 *
 * Example variations:
 * - Default Light: {"mode":"light","accent":"blue","borderRadius":"md"}
 * - Dark Purple:   {"mode":"dark","accent":"purple","borderRadius":"lg"}
 * - Eco Theme:     {"mode":"light","accent":"green","borderRadius":"sm"}
 *
 * Use targeting rules to serve different themes to different users/segments.
 */

interface ThemeConfig {
  mode: "light" | "dark";
  accent: "blue" | "purple" | "green";
  borderRadius: "sm" | "md" | "lg";
}

const DEFAULT_THEME: ThemeConfig = {
  mode: "light",
  accent: "blue",
  borderRadius: "md",
};

// Accent color mappings
const ACCENT_COLORS = {
  blue: {
    primary: "#4f46e5", // indigo-600
    primaryHover: "#4338ca", // indigo-700
    primaryLight: "#e0e7ff", // indigo-100
  },
  purple: {
    primary: "#7c3aed", // violet-600
    primaryHover: "#6d28d9", // violet-700
    primaryLight: "#ede9fe", // violet-100
  },
  green: {
    primary: "#059669", // emerald-600
    primaryHover: "#047857", // emerald-700
    primaryLight: "#d1fae5", // emerald-100
  },
};

// Border radius mappings
const BORDER_RADIUS = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
};

const ThemeContext = createContext<ThemeConfig>(DEFAULT_THEME);

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Flag key: "theme-config" → converted to themeConfig by React SDK
  const { themeConfig } = useFlags();

  // Validate and merge with defaults
  const theme: ThemeConfig = {
    ...DEFAULT_THEME,
    ...(typeof themeConfig === "object" && themeConfig !== null
      ? themeConfig
      : {}),
  };

  // Apply CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;

    // Apply dark mode class
    if (theme.mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply accent colors as CSS variables
    const colors = ACCENT_COLORS[theme.accent] || ACCENT_COLORS.blue;
    root.style.setProperty("--color-primary", colors.primary);
    root.style.setProperty("--color-primary-hover", colors.primaryHover);
    root.style.setProperty("--color-primary-light", colors.primaryLight);

    // Apply border radius
    const radius = BORDER_RADIUS[theme.borderRadius] || BORDER_RADIUS.md;
    root.style.setProperty("--radius-base", radius);
  }, [theme.mode, theme.accent, theme.borderRadius]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

/**
 * ThemeIndicator - Shows current theme in DevPanel for debugging
 */
export function ThemeIndicator() {
  const theme = useTheme();

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: ACCENT_COLORS[theme.accent].primary }}
      />
      <span className="text-slate-600 dark:text-slate-400">
        {theme.mode} / {theme.accent} / {theme.borderRadius}
      </span>
    </div>
  );
}
