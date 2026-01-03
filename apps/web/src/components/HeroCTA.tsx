import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";

export function HeroCTA() {
  const { heroCtaText } = useFlags();
  const ldClient = useLDClient();

  const handleClick = () => {
    // Track the click event for experimentation
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
