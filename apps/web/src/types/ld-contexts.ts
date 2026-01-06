/**
 * LaunchDarkly Context Types
 *
 * Defines the structure for multi-context targeting.
 * These types match the context kinds configured in LaunchDarkly.
 */

// User context - the primary context for most targeting
export interface LDUserContext {
  key: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  betaTester: boolean;
  visits: number;
  purchases: number;
}

// Device context - for device-specific targeting
export interface LDDeviceContext {
  key: string;
  deviceType: "mobile" | "desktop" | "tablet";
  os: string;
}

// Organization context - for B2B targeting
export interface LDOrganizationContext {
  key: string;
  orgName: string;
  industry: string;
  employees: number;
  plan: "startup" | "business" | "enterprise";
}

// Multi-context combining all three
export interface LDMultiContext {
  kind: "multi";
  user: LDUserContext;
  device: LDDeviceContext;
  organization: LDOrganizationContext;
}

// Helper type for display purposes
export interface MockUser extends LDUserContext {
  // Display-only fields
}

export interface MockDevice extends LDDeviceContext {
  label: string; // Display name
}

export interface MockOrg extends LDOrganizationContext {
  // Display-only fields
}
