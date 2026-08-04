import http from "k6/http";
import { group } from "k6";
import { endpoints } from "../../config/config.js";
import { healthLoadThresholds } from "../../config/thresholds.js";
import { validateJsonResponse } from "../../utils/checks.js";
import { buildRequestParams, buildUrl } from "../../utils/http.js";
import { createSummaryHandler } from "../../utils/reporting.js";
import { trackRequestMetrics } from "../../utils/metrics.js";

export const options = {
  vus: Number(__ENV.VUS || 10),
  duration: __ENV.DURATION || "30s",
  thresholds: healthLoadThresholds,
  tags: {
    feature: "health",
    test_type: "load",
  },
};

export const handleSummary = createSummaryHandler("Health Load Test");

export default function () {
  group("Health endpoint", () => {
    const res = http.get(
      buildUrl(endpoints.health),
      buildRequestParams({
        tags: {
          endpoint: "health",
          test_type: "load",
        },
      })
    );

    validateJsonResponse(res, {
      expectedStatus: 200,
      maxDurationMs: 1000,
    });

    trackRequestMetrics(res, {
      endpoint: "health",
      test_type: "load",
    });
  });
}