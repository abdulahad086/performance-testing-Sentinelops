import http from "k6/http";
import { group } from "k6";
import { endpoints } from "../../config/config.js";
import { deploymentThresholds } from "../../config/thresholds.js";
import { validateCreatedResponse } from "../../utils/checks.js";
import { buildRequestParams, buildUrl } from "../../utils/http.js";
import { createSummaryHandler } from "../../utils/reporting.js";
import { trackRequestMetrics } from "../../utils/metrics.js";
import { createDeploymentPayload } from "../../data/payloads.js";

export const options = {
  vus: Number(__ENV.VUS || 5),
  duration: __ENV.DURATION || "30s",
  thresholds: deploymentThresholds,
  tags: {
    feature: "deployments",
    test_type: "create",
  },
};

export const handleSummary = createSummaryHandler("Deployment Create Test");

export default function () {
  group("Create deployment", () => {
    const payload = JSON.stringify(createDeploymentPayload());

    const res = http.post(
      buildUrl(endpoints.deployments),
      payload,
      buildRequestParams({
        tags: {
          endpoint: "deployments",
          test_type: "create",
        },
      })
    );

    validateCreatedResponse(res, {
      maxDurationMs: 1200,
    });

    trackRequestMetrics(res, {
      endpoint: "deployments",
      test_type: "create",
    });
  });
}