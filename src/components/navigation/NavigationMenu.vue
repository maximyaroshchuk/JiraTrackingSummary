<template>
    <Menu
        class="w-100 flex-grow-1"
        v-model:selectedKeys="current"
        :mode="props.mode"
        :items="items"
        @select="handleMenuClick"
    />
</template>

<script setup>
import {defineProps, defineEmits, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';

const router = useRouter();
const {t, locale} = useI18n();
const emit = defineEmits(['collapse']);
const props = defineProps({mode: {type: String, required: true}});

const formats = {
    Images: ['JPEG', 'JPG', 'PNG', 'GIF', 'TIFF', 'TIF', 'HEIC', 'HEIF', 'SVG'],
    Video: ['MP4', 'AVI', 'MOV', 'WMV', 'FLV', 'MKV', 'WEBM', 'GIF', '3GP', 'MPEG']
};

const conversionRules = {
    Images: {
        jpeg: ['png', 'webp', 'gif', 'tiff'],
        jpg: ['png', 'webp', 'gif', 'tiff'],
        png: ['jpeg', 'webp', 'gif', 'tiff'],
        gif: ['jpeg', 'png', 'webp', 'tiff', 'mp4', 'webm'],
        tiff: ['jpeg', 'png', 'webp', 'gif'],
        heic: ['jpeg', 'png', 'webp', 'gif', 'tiff'],
        svg: ['png', 'webp', 'gif', 'tiff']
    },
    Video: {
        mp4: ['avi', 'mov', 'gif', 'webm', 'mkv', 'flv', '3gp', 'mpeg'],
        avi: ['mp4', 'mov', 'webm', 'flv'],
        mov: ['mp4', 'avi', 'webm', 'mkv', 'gif'],
        wmv: ['mp4', 'avi', 'mov'],
        flv: ['mp4', 'avi', 'mov', 'webm'],
        mkv: ['mp4', 'mov', 'webm'],
        webm: ['mp4', 'avi', 'mov', 'gif'],
        gif: ['mp4', 'webm'],
        '3gp': ['mp4', 'avi'],
        mpeg: ['mp4', 'avi', 'mov']
    }
};

const generateConversionItems = (category, formatsList, rules) => {
    return {
        key: category.toLowerCase(),
        label: t(`menu.${category.toLowerCase()}`),
        children: formatsList.map((fromFormat) => ({
            key: `${category.toLowerCase()}-${fromFormat.toLowerCase()}`,
            label: fromFormat,
            children: formatsList
                .filter((toFormat) => rules[fromFormat.toLowerCase()]?.includes(toFormat.toLowerCase()))
                .map((toFormat) => ({
                    key: `${fromFormat.toLowerCase()}-to-${toFormat.toLowerCase()}`,
                    label: t('menu.convertTo', {from: fromFormat, to: toFormat}),
                    onClick: () => {
                        router.push({
                            path: `/converter/${fromFormat.toLowerCase()}-to-${toFormat.toLowerCase()}`,
                        });
                    }
                }))
        }))
    };
};

const current = ref([]);
const items = ref([]);

const generateItems = () => {
    items.value = [
        {
            key: 'converters',
            label: t('menu.convert'),
            children: [
                generateConversionItems('Images', formats.Images, conversionRules.Images),
                generateConversionItems('Videos', formats.Video, conversionRules.Video)
            ]
        },
        // {
        //     key: 'downloaders',
        //     label: t('menu.download'),
        //     children: []
        // }
    ];
};

generateItems();

watch(() => locale.value, generateItems);

const handleMenuClick = () => {
    if (props.mode === 'inline') {
        current.value = [];
        emit('collapse', true);
    } else {
        current.value = null;
    }
};
</script>
