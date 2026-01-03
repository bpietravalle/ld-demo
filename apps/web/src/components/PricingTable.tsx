import { useFlags } from "launchdarkly-react-client-sdk";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  enterprise?: boolean;
}

const TIERS: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: ["5 projects", "Basic analytics", "Community support"],
  },
  {
    name: "Pro",
    price: "$29",
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

export function PricingTable() {
  const { showEnterpriseTier } = useFlags();

  const visibleTiers = TIERS.filter(
    (tier) => !tier.enterprise || showEnterpriseTier,
  );

  return (
    <section className="py-20 px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            {showEnterpriseTier
              ? "You have access to all tiers including Enterprise!"
              : "Upgrade to Pro or become a beta tester to see Enterprise pricing."}
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
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-800">
                  {tier.price}
                </span>
                {tier.price !== "Custom" && (
                  <span className="text-slate-500 ml-1">/month</span>
                )}
              </div>

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
