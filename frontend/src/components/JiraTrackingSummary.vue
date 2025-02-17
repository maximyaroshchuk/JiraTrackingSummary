// Frontend: Vue 3 (Vite) - Displaying Jira Worklogs
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const worklogs = ref([]);
const totalHours = ref(0);
const loading = ref(true);
const error = ref(null);
const API_URL = import.meta.env.VITE_API_URL;

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

<template>
    <div class="p-4 surface-card">
        <h1 class="text-2xl font-bold mb-6">Your Worklogs for Today</h1>

        <div v-if="loading" class="text-center">Loading...</div>
        <div v-else-if="error" class="text-red-500">{{ error }}</div>
        <div v-else>
            <table>
                <thead>
                <tr class="bg-gray-100">
                    <th class="py-2 px-4 border">Task</th>
                    <th class="py-2 px-4 border">Summary</th>
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

<style scoped lang="scss">
table {
    border-collapse: collapse;
}

a {
    color: #539df2;
}

.surface-card {
    background-color: #242424 !important;
    border-radius: 12px;
}

.total {
    color: #f55f5f !important;
}
table th, table td {
    text-align: left;
    padding: 0.5rem;
    border: 1px solid #ccc;
}
</style>
