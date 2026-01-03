/**
 * LaunchDarkly Node Server SDK Client
 *
 * This module initializes the server-side SDK for flag evaluation.
 *
 * Required setup:
 * 1. Set LD_SDK_KEY in your .env file
 *    Where to find: LaunchDarkly Dashboard → Settings → Environments → [Your Environment]
 *    Click "SDK Key" to reveal the server-side SDK key (starts with "sdk-")
 *
 * Note: The SDK key is a secret and should never be exposed in client-side code.
 * For browser/client apps, use the Client-side ID instead.
 */
import LaunchDarkly, { LDClient } from "@launchdarkly/node-server-sdk";

let ldClient: LDClient | null = null;

export async function initLDClient(): Promise<LDClient> {
  if (ldClient) return ldClient;

  // SDK key from environment - keep this secret!
  const sdkKey = process.env.LD_SDK_KEY;
  if (!sdkKey) {
    throw new Error("LD_SDK_KEY environment variable is required");
  }

  ldClient = LaunchDarkly.init(sdkKey);
  await ldClient.waitForInitialization({ timeout: 10 });
  console.log("LaunchDarkly SDK initialized");

  return ldClient;
}

export function getLDClient(): LDClient {
  if (!ldClient) {
    throw new Error(
      "LaunchDarkly client not initialized. Call initLDClient() first.",
    );
  }
  return ldClient;
}

export async function closeLDClient(): Promise<void> {
  if (ldClient) {
    await ldClient.close();
    ldClient = null;
    console.log("LaunchDarkly SDK closed");
  }
}
