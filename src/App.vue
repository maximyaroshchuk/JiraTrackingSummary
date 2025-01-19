<template>
    <ConfigProvider
        :theme="{
          token: {
            colorPrimary: '#1DA079',
          },
        }"
    >
        <MainLayout/>
    </ConfigProvider>
</template>

<script setup>
import MainLayout from "@/components/layouts/MainLayout.vue";
</script>