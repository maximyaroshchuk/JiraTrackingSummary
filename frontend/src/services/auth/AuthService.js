import Cookies from "js-cookie";
import {setCurrentCustomerData} from "../UserService.js";
import {get, post} from "../system/Request.js";

export const register = async (email, password, fullname) => {
    try {
        const response = await post('/register', {email, password, fullname});
        return response.data;
    } catch (error) {
        throw error.data;
    }
};

export const login = async (email, password) => {
    try {
        const response = await post('/login', {email, password});
        const {accessToken} = response.data;
        Cookies.set('user-token', accessToken, {expires: 7, path: '/'})
        await get('/customer/get-user-data').then((response) => {
            setCurrentCustomerData(response)
        })
        return response.data;
    } catch (error) {
        throw error.data;
    }
};

export const logout = (router) => {
    Cookies.remove('user-token');
    Cookies.remove('user-data');
    router.push({name: 'auth'});
};

export const isAuthenticated = () => {
    const token = Cookies.get('user-token');
    return !!token;
};