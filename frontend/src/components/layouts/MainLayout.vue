<template>
    <HeaderComponent/>
    <div class="content-wrapper flex align-items-start justify-content-center flex-grow-1">
        <router-view/>
    </div>
</template>

<script setup>
import HeaderComponent from "../navigation/HeaderComponent.vue";
</script>

<style scoped>
.content-wrapper {
    width: 100%;
    height: calc(100vh - 90px);
}
</style>