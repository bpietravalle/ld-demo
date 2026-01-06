import { useFlags } from "launchdarkly-react-client-sdk";

/**
 * PricingTable - Demonstrates context-based targeting and numeric flags
 *
 * Required LaunchDarkly setup:
 * 1. Create flag: "show-enterprise-tier" (Boolean type)
 *    - If context attribute "betaTester" is "true" → serve true
 *    - Default rule → serve false
 *
 * 2. Create flag: "discount-percentage" (Number type - multivariate)
 *    - Variations: 0, 10, 20, 25 (whole numbers)
 *    - Use targeting rules to serve different discounts to different users
 *
 * The DevPanel component lets you switch between user contexts
 * to see how targeting rules affect flag evaluation.
 */

interface PricingTier {
  name: string;
  price: number | "Custom"; // Base price in dollars (or "Custom" for enterprise)
  description: string;
  features: string[];
  highlighted?: boolean;
  enterprise?: boolean;
}

const TIERS: PricingTier[] = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: ["5 projects", "Basic analytics", "Community support"],
  },
  {
    name: "Pro",
    price: 29,
    description: "For growing teams",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "API access",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
    ],
    enterprise: true,
  },
];

/**
 * Helper to format price with optional discount
 */
function formatPrice(
  basePrice: number | "Custom",
  discountPercent: number,
): { display: string; original?: string; savings?: string } {
  if (basePrice === "Custom") {
    return { display: "Custom" };
  }

  if (basePrice === 0 || discountPercent === 0) {
    return { display: `$${basePrice}` };
  }

  const discounted = Math.round(basePrice * (1 - discountPercent / 100));
  return {
    display: `$${discounted}`,
    original: `$${basePrice}`,
    savings: `${discountPercent}% off`,
  };
}

export function PricingTable() {
  // Flag keys are converted to camelCase by React SDK:
  // "show-enterprise-tier" → showEnterpriseTier
  // "discount-percentage" → discountPercentage
  const { showEnterpriseTier, discountPercentage } = useFlags();

  // Ensure discountPercentage is a valid number (default to 0 if not)
  const discount =
    typeof discountPercentage === "number" ? discountPercentage : 0;

  const visibleTiers = TIERS.filter(
    (tier) => !tier.enterprise || showEnterpriseTier,
  );

  return (
    <section className="py-20 px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Discount Banner */}
        {discount > 0 && (
          <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 text-center shadow-lg shadow-green-500/20">
            <span className="text-lg font-bold">🎉 Special Offer!</span>
            <span className="ml-2">
              Save {discount}% on all paid plans today!
            </span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            {showEnterpriseTier
              ? "You have access to all tiers including Enterprise!"
              : "Upgrade or become a beta tester to see Enterprise pricing."}
          </p>
        </div>

        {/* Pricing cards */}
        <div
          className={`grid gap-6 ${
            visibleTiers.length === 2
              ? "md:grid-cols-2 max-w-3xl mx-auto"
              : "md:grid-cols-3"
          }`}
        >
          {visibleTiers.map((tier) => (
            <div
              key={tier.name}
              className={`
                relative bg-white rounded-2xl p-8 flex flex-col
                transition-all duration-300
                ${
                  tier.highlighted
                    ? "ring-2 ring-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02]"
                    : tier.enterprise
                      ? "ring-2 ring-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50"
                      : "shadow-lg shadow-slate-200/50"
                }
              `}
            >
              {/* Badge */}
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              {tier.enterprise && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Exclusive
                  </span>
                </div>
              )}

              {/* Tier name */}
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                {tier.name}
              </h3>
              <p className="text-sm text-slate-500 mb-4">{tier.description}</p>

              {/* Price */}
              {(() => {
                const priceInfo = formatPrice(tier.price, discount);
                return (
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-slate-800">
                        {priceInfo.display}
                      </span>
                      {priceInfo.display !== "Custom" && (
                        <span className="text-slate-500">/month</span>
                      )}
                    </div>
                    {priceInfo.original && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-400 line-through">
                          {priceInfo.original}/month
                        </span>
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                          {priceInfo.savings}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <svg
                      className={`w-5 h-5 flex-shrink-0 ${
                        tier.enterprise ? "text-purple-500" : "text-indigo-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`
                  w-full py-3 px-6 rounded-lg font-semibold
                  transition-all duration-200
                  ${
                    tier.highlighted
                      ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/30"
                      : tier.enterprise
                        ? "bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/30"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }
                `}
              >
                {tier.enterprise ? "Contact Sales" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
