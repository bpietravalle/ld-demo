import { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: "info" | "success" | "warning";
}

interface ToastProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ messages, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {messages.map((msg) => (
        <Toast key={msg.id} message={msg} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({
  message,
  onDismiss,
}: {
  message: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setIsVisible(true));

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(message.id), 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [message.id, onDismiss]);

  const bgColor = {
    info: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-amber-600",
  }[message.type];

  const icon = {
    info: "🚀",
    success: "✓",
    warning: "⚠",
  }[message.type];

  return (
    <div
      className={`
        ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg
        min-w-[280px] max-w-[360px]
        transform transition-all duration-300 ease-out
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg">{icon}</span>
        <div className="flex-1">
          <div className="font-semibold">{message.title}</div>
          {message.description && (
            <div className="text-sm opacity-90 mt-0.5">
              {message.description}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(message.id), 300);
          }}
          className="opacity-70 hover:opacity-100 text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
