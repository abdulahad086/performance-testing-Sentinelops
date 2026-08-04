# k6 Performance Testing Framework

This project is a small but practical performance testing setup built with k6.
It is meant to help you test how an API behaves when users send requests in
different traffic patterns, such as normal load, stress, or a sudden spike.

The repo is organized so that the reusable parts live in one place and each test
script stays easy to read.

## What This Project Does

This framework can test:

- Health checks, to confirm the service is alive
- Application creation, to verify a real POST request works
- Deployment creation, to verify deployment-related API calls

Each script also produces a report so you can see how fast the service was, how
many requests failed, and whether the checks passed.

## Why This Structure Helps

If you are new to performance testing, the main idea is simple: do not repeat the
same code in many files. Put common things like the base URL, payload builders,
checks, and metrics in shared files, then keep each test script focused on one
job.

That is what this repo does.

## Folder Structure

```text
config/
  config.js        # Shared base URL, API key, and route names
  thresholds.js    # Shared pass/fail performance rules
data/
  payloads.js      # Reusable request payload builders
reports/
  report.html      # HTML report generated after a run
  result.json      # JSON output generated after a run
scripts/
  applications/
    create.js      # Create application test
  deployments/
    create.js      # Create deployment test
  health/
    load.js        # Load test
    rampup.js      # Ramp-up test
    soak.js        # Soak test
    spike.js       # Spike test
    stress.js      # Stress test
utils/
  checks.js        # Reusable response checks
  check.js         # Backward-compatible export for checks
  env.js           # Small helper for reading env vars
  http.js          # Helpers for URLs and request headers
  metrics.js       # Custom k6 metrics
  reporting.js     # HTML and JSON summary output
```

## What You Need

Install these before running the tests:

- k6
- A terminal
- The API or service you want to test

No extra npm packages are required.

## Important Environment Variables

Some values can be changed without editing the code. These are the main ones:

- `BASE_URL` - The server you want to test
- `API_KEY` - Optional API key if the service needs one
- `REPO_URL` - Used by the application create payload
- `APPLICATION_ID` - Used by the deployment payload
- `APPLICATION_NAME_PREFIX` - Prefix for generated application names
- `DEPLOYMENT_ENV` - Deployment environment name
- `DEPLOYMENT_VERSION` - Deployment version label
- `DEPLOYMENT_BRANCH` - Branch name for deployment payloads
- `COMMIT_SHA` - Commit hash for deployment payloads
- `VUS` - Virtual users for some tests
- `DURATION` - Test duration for some tests
- `SOAK_VUS` - Virtual users for the soak test
- `SOAK_DURATION` - Duration for the soak test

If you do not set `BASE_URL`, the repo uses this default:

```text
https://abdul-ahad-shiptrack.onrender.com
```

If you do not set `REPO_URL`, the application payload uses a safe sample value.

## How To Run

Run a test with k6 like this:

```bash
k6 run scripts/health/load.js
```

For the application create test:

```bash
k6 run scripts/applications/create.js
```

For the deployment create test:

```bash
k6 run scripts/deployments/create.js
```

You can also use the npm script shortcuts:

```bash
npm run health:load
npm run health:stress
npm run health:spike
npm run health:soak
npm run health:rampup
npm run applications:create
npm run deployments:create
```

## How To Read The Results

After a run, you get two report files:

- `reports/report.html` - Easy-to-open HTML report
- `reports/result.json` - Raw JSON data for automation or later analysis

If you used the k6 web dashboard export, you may also get:

- `report.html`

To open the built-in HTML report, use:

```bash
open reports/report.html
```

To open the dashboard export, use:

```bash
open report.html
```

## What The Test Types Mean

- Load Test - Checks normal traffic conditions
- Stress Test - Pushes the service until it starts to struggle
- Spike Test - Sends a sudden jump in traffic
- Soak Test - Runs for a long time to look for memory or stability issues
- Ramp-up Test - Slowly increases traffic to see how the service scales

## What The Scripts Measure

The scripts use a few common k6 ideas:

- `checks` to verify the response is correct
- `thresholds` to decide if performance is acceptable
- custom metrics to track extra values
- `groups` and `tags` to keep the results organized

## Example Run

If you want to run the application test with the built-in defaults, just use:

```bash
k6 run scripts/applications/create.js
```

If you want to override the target server, do this:

```bash
BASE_URL="https://your-service.example.com" \
k6 run scripts/applications/create.js
```

## Common Problems

- If the test says a URL is missing, check `BASE_URL`
- If the application payload fails, check `REPO_URL`
- If the deployment payload fails, check `APPLICATION_ID`
- If the report file does not open, confirm the run finished successfully

## Future Improvements

- Add more endpoint coverage
- Add schema validation for JSON responses
- Add CI automation for pull requests
- Add baseline comparison between releases
- Add environment-specific thresholds for staging and production

## Short Version

If you are completely new, remember just this:

1. Install k6.
2. Run one of the scripts in `scripts/`.
3. Open `reports/report.html`.

That is enough to get started.
