<template>
    <div
        class="surface-ground flex flex-column align-items-center justify-content-center min-h-screen w-full overflow-hidden select-none">
        <img src="@/../public/not-found.svg" class="h-12rem mb-6 pointer-events-none" alt="Clocky confused"/>
        <div class="w-6 sm:w-12 z-1 flex flex-column align-items-center">
            <h1 class="text-900 font-bold text-center text-5xl mb-2">{{ $t('notFoundPage.title') }}</h1>
            <span class="text-900 text-center lg:text-xl font-medium mb-0 block m-3">{{
                    $t('notFoundPage.message')
                }}</span>
            <Button @click="onButtonClick(props.closeButton?.action)" type="primary"
                    class="mt-5 w-fit px-auto font-semibold">
                {{ $t('notFoundPage.closeButton.title') }}
            </Button>
        </div>
    </div>
</template>

<script setup>
import {ref, defineProps} from 'vue';
import {useRoute, useRouter} from "vue-router";

const router = useRouter()
const route = useRoute();
const pageMessage = ref('')
const pageTitle = ref('')

const props = defineProps({
    closeButton: {
        type: Object,
        default: () => ({
            title: 'Return to homepage',
            action: null
        })
    },
    title: {
        type: String,
        default: 'Page not found'
    },
    message: {
        type: String,
        default: 'Sorry, the page you’re looking for does not exist or has been moved.'
    },
});

pageMessage.value = props.message || route.query.message;
pageTitle.value = props.title || route.query.title;

const onButtonClick = (callback) => {
    if (callback) {
        callback()
    }
    router.push('/')
}
</script>
