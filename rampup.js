import http from 'k6/http';
import { check } from 'k6';

export const options = {

    stages: [

        { duration: '20s', target: 10 },

        { duration: '20s', target: 20 },

        { duration: '20s', target: 40 },

        { duration: '20s', target: 0 }

    ]
};

export default function () {

    const res = http.get(
        'https://abdul-ahad-shiptrack.onrender.com/health'
    );

    check(res, {

        'Status 200': (r) => r.status === 200,

    });

}