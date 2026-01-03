/**
 * LaunchDarkly REST API client
 * Docs: https://apidocs.launchdarkly.com
 */

const BASE_URL = "https://app.launchdarkly.com/api/v2";

export interface ApiConfig {
  apiToken: string;
  projectKey: string;
  environmentKey: string;
}

export function getApiConfig(): ApiConfig {
  const apiToken = process.env.LD_API_TOKEN;
  const projectKey = process.env.LD_PROJECT_KEY || "default";
  const environmentKey = process.env.LD_ENVIRONMENT_KEY || "test";

  if (!apiToken) {
    throw new Error("LD_API_TOKEN environment variable is required");
  }

  return { apiToken, projectKey, environmentKey };
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { apiToken } = getApiConfig();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: apiToken,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error (${response.status}): ${error}`);
  }

  return response.json();
}

// Flag types
export interface Flag {
  key: string;
  name: string;
  kind: string;
  description?: string;
  environments: Record<
    string,
    {
      on: boolean;
      archived: boolean;
    }
  >;
}

export interface FlagsResponse {
  items: Flag[];
  totalCount: number;
}

// List all flags with environment data
export async function listFlags(): Promise<Flag[]> {
  const { projectKey, environmentKey } = getApiConfig();
  const data = await apiRequest<FlagsResponse>(
    `/flags/${projectKey}?env=${environmentKey}`,
  );
  return data.items;
}

// Toggle flag on/off
export async function toggleFlag(
  flagKey: string,
  turnOn: boolean,
): Promise<void> {
  const { projectKey, environmentKey } = getApiConfig();

  await apiRequest(`/flags/${projectKey}/${flagKey}`, {
    method: "PATCH",
    headers: {
      "Content-Type":
        "application/json; domain-model=launchdarkly.semanticpatch",
    },
    body: JSON.stringify({
      environmentKey,
      instructions: [{ kind: turnOn ? "turnFlagOn" : "turnFlagOff" }],
    }),
  });
}

// Metric types
export interface Metric {
  key: string;
  name: string;
  kind: string;
  description?: string;
  isNumeric: boolean;
  eventKey?: string;
}

export interface MetricsResponse {
  items: Metric[];
  totalCount: number;
}

// List all metrics
export async function listMetrics(): Promise<Metric[]> {
  const { projectKey } = getApiConfig();
  const data = await apiRequest<MetricsResponse>(`/metrics/${projectKey}`);
  return data.items;
}

// Experiment types
export interface Experiment {
  key: string;
  name: string;
  description?: string;
  maintainerId?: string;
  currentIteration?: {
    status: string;
    startDate?: number;
    endDate?: number;
  };
}

export interface ExperimentsResponse {
  items: Experiment[];
  totalCount: number;
}

// List all experiments
export async function listExperiments(): Promise<Experiment[]> {
  const { projectKey, environmentKey } = getApiConfig();
  const data = await apiRequest<ExperimentsResponse>(
    `/projects/${projectKey}/environments/${environmentKey}/experiments`,
  );
  return data.items;
}

// AI Config types (Beta)
export interface AiConfig {
  key: string;
  name: string;
  description?: string;
  tags?: string[];
}

export interface AiConfigsResponse {
  items: AiConfig[];
}

// List all AI configs (Beta API - requires version header)
export async function listAiConfigs(): Promise<AiConfig[]> {
  const { projectKey } = getApiConfig();
  const data = await apiRequest<AiConfigsResponse>(
    `/projects/${projectKey}/ai-configs`,
    {
      headers: {
        "LD-API-Version": "beta",
      },
    },
  );
  return data.items;
}

// Get single AI config
export async function getAiConfig(
  key: string,
): Promise<AiConfig & { versions?: unknown[] }> {
  const { projectKey } = getApiConfig();
  return apiRequest<AiConfig & { versions?: unknown[] }>(
    `/projects/${projectKey}/ai-configs/${key}`,
    {
      headers: {
        "LD-API-Version": "beta",
      },
    },
  );
}

// Get single experiment with results
export async function getExperiment(
  key: string,
): Promise<Experiment & { treatments?: unknown[] }> {
  const { projectKey, environmentKey } = getApiConfig();
  return apiRequest<Experiment & { treatments?: unknown[] }>(
    `/projects/${projectKey}/environments/${environmentKey}/experiments/${key}`,
  );
}

// Get single metric
export async function getMetric(key: string): Promise<Metric> {
  const { projectKey } = getApiConfig();
  return apiRequest<Metric>(`/metrics/${projectKey}/${key}`);
}

// Get single flag with variations
export async function getFlag(key: string): Promise<
  Flag & {
    variations?: Array<{ value: unknown; name?: string; description?: string }>;
  }
> {
  const { projectKey, environmentKey } = getApiConfig();
  return apiRequest<
    Flag & {
      variations?: Array<{
        value: unknown;
        name?: string;
        description?: string;
      }>;
    }
  >(`/flags/${projectKey}/${key}?env=${environmentKey}`);
}
