import LaunchDarkly, { LDClient } from "@launchdarkly/node-server-sdk";

let ldClient: LDClient | null = null;

export async function initLDClient(): Promise<LDClient> {
  if (ldClient) return ldClient;

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
