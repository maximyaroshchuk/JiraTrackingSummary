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
import {onMounted, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useHead} from "@vueuse/head";
import i18n from "@/utils/i18n";

const {t, locale} = useI18n()

onMounted(() => {
    updateMetaTags()
})

const updateMetaTags = () => {
    useHead({
        htmlAttrs: {
            lang: locale.value
        },
        title: t('meta.title'),
        meta: [
            {
                name: 'description',
                content: t('meta.description')
            },
            {
                name: 'keywords',
                content: t('meta.keywords')
            },
            {
                property: 'og:title',
                content: t('meta.ogTitle')
            },
            {
                property: 'og:description',
                content: t('meta.ogDescription')
            },
            {
                property: 'og:locale',
                content: locale.value.replace('-', '_')
            },
            {
                name: 'language',
                content: locale.value
            }
        ]
    })

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': t('meta.schemaName'),
        'description': t('meta.schemaDescription'),
        'applicationCategory': 'MultimediaApplication',
        'inLanguage': locale.value,
        'availableLanguage': ['en', 'uk', 'zh', 'ja', 'pt', 'es', 'de', 'ru', 'pl'],
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
        }
    }

    document.querySelector('script[type="application/ld+json"]').textContent = JSON.stringify(schema)
}

watch(
    () => i18n.global.locale,
    () => {
        updateMetaTags()
    }
)

watch(locale, () => {
    updateMetaTags()
}, {immediate: true})
</script>