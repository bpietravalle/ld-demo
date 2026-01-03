import { Router, Request, Response } from "express";
import type { Router as RouterType } from "express";
import OpenAI from "openai";
import { getAIClient } from "../ld/ai-client.js";

const router: RouterType = Router();

// Lazy initialize OpenAI client
let openai: OpenAI | null = null;
function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const openaiClient = getOpenAI();
    if (!openaiClient) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    const aiClient = getAIClient();

    // Get AI config from LaunchDarkly
    const context = {
      kind: "user" as const,
      key: req.headers["x-user-key"]?.toString() || "anonymous",
    };

    const configKey = "landing-chatbot-config";
    const aiConfig = await aiClient.config(configKey, context, {}, {});

    if (!aiConfig.model?.name) {
      return res
        .status(500)
        .json({ error: "AI Config model not configured in LaunchDarkly" });
    }

    // Build messages array with config from LD (fallback if no messages configured)
    const configMessages = aiConfig.messages || [];
    const systemPrompt =
      configMessages.length > 0
        ? configMessages.map((m) => ({
            role: m.role as "system" | "user" | "assistant",
            content: m.content,
          }))
        : [
            {
              role: "system" as const,
              content: "You are a helpful assistant for LD Demo App.",
            },
          ];

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      ...systemPrompt,
      { role: "user" as const, content: message },
    ];

    // Track the request
    const tracker = aiConfig.tracker;

    // Call OpenAI with the configured model
    const completion = await openaiClient.chat.completions.create({
      model: aiConfig.model!.name,
      messages,
      max_tokens: 500,
    });

    const responseText =
      completion.choices[0]?.message?.content || "No response";

    // Track success metrics
    tracker?.trackSuccess();

    res.json({
      response: responseText,
      model: aiConfig.model?.name,
      configEnabled: aiConfig.enabled,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat request" });
  }
});

export default router;
