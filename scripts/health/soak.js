import http from "k6/http";
import { group } from "k6";
import { endpoints } from "../../config/config.js";
import { healthSoakThresholds } from "../../config/thresholds.js";
import { getEnvNumber } from "../../utils/env.js";
import { validateJsonResponse } from "../../utils/checks.js";
import { buildRequestParams, buildUrl } from "../../utils/http.js";
import { createSummaryHandler } from "../../utils/reporting.js";
import { trackRequestMetrics } from "../../utils/metrics.js";

export const options = {
  vus: getEnvNumber("SOAK_VUS", 5),
  duration: __ENV.SOAK_DURATION || "5m",
  thresholds: healthSoakThresholds,
  tags: {
    feature: "health",
    test_type: "soak",
  },
};

export const handleSummary = createSummaryHandler("Health Soak Test");

export default function () {
  group("Health endpoint", () => {
    const res = http.get(
      buildUrl(endpoints.health),
      buildRequestParams({
        tags: {
          endpoint: "health",
          test_type: "soak",
        },
      })
    );

    validateJsonResponse(res, {
      expectedStatus: 200,
      maxDurationMs: 1000,
    });

    trackRequestMetrics(res, {
      endpoint: "health",
      test_type: "soak",
    });
  });
}