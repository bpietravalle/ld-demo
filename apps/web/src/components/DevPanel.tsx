import { useLDClient, useFlags } from "launchdarkly-react-client-sdk";
import { useState } from "react";

interface MockUser {
  key: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  betaTester: boolean;
}

const MOCK_USERS: MockUser[] = [
  { key: "anon-visitor", name: "Anonymous", plan: "free", betaTester: false },
  { key: "free-abc123", name: "Free User", plan: "free", betaTester: false },
  { key: "pro-xyz789", name: "Pro User", plan: "pro", betaTester: false },
  {
    key: "ent-demo-42",
    name: "Enterprise User",
    plan: "enterprise",
    betaTester: true,
  },
  {
    key: "beta-tester-a",
    name: "Beta Tester 1",
    plan: "enterprise",
    betaTester: true,
  },
  {
    key: "qz-beta-99",
    name: "Beta Tester 2",
    plan: "enterprise",
    betaTester: true,
  },
];

export function DevPanel() {
  const ldClient = useLDClient();
  const flags = useFlags();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<MockUser>(MOCK_USERS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const switchUser = async (user: MockUser) => {
    if (!ldClient) return;

    setIsLoading(true);
    await ldClient.identify({
      kind: "user",
      key: user.key,
      name: user.name,
      plan: user.plan,
      betaTester: user.betaTester,
    });
    setCurrentUser(user);
    setIsLoading(false);
  };

  const activeFlags = Object.entries(flags).filter(
    ([, value]) => value === true || (typeof value === "string" && value),
  );

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-4 left-4 z-50
          w-12 h-12 rounded-full
          bg-slate-800 text-white
          flex items-center justify-center
          shadow-lg hover:bg-slate-700
          transition-all duration-200
          ${isOpen ? "rotate-45" : ""}
        `}
        title="Demo Controls"
      >
        <span className="text-xl">⚙</span>
      </button>

      {/* Panel */}
      <div
        className={`
          fixed bottom-20 left-4 z-50
          w-80 bg-slate-900 text-white rounded-xl
          shadow-2xl overflow-hidden
          transform transition-all duration-300 ease-out
          ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}
        `}
      >
        {/* Header */}
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Demo Controls</span>
            <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
              LaunchDarkly
            </span>
          </div>
        </div>

        {/* User Switcher */}
        <div className="p-4 border-b border-slate-700">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
            Current Context
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-medium">{currentUser.name}</span>
            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">
              {currentUser.plan}
            </span>
            {currentUser.betaTester && (
              <span className="text-xs bg-purple-600 px-2 py-0.5 rounded">
                Beta
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {MOCK_USERS.map((user) => (
              <button
                key={user.key}
                onClick={() => switchUser(user)}
                disabled={isLoading || user.key === currentUser.key}
                className={`
                  text-xs px-3 py-1.5 rounded-md transition-colors
                  ${
                    user.key === currentUser.key
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                  }
                  disabled:opacity-50
                `}
              >
                {user.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Flags */}
        <div className="p-4">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
            Active Flags ({activeFlags.length})
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {activeFlags.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between text-sm bg-slate-800 px-3 py-1.5 rounded"
              >
                <span className="text-slate-300 truncate">{key}</span>
                <span className="text-green-400 text-xs font-mono">
                  {typeof value === "boolean" ? "ON" : String(value)}
                </span>
              </div>
            ))}
            {activeFlags.length === 0 && (
              <div className="text-slate-500 text-sm">No active flags</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
