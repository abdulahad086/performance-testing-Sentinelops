import http from "k6/http";
import { group } from "k6";
import { endpoints } from "../../config/config.js";
import { healthSpikeThresholds } from "../../config/thresholds.js";
import { validateJsonResponse } from "../../utils/checks.js";
import { buildRequestParams, buildUrl } from "../../utils/http.js";
import { createSummaryHandler } from "../../utils/reporting.js";
import { trackRequestMetrics } from "../../utils/metrics.js";

export const options = {
  stages: [
    { duration: "10s", target: 5 },
    { duration: "15s", target: 60 },
    { duration: "20s", target: 5 },
    { duration: "10s", target: 0 },
  ],
  thresholds: healthSpikeThresholds,
  tags: {
    feature: "health",
    test_type: "spike",
  },
};

export const handleSummary = createSummaryHandler("Health Spike Test");

export default function () {
  group("Health endpoint", () => {
    const res = http.get(
      buildUrl(endpoints.health),
      buildRequestParams({
        tags: {
          endpoint: "health",
          test_type: "spike",
        },
      })
    );

    validateJsonResponse(res, {
      expectedStatus: 200,
      maxDurationMs: 1500,
    });

    trackRequestMetrics(res, {
      endpoint: "health",
      test_type: "spike",
    });
  });
}