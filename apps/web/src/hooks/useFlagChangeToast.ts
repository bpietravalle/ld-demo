import { useEffect, useRef, useCallback, useState } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import type { ToastMessage } from "../components/Toast";

// Human-readable flag names
const FLAG_LABELS: Record<string, string> = {
  "enhanced-hero": "Enhanced Hero",
  "show-enterprise-tier": "Enterprise Tier",
  "hero-cta-text": "Hero CTA Text",
  "landing-chatbot": "AI Chatbot",
};

export function useFlagChangeToast() {
  const ldClient = useLDClient();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const initializedRef = useRef(false);
  const previousFlagsRef = useRef<Record<string, unknown>>({});

  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!ldClient) return;

    const handleChange = (
      changes: Record<string, { current: unknown; previous: unknown }>,
    ) => {
      // Skip the initial load
      if (!initializedRef.current) {
        initializedRef.current = true;
        // Store initial values
        Object.entries(changes).forEach(([key, value]) => {
          previousFlagsRef.current[key] = value.current;
        });
        return;
      }

      // Show toast for each changed flag
      Object.entries(changes).forEach(([flagKey, value]) => {
        const prev = previousFlagsRef.current[flagKey];
        const curr = value.current;

        // Only show if actually changed
        if (prev === curr) return;

        const label = FLAG_LABELS[flagKey] || flagKey;
        let description: string;

        if (typeof curr === "boolean") {
          description = curr ? "Enabled" : "Disabled";
        } else if (typeof curr === "string") {
          description = `Changed to "${curr}"`;
        } else {
          description = "Updated";
        }

        addToast({
          title: label,
          description,
          type: curr ? "success" : "info",
        });

        previousFlagsRef.current[flagKey] = curr;
      });
    };

    ldClient.on("change", handleChange);

    return () => {
      ldClient.off("change", handleChange);
    };
  }, [ldClient, addToast]);

  return { toasts, dismissToast };
}
