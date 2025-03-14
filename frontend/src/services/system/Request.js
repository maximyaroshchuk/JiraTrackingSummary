import axios from "axios";
import NProgress from 'nprogress';
import Cookies from "js-cookie";
import {logout} from "@/services/auth/AuthService";
import {getRouter} from "@/services/system/RouterService";
import {showError, showInfo, showSuccess} from "@/services/system/ToastService";
import {empty} from "@/utils/functions";
import {ref} from "vue";

const API_URL = import.meta.env.VITE_API_URL;
const loading = ref(true);

const apiClient = axios.create({
    baseURL: API_URL,
});

function getToken() {
    return Cookies.get('user-token')
}

function imminentlyLogout(error) {
    const router = getRouter()
    const token = getToken()

    if (!error.response || error.request.status === 500) {
        logout(router)
        if (!empty(token)) {
            setTimeout(() => {
                showError("Our server is not responding, you have been logged out. Please contact us: support@clockyco.app", false, 60000)
            }, 250)
        }
        return
    }

    if (error.response.status === 401) {
        logout(router)
        setTimeout(() => {
            showInfo(error.response.data.message || error.response.data.error)
        }, 250)
    }
}

apiClient.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const post = (url, data, silent = false, withoutAlert = false) => {
    if (!silent) NProgress.start();
    loading.value = true;
    return new Promise((resolve, reject) => {
        apiClient.post(url, data)
            .then(response => {
                NProgress.done();
                resolve(response);
                console.log(response)
                if (!withoutAlert) {
                    if (response.data.message) {
                        showSuccess(response.data.message)
                    }
                }
                setTimeout(() => {
                    loading.value = false;
                }, 500)
            })
            .catch(error => {
                NProgress.done();
                imminentlyLogout(error)
                reject(error.response || error.response?.data);
            });
    });
};

export const get = (url, silent = false) => {
    if (!silent) NProgress.start();
    loading.value = true;
    return new Promise((resolve, reject) => {
        apiClient.get(url)
            .then(response => {
                NProgress.done();
                resolve(response.data);
                if (response.data.message) {
                    showSuccess(response.data.message)
                }
                setTimeout(() => {
                    loading.value = false;
                }, 500)
            })
            .catch(error => {
                NProgress.done();
                imminentlyLogout(error)
                reject(error.data || error.response?.data);
            });
    });
};

export {loading}