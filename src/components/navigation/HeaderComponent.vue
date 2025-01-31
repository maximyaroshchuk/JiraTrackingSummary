<template>
    <div class="header-wrapper" :class="{ 'menu-open': isMenuOpen }">
        <router-link class="flex align-items-center" to="/">
            <img class="logo" alt="logo" src="/logo-dark.svg">
        </router-link>

        <button class="burger-menu" @click="toggleMenu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>

        <div class="desktop-menu">
            <NavigationMenu mode="horizontal"/>
            <LanguageSelector :selectedLanguage="selectedLanguage" @changeLanguage="onChangeLanguage"/>
        </div>

        <div class="mobile-menu">
            <NavigationMenu :key="mobileMenuKey" @collapse="toggleMenu" mode="inline"/>
            <LanguageSelector :selectedLanguage="selectedLanguage" @changeLanguage="onChangeLanguage"/>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import NavigationMenu from "@/components/navigation/NavigationMenu.vue";
import LanguageSelector from "@/components/navigation/LanguageSelector.vue";
import {setLanguage} from "@/utils/i18n";

const isMenuOpen = ref(false);
const mobileMenuKey = ref(0);
const selectedLanguage = ref(localStorage.getItem('preferredLanguage') || 'en');

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;

    setTimeout(() => {
        mobileMenuKey.value += 1
    }, 150)
};

const onChangeLanguage = (language) => {
    selectedLanguage.value = language;
    setLanguage(language);
};
</script>

