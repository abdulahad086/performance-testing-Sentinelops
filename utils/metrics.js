import { Counter, Gauge, Rate, Trend } from "k6/metrics";

export const apiResponseTime = new Trend("api_response_time");
export const successfulRequests = new Counter("successful_requests");
export const failedRequests = new Counter("failed_requests");
export const successRate = new Rate("success_rate");
export const activeUsers = new Gauge("active_users");

function isSuccessfulResponse(res) {
	return res.status >= 200 && res.status < 400;
}

export function trackRequestMetrics(res, tags = {}) {
	const successful = isSuccessfulResponse(res);

	apiResponseTime.add(res.timings.duration, tags);
	successfulRequests.add(successful ? 1 : 0, tags);
	failedRequests.add(successful ? 0 : 1, tags);
	successRate.add(successful, tags);
	activeUsers.add(__VU, tags);
}