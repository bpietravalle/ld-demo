/**
 * Flag key constants for CLI operations
 */
export const FLAGS = {
  ENHANCED_HERO: "enhanced-hero",
  SHOW_ENTERPRISE_TIER: "show-enterprise-tier",
  HERO_CTA_TEXT: "hero-cta-text",
  LANDING_CHATBOT: "landing-chatbot",
  LANDING_CHATBOT_CONFIG: "landing-chatbot-config",
} as const;

export type FlagKey = (typeof FLAGS)[keyof typeof FLAGS];
