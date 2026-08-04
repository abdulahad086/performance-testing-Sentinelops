import { config } from "../config/config.js";

export function buildUrl(path, baseUrl = config.baseUrl) {
  if (!baseUrl) {
    throw new Error("BASE_URL is required before running a k6 script.");
  }

  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

export function buildHeaders(extraHeaders = {}) {
  return {
    ...config.defaultHeaders,
    ...(config.apiKey ? { "X-API-Key": config.apiKey } : {}),
    ...extraHeaders,
  };
}

export function buildRequestParams({ headers = {}, tags = {} } = {}) {
  return {
    headers: buildHeaders(headers),
    tags,
  };
}