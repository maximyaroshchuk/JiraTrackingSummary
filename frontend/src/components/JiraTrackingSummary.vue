<template>
    <div class="w-full">
        <TSCard class="card h-auto">
            <div v-if="loading" class="text-center"><CustomSpinner /></div>
            <div v-else-if="error" class="flex flex-column error">
                <p class="font-bold">{{ error }}</p>
                <Button class="mt-4" type="primary" @click="fetchWorklogs">Try again</Button>
            </div>
            <div v-else>
                <h2 class="font-bold mb-6">Hello, <span class="highlighted">{{ user.fullname }}</span></h2>
                <h3 class="text-2xl mb-6">Your worklogs for {{ todayDate }}</h3>

                <TSTable :columns="columns" :data-source="worklogs" :pagination="pagination" rowKey="key">
                    <template v-slot:bodyCell="props">
                        <span v-if="props.column.dataIndex === 'key'">
                            <a :href="`https://jira-splynx.atlassian.net/browse/${props.record.key}`" target="_blank">
                                {{ props.record.key }}
                            </a>
                        </span>
                        <span v-else>{{ props.value }}</span>
                    </template>
                </TSTable>

                <div class="mt-4 text-lg font-bold">
                    Total: <span class="total">{{ totalHours }}</span>
                </div>
            </div>
        </TSCard>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CustomSpinner from "./CustomSpinner.vue";
import { useUserStore } from '../store/user.js';
import { get } from "../services/system/Request.js";
import { showToaster } from "../services/messagesService.js";
import {Card as TSCard} from "ant-design-vue";

const userStore = useUserStore();
const user = ref(userStore.getUserData);
const worklogs = ref([]);
const totalHours = ref(0);
const loading = ref(true);
const error = ref(null);
const API_URL = import.meta.env.VITE_API_URL;
const todayDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
});

const columns = [
    {
        title: 'Task',
        dataIndex: 'key',
        key: 'key',
        resizable: true,
        render: (text, record) => {
            return `<a href="https://jira-splynx.atlassian.net/browse/${record.key}" target="_blank">${text}</a>`;
        }
    },
    {
        title: 'Title',
        dataIndex: 'summary',
        resizable: true,
        key: 'summary',
    },
    {
        title: 'Logged Time (h)',
        dataIndex: 'timeSpent',
        resizable: true,
        key: 'timeSpent',
    }
];

const pagination = {
    pageSize: 10,
};

async function fetchWorklogs() {
    loading.value = true;
    try {
        const response = await get(`${API_URL}/api/worklogs`);
        worklogs.value = response.tasks;
        totalHours.value = response.total;
    } catch (err) {
        showToaster('error', err.error);

        console.error(err);
    } finally {
        loading.value = false;
    }
}

onMounted(fetchWorklogs);
</script>

<style scoped lang="scss">
//a {
//    color: #2e8cff;
//}
//
//a:hover {
//    color: #006aec;
//}

.total {
    color: #0072ff !important;
}

.error {
    color: #f55f5f !important;
}

.ant-card {
    border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.surface-card {
    width: 100%;
}

.highlighted {
    color: #496FE0 !important;
}
</style>
