<script setup>
import { ref, onMounted } from 'vue';
import {logout} from "../services/auth/AuthService.js";
import {useRouter} from "vue-router";
import {showToaster} from "../services/messagesService.js";
import {get, post} from "../services/system/Request.js";
import {setCurrentCustomerData} from "../services/UserService.js";
import {jts_event_bus} from "../utils/event_bus.js";
import CustomSpinner from "./CustomSpinner.vue";

let lastRequestTime = 0;
const loading = ref(true);
const userProfile = ref({
    fullname: '',
    email: '',
    jiraEmail: '',
    jiraInstanceUrl: '',
    jiraApiKey: ''
});
const showApiKey = ref(false);

const router = useRouter()

const fetchData = async () => {
    try {
        const response = await get('/customer/get-user-data', userProfile.value);
        userProfile.value = response
        loading.value = false;
    } catch (error) {
        showToaster('error', error.data.message)
        throw error.data;
    }
};

const signOut = () => {
    logout(router)
}

onMounted(() => {
    fetchData();
});

const toggleApiKeyVisibility = () => {
    showApiKey.value = !showApiKey.value;
};

const saveChanges = async () => {
    const now = Date.now();
    if (now - lastRequestTime < 1500) return;

    lastRequestTime = now;

    try {
        const response = await post('/customer/save-user-data', userProfile.value);
        if (response) {
            await setCurrentCustomerData(userProfile.value);
            jts_event_bus.$emit('update_user_data');
        }
    } catch (error) {
        showToaster('error', error.data.message);
        throw error.data;
    }
};
</script>

<template>
    <TSCard class="card h-auto">
        <div v-if="loading" class="text-center"><CustomSpinner/></div>
        <TSForm v-else layout="vertical">
            <TSFormItem label="Name">
                <TSInput v-model:value="userProfile.fullname"  />
            </TSFormItem>

            <TSFormItem label="Email">
                <TSInput v-model:value="userProfile.email" disabled />
            </TSFormItem>

            <TSFormItem label="Jira Email" class="text-left">
                <TSInput class="mb-2" v-model:value="userProfile.jiraEmail" />
                <small class="text-color-secondary">This is the email associated with your Jira account. It must be the same email used for logging into Jira. If unsure, check your Atlassian account.</small>
            </TSFormItem>

            <TSFormItem label="Jira instance url" class="text-left">
                <TSInput class="mb-2" v-model:value="userProfile.jiraInstanceUrl" />
                <small class="text-color-secondary">The base URL of your Jira workspace. You can find it by opening Jira in your browser and copying the address up to the first slash after the domain, e.g., https://yourcompany.atlassian.net/.</small>
            </TSFormItem>

            <TSFormItem label="Jira API Key" class="text-left">
                <div style="display: flex; align-items: center;" class="mb-2">
                    <TSInput
                        v-model:value="userProfile.jiraApiKey"
                        :type="showApiKey ? 'text' : 'password'"
                        style="flex-grow: 1;"
                    />
                    <Button @click="toggleApiKeyVisibility" style="margin-left: 10px;">
                        {{ showApiKey ? 'Hide' : 'Show' }}
                    </Button>
                </div>
                <small class="text-color-secondary">Jira API Key This is a personal authentication token required to access Jira's API. You can generate it in your <a href='https://id.atlassian.com/manage-profile/security/api-tokens' target='_blank'>Atlassian API Token Management</a> settings. Once created, copy and store it securely, as it will not be shown again.</small>
            </TSFormItem>

            <TSSpace>
                <Button type="primary" @click="saveChanges">
                    Save
                </Button>
                <Button @click="signOut()" type="primary" danger>
                    Logout
                </Button>
            </TSSpace>
        </TSForm>
    </TSCard>
</template>

<style scoped lang="scss">
.action-buttons {
    margin-top: 20px;
    text-align: right;
}
</style>
