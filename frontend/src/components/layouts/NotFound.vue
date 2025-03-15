<template>
    <div
        class="not-found-wrapper flex flex-column align-items-center justify-content-center w-full">
        <div class="flex flex-column align-items-center">
            <h1 class="mb-3">Page not found</h1>
            <p>
                {{props.message}}
            </p>
            <Button @click="onButtonClick(props.closeButton?.action)" type="primary"
                    class="mt-4">
                {{ props.closeButton.title }}
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
            title: 'Return to tracking summary page',
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
    router.push('/summary')
}
</script>