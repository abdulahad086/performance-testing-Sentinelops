import http from "k6/http";
import { group } from "k6";
import { endpoints } from "../../config/config.js";
import { healthStressThresholds } from "../../config/thresholds.js";
import { validateJsonResponse } from "../../utils/checks.js";
import { buildRequestParams, buildUrl } from "../../utils/http.js";
import { createSummaryHandler } from "../../utils/reporting.js";
import { trackRequestMetrics } from "../../utils/metrics.js";

export const options = {
  stages: [
    { duration: "20s", target: 10 },
    { duration: "20s", target: 25 },
    { duration: "20s", target: 50 },
    { duration: "20s", target: 0 },
  ],
  thresholds: healthStressThresholds,
  tags: {
    feature: "health",
    test_type: "stress",
  },
};

export const handleSummary = createSummaryHandler("Health Stress Test");

export default function () {
  group("Health endpoint", () => {
    const res = http.get(
      buildUrl(endpoints.health),
      buildRequestParams({
        tags: {
          endpoint: "health",
          test_type: "stress",
        },
      })
    );

    validateJsonResponse(res, {
      expectedStatus: 200,
      maxDurationMs: 1200,
    });

    trackRequestMetrics(res, {
      endpoint: "health",
      test_type: "stress",
    });
  });
}