<template>
    <ConfigProvider
        :theme="{
          token: {
            colorPrimary: '#496FE0',
          },
        }"
    >
        <router-view />
    </ConfigProvider>
</template>
