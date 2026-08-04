import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',
};

export default function () {
  const res = http.get('https://abdul-ahad-shiptrack.onrender.com/health');

  check(res, {
    'Status is 200': (r) => r.status === 200,
    'Response time < 1000ms': (r) => r.timings.duration < 1000,
    'Content-Type is JSON': (r) =>
      r.headers['Content-Type'].includes('application/json'),
  });
}