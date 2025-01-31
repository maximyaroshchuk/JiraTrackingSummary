<template>
    <div class="converter-wrapper">
        <FileConverter
            :from="inputFormat"
            :to="outputFormat"
            :key="componentKey"
        />
    </div>
</template>

<script setup>
import {ref, watch, computed} from 'vue';
import {useRoute} from 'vue-router';
import FileConverter from "@/components/FileConverter.vue";

const route = useRoute();

const conversionParams = computed(() => {
    const [from, to] = route.params.conversion?.split('-to-') || [];
    return {from, to};
});

const inputFormat = ref(conversionParams.value.from || '');
const outputFormat = ref(conversionParams.value.to || '');
const componentKey = ref(Date.now());

watch(
    () => route.params.conversion,
    (newConversion) => {
        const [from, to] = newConversion?.split('-to-') || [];
        inputFormat.value = from || '';
        outputFormat.value = to || '';
        componentKey.value = Date.now();
    },
    {immediate: true}
);
</script>