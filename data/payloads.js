import { getEnv, requireEnv } from "../utils/env.js";

function createUniqueName(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createApplicationPayload(overrides = {}) {
  return {
    name: createUniqueName(getEnv("APPLICATION_NAME_PREFIX", "application")),
    repo_url: getEnv("REPO_URL", "https://github.com/test/repo"),
    ...overrides,
  };
}

export function createDeploymentPayload(overrides = {}) {
  return {
    application_id: requireEnv("APPLICATION_ID"),
    environment: getEnv("DEPLOYMENT_ENV", "production"),
    version: getEnv("DEPLOYMENT_VERSION", `v-${new Date().toISOString().slice(0, 10)}`),
    branch: getEnv("DEPLOYMENT_BRANCH", "main"),
    commit_sha: getEnv("COMMIT_SHA", "local"),
    ...overrides,
  };
}