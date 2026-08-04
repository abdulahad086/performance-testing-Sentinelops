import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '30s', target: 25 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const res = http.get(
    'https://abdul-ahad-shiptrack.onrender.com/health'
  );

  check(res, {
    'Status is 200': (r) => r.status === 200,
  });
}