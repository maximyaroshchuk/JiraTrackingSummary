<template>
    <Menu class="w-100" v-model:selectedKeys="current" mode="horizontal" :items="items"/>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();

const formats = {
    Images: ['JPEG', 'JPG', 'PNG', 'GIF', 'TIFF', 'TIF', 'HEIC', 'HEIF', 'SVG'],
};

const conversionRules = {
    jpeg: ['png', 'webp', 'gif', 'tiff'],
    jpg: ['png', 'webp', 'gif', 'tiff'],
    png: ['jpeg', 'webp', 'gif', 'tiff'],
    // webp: ['jpeg', 'png', 'gif', 'tiff'],
    gif: ['jpeg', 'png', 'webp', 'tiff'],
    tiff: ['jpeg', 'png', 'webp', 'gif'],
    tif: ['jpeg', 'png', 'webp', 'gif'],

    heic: ['jpeg', 'png', 'webp', 'gif', 'tiff'],
    heif: ['jpeg', 'png', 'webp', 'gif', 'tiff'],

    // jxl: ['jpeg', 'png', 'webp', 'gif', 'tiff'],

    svg: ['png', 'webp', 'gif', 'tiff'],
};

const current = ref([]);

const items = ref(
    Object.entries(formats).map(([group, formatsList]) => ({
        key: group.toLowerCase(),
        label: group,
        children: formatsList.map((fromFormat) => ({
            key: `${group.toLowerCase()}-${fromFormat.toLowerCase()}`,
            label: fromFormat,
            children: formatsList
                .filter((toFormat) => {
                    const from = fromFormat.toLowerCase();
                    const to = toFormat.toLowerCase();
                    return conversionRules[from] && conversionRules[from].includes(to);
                })
                .map((toFormat) => ({
                    key: `${fromFormat.toLowerCase()}-to-${toFormat.toLowerCase()}`,
                    label: `${fromFormat} to ${toFormat}`,
                    onClick: () => {
                        router.push({
                            path: '/converter',
                            query: {
                                from: fromFormat.toLowerCase(),
                                to: toFormat.toLowerCase(),
                            },
                        });
                    },
                })),
        })),
    })),
);
</script>