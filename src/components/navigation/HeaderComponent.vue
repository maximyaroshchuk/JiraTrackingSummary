<template>
    <div class="header-wrapper">
        <router-link class="flex align-items-center" to="/">
            <img class="logo" alt="logo" src="/logo-dark.svg">
        </router-link>
        <NavigationMenu/>
    </div>
</template>

<script setup>

import NavigationMenu from "@/components/navigation/NavigationMenu.vue";
</script>

