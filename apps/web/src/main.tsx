import React from "react";
import ReactDOM from "react-dom/client";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import App from "./App";
import "./index.css";

const clientSideID = import.meta.env.VITE_LD_CLIENT_ID;

if (!clientSideID) {
  console.error("VITE_LD_CLIENT_ID is required");
}

(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: clientSideID || "",
    context: {
      kind: "user",
      key: "anonymous",
      anonymous: true,
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
