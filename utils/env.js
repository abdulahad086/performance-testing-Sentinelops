export function getEnv(name, fallback = "") {
  const value = __ENV[name];
  return value === undefined || value === "" ? fallback : value;
}

export function requireEnv(name) {
  const value = __ENV[name];

  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getEnvNumber(name, fallback) {
  const rawValue = __ENV[name];

  if (rawValue === undefined || rawValue === "") {
    return fallback;
  }

  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}