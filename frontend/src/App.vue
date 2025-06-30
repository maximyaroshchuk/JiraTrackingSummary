<template>
    <ConfigProvider
        :theme="{
          token: {
            colorPrimary: '#eb5757',
          },
        }"
    >
        <router-view />
    </ConfigProvider>
</template>
