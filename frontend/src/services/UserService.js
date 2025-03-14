import Cookies from "js-cookie";
import {useUserStore} from '@/store/user';
import {logout} from "@/services/auth/AuthService";
import {useRouter} from "vue-router";

const router = useRouter()

const getParsedCustomerData = async () => {
    let data = Cookies.get('user-data');
    if (data === 'undefined' || data == null) {
        await logout(router);
    }
    return JSON.parse(data)
};

export const setCurrentCustomerData = async (customerData) => {
    // const customerData = await getParsedCustomerData().then((result) => {
    //     return result
    // })
    const userStore = useUserStore();
    userStore.setUserData(customerData);
};

export const setCurrentCustomerAvatar = async (avatar) => {
    const userStore = useUserStore();
    userStore.setUserDataByField(avatar);
};
