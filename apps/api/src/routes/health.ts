import { Router } from "express";
import type { Router as RouterType } from "express";
import { getLDClient } from "../ld/client.js";

const router: RouterType = Router();

router.get("/", async (_req, res) => {
  try {
    const client = getLDClient();
    const initialized = client.initialized();
    res.json({
      status: initialized ? "healthy" : "degraded",
      launchdarkly: initialized ? "connected" : "not initialized",
    });
  } catch {
    res.json({ status: "degraded", launchdarkly: "not initialized" });
  }
});

export default router;
