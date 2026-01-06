import { useFlags } from "launchdarkly-react-client-sdk";

/**
 * MobileCheckoutBanner - Demonstrates device-based targeting
 *
 * Shows a mobile-optimized checkout prompt when:
 * - Flag "mobile-optimized-checkout" is ON
 * - Best when targeted to: device.deviceType = "mobile"
 *
 * Example targeting rule in LaunchDarkly:
 * If device.deviceType is one of "mobile" → serve true
 */
export function MobileCheckoutBanner() {
  const { mobileOptimizedCheckout } = useFlags();

  if (!mobileOptimizedCheckout) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📱</span>
          <div>
            <p className="font-semibold">Mobile Checkout Available!</p>
            <p className="text-sm text-blue-100">
              Faster checkout optimized for your device
            </p>
          </div>
        </div>
        <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Try Now
        </button>
      </div>
    </div>
  );
}
