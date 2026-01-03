import type { Request } from "express";
import type { LDContext } from "@launchdarkly/node-server-sdk";

export function extractContext(req: Request): LDContext {
  const { userId, plan, betaTester } = req.query;

  return {
    kind: "user",
    key: (userId as string) || "anonymous",
    plan: (plan as string) || "free",
    betaTester: betaTester === "true",
  };
}
