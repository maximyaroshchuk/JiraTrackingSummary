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
import {ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import FileConverter from "@/components/FileConverter.vue";

const route = useRoute();

const inputFormat = ref(route.query.from || '');
const outputFormat = ref(route.query.to || '');
const componentKey = ref(Date.now());

watch(
    () => route.query,
    (newQuery) => {
        inputFormat.value = newQuery.from || '';
        outputFormat.value = newQuery.to || '';
        componentKey.value = Date.now();
    },
    {immediate: true}
);
</script>