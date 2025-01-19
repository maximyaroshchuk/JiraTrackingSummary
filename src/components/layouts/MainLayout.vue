<template>
    <HeaderComponent/>
    <div class="flex justify-content-center flex-grow-1">
        <router-view/>
    </div>
    <FooterComponent/>
</template>

<script setup>
import HeaderComponent from "@/components/navigation/HeaderComponent.vue";
import FooterComponent from "@/components/footer/FooterComponent.vue";
</script>