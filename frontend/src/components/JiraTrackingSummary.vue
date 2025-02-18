<template>
    <div class="p-4 surface-card">
        <div v-if="loading" class="text-center"><CustomSpinner/></div>
        <div v-else-if="error" class="flex flex-column error">
            <p class="font-bold">{{ error }}</p>
            <Button class="mt-4" type="primary" @click="fetchWorklogs">Try again</Button>
        </div>
        <div v-else>
            <h1 class="text-2xl font-bold mb-6">Your worklogs for {{todayDate}}</h1>
            <table>
                <thead>
                <tr class="bg-gray-100">
                    <th class="py-2 px-4 border">Task</th>
                    <th class="py-2 px-4 border">Title</th>
                    <th class="py-2 px-4 border">Logged Time (h)</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="task in worklogs" :key="task.key" class="border-b">
                    <td class="py-2 px-4">
                        <a :href="`https://jira-splynx.atlassian.net/browse/${task.key}`" target="_blank">
                            {{ task.key }}
                        </a>
                    </td>
                    <td class="py-2 px-4">{{ task.summary }}</td>
                    <td class="py-2 px-4">{{ task.timeSpent }}</td>
                </tr>
                </tbody>
            </table>
            <div class="mt-4 text-lg font-bold">
                Total: <span class="total">{{ totalHours }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import CustomSpinner from "./CustomSpinner.vue";

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

async function fetchWorklogs() {
    loading.value = true;
    try {
        const response = await axios.get(`${API_URL}/api/worklogs`);
        worklogs.value = response.data.tasks;
        totalHours.value = response.data.total;
    } catch (err) {
        error.value = 'Error loading worklogs';
        console.error(err);
    } finally {
        loading.value = false;
    }
}

onMounted(fetchWorklogs);
</script>

<style scoped lang="scss">
a {
    color: #2e8cff;
}

a:hover {
    color: #006aec;
}

.surface-card {
    background-color: #e1e1e1 !important;
    border-radius: 12px;
}

.total {
    color: #006aec !important;
}

.error {
    color: #f55f5f !important;
}

table a {
    text-decoration: none;
}
thead tr {
    background-color: #151515 !important;
}

thead th {
    color: #ffffff;
    border: 1px solid #4f4f4f !important;
    font-weight: 500;
    text-align: left;
}

thead th:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 0;
}

thead th:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 0;
}

tbody tr:first-child td {
    border-top: none;
}

table tbody tr {
    border-left: 1px solid #4f4f4f;
    border-right: 1px solid #4f4f4f;
    border-bottom: 1px solid #4f4f4f;
}

tbody td {
    text-align: left;
    padding: 0.5rem;
    border-top: none;
    border-bottom: 1px solid #4f4f4f;
}
</style>
