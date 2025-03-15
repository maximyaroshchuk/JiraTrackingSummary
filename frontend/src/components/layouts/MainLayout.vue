<template>
    <HeaderComponent/>
    <div class="content-wrapper mx-3 flex align-items-start justify-content-center flex-grow-1">
        <router-view/>
    </div>
</template>

<script setup>
import HeaderComponent from "../navigation/HeaderComponent.vue";
</script>