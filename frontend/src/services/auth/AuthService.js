import Cookies from "js-cookie";
import {post, get} from "@/services/system/Request";
import {setCurrentCustomerAvatar, setCurrentCustomerData} from "@/services/CustomerService";
import {closeSidebar} from "@/services/system/SidebarService";
import {useCompanyStore} from "@/store/company";

export const register = async (email, password, fullname, company) => {
    try {
        const response = await post('/register', {email, password, fullname, company});
        return response.data;
    } catch (error) {
        throw error.data;
    }
};

export const login = async (email, password) => {
    try {
        const response = await post('/login', {email, password});
        const {accessToken, user, company} = response.data;
        Cookies.set('user-token', accessToken, {expires: 1, path: '/'})

        const companyStore = useCompanyStore();
        companyStore.setCompanyData(company);
        await get('/customer/get-user-data').then((response) => {
            setCurrentCustomerData(response)
        })
        closeSidebar()
        return response.data;
    } catch (error) {
        throw error.data;
    }
};

export const confirmRegistration = async (email, token) => {
    try {
        const response = await post(`/confirm-registration?mail=${email}&token=${token}`, {});
        return response.data;
    } catch (error) {
        throw error.data;
    }
};

export const requestResetPassword = async (email) => {
    try {
        const response = await post('/request-password-reset', {email});
        return response.data;
    } catch (error) {
        throw error.data;
    }
};

export const resetPassword = async (email, token) => {
    try {
        const response = await post('/password-reset', {email, token});
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