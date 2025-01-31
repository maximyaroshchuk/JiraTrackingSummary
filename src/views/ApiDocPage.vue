<template>
    <div class="api-docs-placeholder">
        <h1>{{ $t('api_doc.title') }}</h1>
        <p>{{ $t('api_doc.content') }}</p>
        <div class="construction-icon">
            <i class="pi pi-cog" style="font-size: 4rem; color: #1DA079;"></i>
        </div>
        <p v-html="translatedContactUs"></p>
    </div>
</template>

<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

const translatedContactUs = computed(() =>
    t('api_doc.contact_us', {
        link: `<a href="/contact" class="api-link">${t('api_doc.contact_us_link')}</a>`,
    })
);
</script>

<style scoped>
.api-docs-placeholder {
    text-align: center;
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #1DA079; /* Цвет бренда */
}

p {
    font-size: 1rem;
    color: #666;
    line-height: 1.5;
    margin-bottom: 1.5rem;
}

.construction-icon {
    margin: 2rem 0;
    animation: spin 4s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>