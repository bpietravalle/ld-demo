import { useLDClient, useFlags } from "launchdarkly-react-client-sdk";
import { useState } from "react";
import { ThemeIndicator } from "./ThemeProvider";
import type { MockUser, MockDevice, MockOrg } from "../types/ld-contexts";

/**
 * DevPanel - Demonstrates multi-context targeting
 *
 * Allows switching between:
 * - User contexts (with visits/purchases for segment testing)
 * - Device contexts (mobile/desktop/tablet)
 * - Organization contexts (different companies)
 *
 * Uses LaunchDarkly multi-context format for combined targeting.
 *
 * To test segments:
 * 1. Create segments in LD console (power-users, enterprise-orgs)
 * 2. Add segment to a flag's targeting rules
 * 3. Switch contexts here to see flag changes
 */

const MOCK_USERS: MockUser[] = [
  {
    key: "anon-visitor",
    name: "Anonymous",
    plan: "free",
    betaTester: false,
    visits: 1,
    purchases: 0,
  },
  {
    key: "free-abc123",
    name: "Free User",
    plan: "free",
    betaTester: false,
    visits: 5,
    purchases: 1,
  },
  {
    key: "pro-xyz789",
    name: "Pro User",
    plan: "pro",
    betaTester: false,
    visits: 25,
    purchases: 5,
  },
  {
    key: "power-user-42",
    name: "Power User",
    plan: "pro",
    betaTester: false,
    visits: 150,
    purchases: 12,
  },
  {
    key: "ent-demo-42",
    name: "Enterprise User",
    plan: "enterprise",
    betaTester: true,
    visits: 200,
    purchases: 25,
  },
  {
    key: "beta-tester-a",
    name: "Beta Tester",
    plan: "enterprise",
    betaTester: true,
    visits: 50,
    purchases: 8,
  },
];

const MOCK_DEVICES: MockDevice[] = [
  {
    key: "desktop-chrome",
    label: "Desktop",
    deviceType: "desktop",
    os: "macOS",
  },
  { key: "mobile-iphone", label: "iPhone", deviceType: "mobile", os: "iOS" },
  {
    key: "mobile-android",
    label: "Android",
    deviceType: "mobile",
    os: "Android",
  },
  { key: "tablet-ipad", label: "iPad", deviceType: "tablet", os: "iPadOS" },
];

const MOCK_ORGS: MockOrg[] = [
  {
    key: "org-startup-abc",
    orgName: "TechStartup Inc",
    industry: "technology",
    employees: 15,
    plan: "startup",
  },
  {
    key: "org-midsize-xyz",
    orgName: "GrowthCorp",
    industry: "finance",
    employees: 250,
    plan: "business",
  },
  {
    key: "org-enterprise-mega",
    orgName: "MegaCorp Global",
    industry: "retail",
    employees: 5000,
    plan: "enterprise",
  },
];

// Map camelCase flag keys back to kebab-case for variationDetail()
const FLAG_KEY_MAP: Record<string, string> = {
  enhancedHero: "enhanced-hero",
  showEnterpriseTier: "show-enterprise-tier",
  heroCtaText: "hero-cta-text",
  landingChatbot: "landing-chatbot",
  discountPercentage: "discount-percentage",
  themeConfig: "theme-config",
  mobileOptimizedCheckout: "mobile-optimized-checkout",
};

// Reason kind labels for display
const REASON_LABELS: Record<string, { label: string; color: string }> = {
  OFF: { label: "OFF", color: "text-slate-400" },
  FALLTHROUGH: { label: "DEFAULT", color: "text-blue-400" },
  TARGET_MATCH: { label: "TARGET", color: "text-green-400" },
  RULE_MATCH: { label: "RULE", color: "text-purple-400" },
  PREREQUISITE_FAILED: { label: "PREREQ", color: "text-orange-400" },
  ERROR: { label: "ERROR", color: "text-red-400" },
};

export function DevPanel() {
  const ldClient = useLDClient();
  const flags = useFlags();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<MockUser>(MOCK_USERS[0]);
  const [currentDevice, setCurrentDevice] = useState<MockDevice>(
    MOCK_DEVICES[0],
  );
  const [currentOrg, setCurrentOrg] = useState<MockOrg>(MOCK_ORGS[0]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Sends multi-context identify() with user + device + organization
   * This enables targeting rules like:
   * - "user.plan = enterprise AND device.deviceType = mobile"
   * - "organization.employees > 100"
   */
  const updateContext = async (
    user: MockUser,
    device: MockDevice,
    org: MockOrg,
  ) => {
    if (!ldClient) return;

    setIsLoading(true);

    // Multi-context format - combines all three context kinds
    await ldClient.identify({
      kind: "multi",
      user: {
        key: user.key,
        name: user.name,
        plan: user.plan,
        betaTester: user.betaTester,
        visits: user.visits,
        purchases: user.purchases,
      },
      device: {
        key: device.key,
        deviceType: device.deviceType,
        os: device.os,
      },
      organization: {
        key: org.key,
        orgName: org.orgName,
        industry: org.industry,
        employees: org.employees,
        plan: org.plan,
      },
    });

    setCurrentUser(user);
    setCurrentDevice(device);
    setCurrentOrg(org);
    setIsLoading(false);
  };

  // Check if user qualifies as "power user" (for segment demo)
  const isPowerUser = currentUser.visits > 10 || currentUser.purchases > 3;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-4 left-4 z-50
          w-12 h-12 rounded-full
          bg-slate-800 text-white
          flex items-center justify-center
          shadow-lg hover:bg-slate-700
          transition-all duration-200
          ${isOpen ? "rotate-45" : ""}
        `}
        title="Demo Controls"
      >
        <span className="text-xl">⚙</span>
      </button>

      {/* Panel */}
      <div
        className={`
          fixed bottom-20 left-4 z-50
          w-96 bg-slate-900 text-white rounded-xl
          shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto
          transform transition-all duration-300 ease-out
          ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}
        `}
      >
        {/* Header */}
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 sticky top-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Dev Panel</span>
            <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
              LaunchDarkly
            </span>
          </div>
          <div className="mt-2">
            <ThemeIndicator />
          </div>
        </div>

        {/* User Context */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wide">
              👤 User Context
            </span>
            {isPowerUser && (
              <span className="text-xs bg-amber-600 px-2 py-0.5 rounded">
                Power User
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{currentUser.name}</span>
            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">
              {currentUser.plan}
            </span>
            {currentUser.betaTester && (
              <span className="text-xs bg-purple-600 px-2 py-0.5 rounded">
                Beta
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 mb-2">
            Visits: {currentUser.visits} | Purchases: {currentUser.purchases}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_USERS.map((user) => (
              <button
                key={user.key}
                onClick={() => updateContext(user, currentDevice, currentOrg)}
                disabled={isLoading || user.key === currentUser.key}
                className={`
                  text-xs px-2 py-1 rounded transition-colors
                  ${
                    user.key === currentUser.key
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                  }
                  disabled:opacity-50
                `}
              >
                {user.name}
              </button>
            ))}
          </div>
        </div>

        {/* Organization Context */}
        <div className="p-4 border-b border-slate-700">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
            🏢 Organization Context
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{currentOrg.orgName}</span>
            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">
              {currentOrg.plan}
            </span>
          </div>
          <div className="text-xs text-slate-400 mb-2">
            {currentOrg.industry} | {currentOrg.employees.toLocaleString()}{" "}
            employees
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_ORGS.map((org) => (
              <button
                key={org.key}
                onClick={() => updateContext(currentUser, currentDevice, org)}
                disabled={isLoading || org.key === currentOrg.key}
                className={`
                  text-xs px-2 py-1 rounded transition-colors
                  ${
                    org.key === currentOrg.key
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                  }
                  disabled:opacity-50
                `}
              >
                {org.orgName}
              </button>
            ))}
          </div>
        </div>

        {/* Device Context */}
        <div className="p-4 border-b border-slate-700">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
            📱 Device Context
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{currentDevice.label}</span>
            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">
              {currentDevice.deviceType}
            </span>
            <span className="text-xs text-slate-400">{currentDevice.os}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_DEVICES.map((device) => (
              <button
                key={device.key}
                onClick={() => updateContext(currentUser, device, currentOrg)}
                disabled={isLoading || device.key === currentDevice.key}
                className={`
                  text-xs px-2 py-1 rounded transition-colors
                  ${
                    device.key === currentDevice.key
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                  }
                  disabled:opacity-50
                `}
              >
                {device.label}
              </button>
            ))}
          </div>
        </div>

        {/* Flag Evaluations - Combined flags + reasons */}
        <div className="p-4">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
            🚩 Flag Evaluations ({Object.keys(flags).length})
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {ldClient ? (
              Object.entries(flags).map(([camelKey, value]) => {
                // Get the kebab-case key for variationDetail
                const kebabKey = FLAG_KEY_MAP[camelKey] || camelKey;

                // Get default value based on type
                let defaultValue: boolean | string | number | object = false;
                if (typeof value === "string") defaultValue = "";
                else if (typeof value === "number") defaultValue = 0;
                else if (typeof value === "object" && value !== null)
                  defaultValue = {};

                // Get evaluation details
                const detail = ldClient.variationDetail(kebabKey, defaultValue);
                const reason = detail.reason;
                const reasonKind = reason?.kind || "UNKNOWN";
                const reasonInfo = REASON_LABELS[reasonKind] || {
                  label: reasonKind,
                  color: "text-slate-400",
                };

                // Build reason tag
                let reasonTag = reasonInfo.label;
                if (reason?.ruleIndex !== undefined) {
                  reasonTag += ` #${reason.ruleIndex}`;
                }

                // Format display value
                let displayValue: string;
                if (typeof value === "boolean") {
                  displayValue = value ? "ON" : "OFF";
                } else if (typeof value === "number") {
                  displayValue = String(value);
                } else if (typeof value === "object") {
                  displayValue = JSON.stringify(value);
                } else {
                  displayValue = String(value);
                }

                return (
                  <div
                    key={camelKey}
                    className="bg-slate-800 px-3 py-2 rounded"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-300 text-xs font-medium">
                        {camelKey}
                      </span>
                      <span
                        className={`text-xs font-mono px-1.5 py-0.5 rounded ${reasonInfo.color} bg-slate-700`}
                      >
                        {reasonTag}
                      </span>
                    </div>
                    <div className="text-xs text-green-400 font-mono truncate">
                      {displayValue}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-slate-500 text-sm">
                LD Client not available
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
