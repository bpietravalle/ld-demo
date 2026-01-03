import { Router } from "express";
import type { Router as RouterType } from "express";
import type { Request, Response } from "express";

const router: RouterType = Router();

/**
 * LaunchDarkly Webhook Endpoint
 * Receives flag change events from LD
 * Docs: https://docs.launchdarkly.com/integrations/webhooks
 */
router.post("/", (req: Request, res: Response) => {
  const event = req.body;

  // Log the event with timestamp
  const timestamp = new Date().toISOString();
  console.log("\n" + "=".repeat(60));
  console.log(`[${timestamp}] 🚩 LaunchDarkly Webhook Event`);
  console.log("=".repeat(60));

  // Extract key info based on event type
  if (event._links?.self?.href) {
    console.log(`Resource: ${event._links.self.href}`);
  }

  if (event.accesses) {
    // Flag change event
    for (const access of event.accesses) {
      const action = access.action || "unknown";
      const resource = access.resource || "unknown";
      console.log(`Action: ${action}`);
      console.log(`Resource: ${resource}`);
    }
  }

  if (event.member) {
    console.log(`Changed by: ${event.member.email || event.member._id}`);
  }

  if (event.titleVerb) {
    console.log(`Summary: ${event.titleVerb}`);
  }

  // Log full payload in debug mode
  if (process.env.DEBUG_WEBHOOKS === "true") {
    console.log("\nFull payload:");
    console.log(JSON.stringify(event, null, 2));
  }

  console.log("=".repeat(60) + "\n");

  // Always respond 200 to acknowledge receipt
  res.status(200).json({ received: true });
});

// Health check for the webhook endpoint
router.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ready",
    endpoint: "/ld-webhook",
    description: "POST flag change events here",
  });
});

export default router;
