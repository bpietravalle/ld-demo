import { useFlags } from "launchdarkly-react-client-sdk";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { StandardHero } from "../components/landing/StandardHero";
import { EnhancedHero } from "../components/landing/EnhancedHero";
import { PricingTable } from "../components/PricingTable";
import { Chatbot } from "../components/Chatbot";
import { DevPanel } from "../components/DevPanel";
import { ToastContainer } from "../components/Toast";
import { useFlagChangeToast } from "../hooks/useFlagChangeToast";

export function LandingPage() {
  const { enhancedHero } = useFlags();
  const { toasts, dismissToast } = useFlagChangeToast();

  return (
    <>
      {/* Fixed Header */}
      <Header />

      {/* Main Content - with top padding for fixed header */}
      <main className="pt-16">
        {/* Hero Section */}
        <div className="transition-all duration-500 ease-out">
          {enhancedHero ? <EnhancedHero /> : <StandardHero />}
        </div>

        {/* Pricing Section */}
        <div id="pricing">
          <PricingTable />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Elements */}
      <Chatbot />
      <DevPanel />
      <ToastContainer messages={toasts} onDismiss={dismissToast} />
    </>
  );
}
