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

                <Button v-if="showTikniButton" type="primary" danger size="large" @click="openModal">ТИКНИ</Button>

                <Modal v-model:open="isModalOpen" :onOk="closeModal" title="😑🤣" centered>
                    <img src="/adgjm5.jpg" alt="Funny image" class="w-full rounded-xl" />
                </Modal>


                <div>
                    <div class="datepicker-wrapper">
                        <TSDatePicker class="datepicker" v-model:value="dateValue" :allow-clear="false" @change="fetchWorklogs" />
                    </div>
                    <TSTable :columns="columns" :data-source="worklogs" :pagination="pagination" rowKey="key">
                        <template v-slot:bodyCell="props">
                            <span v-if="props.column.dataIndex === 'key'">
                                <a :href="`${formattedJiraUrl}browse/${props.record.key}`" target="_blank">
                                    {{ props.record.key }}
                                </a>
                            </span>
                            <span v-else>{{ props.value }}</span>
                        </template>
                    </TSTable>
                </div>

                <div class="mt-4 text-lg font-bold">
                    Total: <span class="total">{{ totalHours }}</span>
                </div>
            </div>
        </TSCard>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import {ref, onMounted, computed} from 'vue';
import CustomSpinner from "./CustomSpinner.vue";
import { useUserStore } from '../store/user.js';
import { get } from "../services/system/Request.js";
import { showToaster } from "../services/messagesService.js";
import {Card as TSCard} from "ant-design-vue";
import {DatePicker as TSDatePicker} from "ant-design-vue";
import {Modal} from "ant-design-vue";

const userStore = useUserStore();
const user = ref(userStore.getUserData);
const worklogs = ref([]);
const totalHours = ref(0);
const lastWorklogTime = ref(0);
const loading = ref(true);
const error = ref(null);
const API_URL = import.meta.env.VITE_API_URL;

const dateValue = ref(dayjs());
const todayDate = ref('');
// const todayDate = new Date().toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric'
// });

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
        title: 'Time since last commit ',
        dataIndex: 'lastCommit',
        resizable: true,
        key: 'lastCommit',
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
        const selectedDate = dayjs(dateValue.value).format('YYYY-MM-DD');
        const response = await get(`${API_URL}/api/worklogs-by-date?date=${selectedDate}`);
        worklogs.value = response.tasks;
        totalHours.value = response.total;
        todayDate.value = response.date;
        lastWorklogTime.value = response.timeSinceLastWorklog;
    } catch (err) {
        showToaster('error', err.error);

        console.error(err);
    } finally {
        loading.value = false;
    }
}

onMounted(fetchWorklogs);

const formattedJiraUrl = computed(() =>
    user.value.jiraInstanceUrl.endsWith('/') ? user.value.jiraInstanceUrl : `${user.value.jiraInstanceUrl}/`
);

const isModalOpen = ref(false);
const openModal = () => { isModalOpen.value = true; };

const closeModal = () => { isModalOpen.value = false; };

const deadline = dayjs('2025-12-01');
const showTikniButton = computed(() =>
    dayjs().isBefore(deadline.add(1, 'day'), 'day')
    && (user.value?.email === 'andrii.yurchuk@splynx.com' || user.value?.email === 'maxim.yaroshuk@splynx.com')
);
</script>

<style scoped lang="scss">
.total {
    color: #eb5757 !important;
}

.error {
    color: #ff0000 !important;
}

.highlighted {
    color: #343434 !important;
}

.datepicker-wrapper {
    display: flex;
    justify-content: flex-end;

    .datepicker {
        margin-bottom: 24px;
    }
}
</style>
