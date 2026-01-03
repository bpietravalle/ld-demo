import { useState, useRef, useEffect } from "react";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const { landingChatbot } = useFlags();
  const ldClient = useLDClient();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hide chatbot if flag is off
  if (!landingChatbot) return null;

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const userKey = ldClient?.getContext()?.key?.toString() || "anonymous";
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-key": userKey,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || data.error },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to chat service" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-4 right-4 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-br from-indigo-500 to-purple-600
          text-white text-2xl
          flex items-center justify-center
          shadow-lg shadow-indigo-500/30
          hover:scale-110 hover:shadow-xl hover:shadow-indigo-500/40
          transition-all duration-200
          ${isOpen ? "rotate-0" : ""}
        `}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      <div
        className={`
          fixed bottom-20 right-4 z-50
          w-[360px] h-[480px]
          bg-white rounded-2xl
          shadow-2xl shadow-black/10
          flex flex-col overflow-hidden
          transform transition-all duration-300 ease-out
          ${isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95 pointer-events-none"}
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <div className="font-semibold text-white">AI Assistant</div>
              <div className="text-xs text-white/70">Powered by LD Demo</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">👋</div>
              <div className="text-slate-500 text-sm">
                Hi! Ask me anything about the demo.
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[80%] px-4 py-2.5 rounded-2xl text-sm
                  ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-md"
                      : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-md"
                  }
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-slate-500 px-4 py-2.5 rounded-2xl rounded-bl-md shadow-sm border border-slate-100">
                <span className="inline-flex gap-1">
                  <span
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-slate-100 rounded-full text-sm
                         placeholder:text-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600
                         text-white text-sm font-medium rounded-full
                         hover:shadow-lg hover:shadow-indigo-500/30
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
