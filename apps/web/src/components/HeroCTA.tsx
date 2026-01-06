import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";

/**
 * HeroCTA - Demonstrates multivariate flags and experimentation
 *
 * Required LaunchDarkly setup:
 * 1. Create flag: "hero-cta-text" (String type)
 *    - Variations: "Get Started", "Try Free", "Start Now" (or your own)
 *    - This flag key maps to `heroCtaText` via useCamelCaseFlagKeys option
 *
 * 2. (Optional) For experimentation:
 *    - Create metric: "hero-cta-clicked" (Custom, Conversion type)
 *    - Create experiment using the hero-cta-text flag
 *    - Attach the metric to measure click-through rates
 */
export function HeroCTA() {
  // Flag key: "hero-cta-text" → converted to heroCtaText by React SDK
  const { heroCtaText } = useFlags();
  const ldClient = useLDClient();

  const handleClick = () => {
    // Track click event for experimentation metrics
    // Metric key must match what's configured in LaunchDarkly
    ldClient?.track("hero-cta-clicked");
    console.log("CTA clicked, event tracked:", "hero-cta-clicked");
  };

  // Default fallback if flag not set
  const buttonText = heroCtaText || "Get Started";

  return (
    <button
      onClick={handleClick}
      className="px-8 py-4 text-lg font-bold text-white bg-white/20 backdrop-blur-sm rounded-lg
                 hover:bg-white/30 hover:scale-105
                 transition-all duration-200
                 shadow-lg hover:shadow-xl"
    >
      {buttonText}
    </button>
  );
}
