import { initAi } from "@launchdarkly/server-sdk-ai";
import { getLDClient } from "./client.js";

let aiClient: ReturnType<typeof initAi> | null = null;

export function getAIClient() {
  if (!aiClient) {
    const ldClient = getLDClient();
    if (!ldClient) {
      throw new Error("LaunchDarkly client not initialized");
    }
    aiClient = initAi(ldClient);
  }
  return aiClient;
}
