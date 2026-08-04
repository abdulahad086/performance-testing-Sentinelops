import { check } from "k6";

function getHeader(res, headerName) {
  return res.headers?.[headerName] ?? res.headers?.[headerName.toLowerCase()] ?? "";
}

export function validateResponse(
  res,
  {
    expectedStatus = 200,
    maxDurationMs = 1000,
    expectedContentType,
    requireBody = true,
  } = {}
) {
  const checks = {
    [`status is ${expectedStatus}`]: (response) => response.status === expectedStatus,
    [`response time <= ${maxDurationMs}ms`]: (response) => response.timings.duration <= maxDurationMs,
  };

  if (expectedContentType) {
    checks[`content type includes ${expectedContentType}`] = (response) =>
      getHeader(response, "Content-Type").includes(expectedContentType);
  }

  if (requireBody) {
    checks["response body is not empty"] = (response) => Boolean(response.body && response.body.length > 0);
  }

  return check(res, checks);
}

export function validateJsonResponse(res, options = {}) {
  return validateResponse(res, {
    expectedContentType: "application/json",
    ...options,
  });
}

export function validateCreatedResponse(res, options = {}) {
  return validateJsonResponse(res, {
    expectedStatus: 201,
    ...options,
  });
}