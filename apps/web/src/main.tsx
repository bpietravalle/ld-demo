import React from "react";
import ReactDOM from "react-dom/client";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import App from "./App";
import "./index.css";

/**
 * LaunchDarkly Client-side ID
 *
 * Where to find: LaunchDarkly Dashboard → Settings → Environments → [Your Environment]
 * The Client-side ID is safe to expose in browser code (it's not a secret).
 *
 * Set this in your .env file as: VITE_LD_CLIENT_ID=your-client-side-id
 */
const clientSideID = import.meta.env.VITE_LD_CLIENT_ID;

if (!clientSideID) {
  console.error("VITE_LD_CLIENT_ID is required");
}

(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: clientSideID || "",
    // Multi-context: user + device + organization
    context: {
      kind: "multi",
      user: {
        key: "anon-visitor",
        name: "Anonymous",
        plan: "free",
        betaTester: false,
        visits: 1,
        purchases: 0,
      },
      device: {
        key: "desktop-chrome",
        deviceType: "desktop",
        os: "macOS",
      },
      organization: {
        key: "org-startup-abc",
        orgName: "TechStartup Inc",
        industry: "technology",
        employees: 15,
        plan: "startup",
      },
    },
    options: {
      // Required for variationDetail() to return evaluation reasons
      evaluationReasons: true,
    },
    reactOptions: {
      useCamelCaseFlagKeys: true,
    },
  });

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <LDProvider>
        <App />
      </LDProvider>
    </React.StrictMode>,
  );
})();
