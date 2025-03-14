<template>
    <ConfigProvider
        :theme="{
          token: {
            colorPrimary: '#f59e0b',
          },
        }"
    >
        <router-view />
    </ConfigProvider>
</template>
