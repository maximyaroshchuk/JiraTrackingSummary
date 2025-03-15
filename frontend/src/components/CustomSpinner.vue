<template>
    <Spinner :indicator="indicator" />
</template>
<script setup>
import { LoadingOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

const indicator = h(LoadingOutlined, {
    style: {
        fontSize: '72px',
        color: '#496FE0'
    },
    spin: true,
});
</script>