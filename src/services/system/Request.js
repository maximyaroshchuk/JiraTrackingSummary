import axios from "axios";
import NProgress from 'nprogress';

const API_URL = 'lightconvert-e1hmuxd8v-rainolds-projects.vercel.app';

const apiClient = axios.create({
    baseURL: API_URL,
});

apiClient.interceptors.request.use(config => {
    return config;
}, error => {
    return Promise.reject(error);
});

export const post = (url, data, silent = false) => {
    if (!silent) NProgress.start();
    return new Promise((resolve, reject) => {
        apiClient.post(url, data)
            .then(response => {
                NProgress.done();
                resolve(response);
                console.log(response);
            })
            .catch(error => {
                NProgress.done();
                reject(error.response || error.response?.data);
            });
    });
};

export const get = (url, silent = true) => {
    if (!silent) NProgress.start();
    return new Promise((resolve, reject) => {
        apiClient.get(url)
            .then(response => {
                NProgress.done();
                resolve(response.data);
                console.log(response);
            })
            .catch(error => {
                NProgress.done();
                reject(error.data || error.response?.data);
            });
    });
};
