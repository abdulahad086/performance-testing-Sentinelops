import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

const BASE_URL = 'https://abdul-ahad-shiptrack.onrender.com';
const API_KEY = 'local-dev-key';

export default function () {

  const payload = JSON.stringify({
    name: `app-${Date.now()}-${Math.random()}`,
    repo_url: 'https://github.com/test/repo'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
  };

  const res = http.post(
    `${BASE_URL}/applications`,
    payload,
    params
  );

  check(res, {
    'Status is 201': (r) => r.status === 201,
    'Response < 1000ms': (r) => r.timings.duration < 1000,
  });
}