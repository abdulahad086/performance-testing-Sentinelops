const baseThresholds = {
  http_req_failed: ["rate<0.01"],
  http_req_duration: ["p(95)<800"],
  checks: ["rate>0.99"],
};

export const thresholds = baseThresholds;

export const healthLoadThresholds = {
  ...baseThresholds,
  http_req_duration: ["p(95)<500"],
  api_response_time: ["p(95)<500"],
};

export const healthStressThresholds = {
  ...baseThresholds,
  http_req_failed: ["rate<0.05"],
  http_req_duration: ["p(95)<1200"],
  api_response_time: ["p(95)<1200"],
  checks: ["rate>0.95"],
};

export const healthSpikeThresholds = {
  ...baseThresholds,
  http_req_failed: ["rate<0.08"],
  http_req_duration: ["p(95)<1500"],
  api_response_time: ["p(95)<1500"],
  checks: ["rate>0.95"],
};

export const healthSoakThresholds = {
  ...baseThresholds,
  http_req_duration: ["p(95)<1000"],
  api_response_time: ["p(95)<1000"],
  checks: ["rate>0.98"],
};

export const healthRampUpThresholds = {
  ...baseThresholds,
  http_req_duration: ["p(95)<900"],
  api_response_time: ["p(95)<900"],
};

export const applicationThresholds = {
  ...baseThresholds,
  http_req_duration: ["p(95)<1000"],
  api_response_time: ["p(95)<1000"],
};

export const deploymentThresholds = {
  ...baseThresholds,
  http_req_duration: ["p(95)<1200"],
  api_response_time: ["p(95)<1200"],
};