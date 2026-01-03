/**
 * LaunchDarkly AI SDK Client
 *
 * This module provides the AI client for dynamic prompt/model configuration.
 *
 * Required setup:
 * 1. Create an AI Config in LaunchDarkly Dashboard:
 *    Go to: AI Configs → Create AI Config
 *    Key: "landing-chatbot-config" (or your preferred key)
 *    Configure: Model selection, system prompt, temperature, etc.
 *
 * 2. Set OPENAI_API_KEY in your .env file
 *    Where to find: https://platform.openai.com/api-keys
 *
 * The AI Config allows you to change the chatbot's behavior (model, prompt, etc.)
 * without redeploying code - changes take effect immediately.
 */
import { initAi } from "@launchdarkly/server-sdk-ai";
import { getLDClient } from "./client.js";

let aiClient: ReturnType<typeof initAi> | null = null;

export function getAIClient() {
  if (!aiClient) {
    const ldClient = getLDClient();
    if (!ldClient) {
      throw new Error("LaunchDarkly client not initialized");
    }
    // Initialize AI client - requires LD client to be ready
    aiClient = initAi(ldClient);
  }
  return aiClient;
}
