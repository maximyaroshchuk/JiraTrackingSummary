<template>
    <div class="language-switcher">
        <Select
            :value="props.selectedLanguage"
            @change="changeLanguage"
            class="language-select"
            :options="languageOptions"
            placeholder="Select language"
        />
    </div>
</template>

<script setup>
import {defineProps, defineEmits, computed} from 'vue';

const props = defineProps({
    selectedLanguage: String
});

const languageOptions = computed(() => {
    return [
        {value: 'en', label: "🇬🇧 English"},
        {value: 'uk', label: "🇺🇦 Українська"},
        {value: 'pl', label: "🇵🇱 Polski"},
        {value: 'zh', label: "🇨🇳 中文"},
        {value: 'ja', label: "🇯🇵 日本語"},
        {value: 'pt', label: "🇧🇷 Português"},
        {value: 'es', label: "🇪🇸 Español"},
        {value: 'de', label: "🇩🇪 Deutsch"},
        {value: 'ru', label: props.selectedLanguage === 'ru' ? "🇷🇺 Русский" : "💩 Русский"},
    ];
});

const emit = defineEmits(['changeLanguage']);

const changeLanguage = (language) => {
    emit('changeLanguage', language);
};
</script>
