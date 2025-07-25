<template>
    <div class="header-wrapper">
        <div class="logo-wrapper">
            <router-link to="/summary" class="profile-link">
                <img src="/logo.svg" alt="Main logo" />
            </router-link>
        </div>
        <ul class="menu">
            <li v-for="item in items" :key="item.key" class="menu-item">
                <router-link :to="`/${item.key}`" class="menu-link">{{ item.label }}</router-link>
            </li>
        </ul>
        <div class="profile-block">
            <TSAvatar :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&color=FFFFFF&background=random&uppercase=true`" size="smallc">
            </TSAvatar>
            <router-link to="/profile" class="profile-link">
                {{customer.fullname}}
            </router-link>
        </div>
    </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {useUserStore} from '../../store/user.js';
import {jts_event_bus} from "../../utils/event_bus.js";

const userStore = useUserStore();

const customer = ref(userStore.user);

const updateUserData = () => {
    customer.value = userStore.user;
};

onMounted(() => {
    jts_event_bus.$on('update_user_data', updateUserData);
});

onUnmounted(() => {
    jts_event_bus.$off('update_user_data', updateUserData);
});

const items = ref([
    {
        key: 'summary',
        label: 'Summary',
    },
]);

const initials = computed(() => {
    return customer.value.fullname
        .trim()
        .split(/\s+/)
        .map(word => word[0])
        .join('')
        .slice(0, 2);
});
</script>

<style scoped>
.header-wrapper {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 1rem;
    margin-bottom: 30px;
    background: #f0f0f0;
    border-bottom: 1px solid white;
}

.profile-block {
    justify-self: end;
}

.menu {
    list-style: none;
    display: flex;
    justify-self: center;
    gap: 1rem;
    margin: 0;
    padding: 0;
}

.menu-item {
    font-size: 16px;
}

.menu-link {
    font-weight: bolder;
    text-decoration: none;
    color: #020202;
    transition: color 0.3s;
}

.profile-link {
    text-decoration: none;
    transition: color 0.3s;
    font-size: 14px;
    font-weight: 500;
    margin-left: 8px;
    color: #020202;
}

.profile-link:hover {
    text-decoration: none;
    color: #eb5757;
}

.menu-link:hover {
    color: #eb5757;
}

.menu-link.active {
    font-weight: bold;
}

.logo-wrapper {
    justify-self: start;

    a {
        display: flex;
        align-items: center;
    }

    img {
        width: 150px;
    }
}
</style>
