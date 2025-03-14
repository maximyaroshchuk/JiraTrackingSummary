import {defineStore} from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {},
        userView: {},
    }),
    getters: {
        getUserData: (state) => state.user,
        getUserViewData: (state) => state.userView,
        getUserList: (state) => state.usersList,
    },
    actions: {
        setUserData(data) {
            this.user = data;
        },
        setUserViewData(data) {
            this.userView = data;
        },
        setUsersList(data) {
            this.usersList = data;
        },
        setUserAvatar(data) {
            this.user.avatar = data;
        }
    },
    persist: true,
});