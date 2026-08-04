import { getEnv } from "../utils/env.js";

export const config = {
  baseUrl: getEnv("BASE_URL", "https://abdul-ahad-shiptrack.onrender.com"),
  apiKey: getEnv("API_KEY"),
  defaultHeaders: {
    "Content-Type": "application/json",
  },
};

export const endpoints = {
  health: "/health",
  applications: "/applications",
  deployments: "/deployments",
};