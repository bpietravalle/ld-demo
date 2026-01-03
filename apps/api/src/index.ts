import express from "express";
import cors from "cors";
import { initLDClient, closeLDClient } from "./ld/client.js";
import healthRouter from "./routes/health.js";
import chatRouter from "./routes/chat.js";
import webhookRouter from "./routes/webhook.js";

const app = express();
const port = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/health", healthRouter);
app.use("/api/chat", chatRouter);
app.use("/ld-webhook", webhookRouter);

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down...");
  await closeLDClient();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start server
async function start() {
  try {
    await initLDClient();
    app.listen(port, () => {
      console.log(`API server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
