<script setup>

import JiraTrackingSummary from "./components/JiraTrackingSummary.vue";
</script>

<template>
    <ConfigProvider
        :theme="{
          token: {
            colorPrimary: '#13c2c2',
          },
        }"
    >
    <JiraTrackingSummary/>
    </ConfigProvider>
</template>
