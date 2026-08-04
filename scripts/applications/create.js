import http from "k6/http";
import { group } from "k6";
import { endpoints } from "../../config/config.js";
import { applicationThresholds } from "../../config/thresholds.js";
import { validateCreatedResponse } from "../../utils/checks.js";
import { buildRequestParams, buildUrl } from "../../utils/http.js";
import { createSummaryHandler } from "../../utils/reporting.js";
import { trackRequestMetrics } from "../../utils/metrics.js";
import { createApplicationPayload } from "../../data/payloads.js";

export const options = {
  vus: Number(__ENV.VUS || 10),
  duration: __ENV.DURATION || "30s",
  thresholds: applicationThresholds,
  tags: {
    feature: "applications",
    test_type: "create",
  },
};

export const handleSummary = createSummaryHandler("Application Create Test");

export default function () {
  group("Create application", () => {
    const payload = JSON.stringify(createApplicationPayload());

    const res = http.post(
      buildUrl(endpoints.applications),
      payload,
      buildRequestParams({
        tags: {
          endpoint: "applications",
          test_type: "create",
        },
      })
    );

    validateCreatedResponse(res, {
      maxDurationMs: 1000,
    });

    trackRequestMetrics(res, {
      endpoint: "applications",
      test_type: "create",
    });
  });
}