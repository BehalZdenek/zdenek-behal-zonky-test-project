import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const responseBody = res => res.body;

let API_ROOT = '';
if (process.env.NODE_ENV === 'production') {
    API_ROOT = 'https://api.zonky.cz/';
} else {
    // we are using proxy in package.json due to same origin policy
    API_ROOT = '';
}

const handleErrors = err => {
    if (err && err.response && err.response.status === 401) {
    }
    return err;
};

const requests = {
    del: (url, body) =>
        superagent
            .del(`${API_ROOT}${url}`)
            //.use(tokenPlugin)
            .send(`${body}`)
            .end(handleErrors)
            .then(responseBody),
    get: url =>
        superagent
            .get(`${API_ROOT}${url}`)
            //.use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    put: (url, body) =>
        superagent
            .put(`${API_ROOT}${url}`)
            //.use(tokenPlugin)
            .send(`${body}`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .then(responseBody),
    post: (url, body) =>
        superagent
            .post(`${API_ROOT}${url}`)
            .type('form')
            //.use(tokenPlugin)
            .send(`${body}`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .then(responseBody),
    postJSON: (url, body) =>
        superagent
            .post(`${API_ROOT}${url}`)
            .type('form')
            //.use(tokenPlugin)
            .send(`${body}`)
            .set('Content-Type', 'application/json')
            .then(responseBody),
    post_upload: (url, file) =>
        superagent
            .post(`${API_ROOT}${url}`)
            //.use(tokenPlugin)
            .attach('files[]', file)
            .end(handleErrors)
            .then(responseBody),
    postImage: (url, body) =>
        superagent
            .post(`${API_ROOT}${url}`)
            .type('form')
            //.use(tokenPlugin)
            .send(`${body}`)
            .set('Content-Type', 'multipart/form-data')
            .then(responseBody)
};

const LOAN = 'loans';
const Loan = {
    getLoans: () => requests.get(`${LOAN}/marketplace`)
};

export default {
    Loan
};
