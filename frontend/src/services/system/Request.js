import axios from "axios";
import Cookies from "js-cookie";
import {showToaster} from "../messagesService.js";
import {empty} from "../../utils/functions.js";
import {logout} from "../auth/AuthService.js";
import {getRouter} from "./RouterService.js";

const API_URL = import.meta.env.VITE_API_URL;

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
                showToaster('error',"Something went wrong. Please re-login.")
            }, 250)
        }
        return
    }

    if (error.response.status === 401) {
        logout(router)
        setTimeout(() => {
            showToaster('info', error.response.data.message || error.response.data.error)
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

export const post = (url, data, withoutAlert = false) => {
    return new Promise((resolve, reject) => {
        apiClient.post(url, data)
            .then(response => {
                resolve(response);
                if (!withoutAlert) {
                    if (response.data.message) {
                        showToaster('success', response.data.message)
                    }
                }
            })
            .catch(error => {
                imminentlyLogout(error)
                reject(error.response || error.response?.data);
            });
    });
};

export const get = (url) => {
    return new Promise((resolve, reject) => {
        apiClient.get(url)
            .then(response => {
                resolve(response.data);
                if (response.data.message) {
                    showToaster('success', response.data.message);
                }
            })
            .catch(error => {
                imminentlyLogout(error)
                reject(error.data || error.response?.data);
            });
    });
};