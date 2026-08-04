import http from "k6/http";
import { group } from "k6";
import { endpoints } from "../../config/config.js";
import { healthRampUpThresholds } from "../../config/thresholds.js";
import { validateJsonResponse } from "../../utils/checks.js";
import { buildRequestParams, buildUrl } from "../../utils/http.js";
import { createSummaryHandler } from "../../utils/reporting.js";
import { trackRequestMetrics } from "../../utils/metrics.js";

export const options = {
    stages: [
        { duration: "20s", target: 10 },
        { duration: "20s", target: 20 },
        { duration: "20s", target: 40 },
        { duration: "20s", target: 0 },
    ],
    thresholds: healthRampUpThresholds,
    tags: {
        feature: "health",
        test_type: "ramp-up",
    },
};

export const handleSummary = createSummaryHandler("Health Ramp-up Test");

export default function () {
    group("Health endpoint", () => {
        const res = http.get(
            buildUrl(endpoints.health),
            buildRequestParams({
                tags: {
                    endpoint: "health",
                    test_type: "ramp-up",
                },
            })
        );

        validateJsonResponse(res, {
            expectedStatus: 200,
            maxDurationMs: 1000,
        });

        trackRequestMetrics(res, {
            endpoint: "health",
            test_type: "ramp-up",
        });
    });
}