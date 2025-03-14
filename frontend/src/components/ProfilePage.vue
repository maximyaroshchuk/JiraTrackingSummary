<script setup>
import { ref, onMounted } from 'vue';
import { Card, Form, FormItem, Input, Button, Space } from 'ant-design-vue';
import {logout} from "../services/auth/AuthService.js";
import {useRouter} from "vue-router";
import {showToaster} from "../services/messagesService.js";
import {get, post} from "../services/system/Request.js";
import {setCurrentCustomerData} from "../services/UserService.js";
import {jts_event_bus} from "../utils/event_bus.js";
import CustomSpinner from "./CustomSpinner.vue";

const loading = ref(true);
const userProfile = ref({
    fullname: '',
    email: '',
    jiraEmail: '',
    jiraInstanceUrl: '',
    jiraApiKey: ''
});

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

const showApiKey = ref(false);

const toggleApiKeyVisibility = () => {
    showApiKey.value = !showApiKey.value;
};

const saveChanges = async () => {
    try {
        const response = await post('/customer/save-user-data', userProfile.value);
        if (response) {
            await setCurrentCustomerData(userProfile.value)
            jts_event_bus.$emit('update_user_data')
        }
    } catch (error) {
        showToaster('error', error.data.message)
        throw error.data;
    }
};
</script>

<template>
    <div v-if="loading" class="text-center"><CustomSpinner/></div>
    <Card v-else class="col-8 h-auto">
        <Form layout="vertical">
            <FormItem label="Name">
                <Input v-model:value="userProfile.fullname"  />
            </FormItem>

            <FormItem label="Email">
                <Input v-model:value="userProfile.email" disabled />
            </FormItem>

            <FormItem label="Jira Email">
                <Input v-model:value="userProfile.jiraEmail" />
            </FormItem>

            <FormItem label="Jira instance url">
                <Input v-model:value="userProfile.jiraInstanceUrl" />
            </FormItem>

            <FormItem label="Jira API Key">
                <div style="display: flex; align-items: center;">
                    <Input
                        v-model:value="userProfile.jiraApiKey"
                        :type="showApiKey ? 'text' : 'password'"
                        style="flex-grow: 1;"
                    />
                    <Button @click="toggleApiKeyVisibility" style="margin-left: 10px;">
                        {{ showApiKey ? 'Hide' : 'Show' }}
                    </Button>
                </div>
            </FormItem>

            <Space>
                <Button type="primary" @click="saveChanges">
                    Save
                </Button>
                <Button @click="signOut()" type="primary" danger>
                    Logout
                </Button>
            </Space>
        </Form>
    </Card>
</template>

<style scoped lang="scss">
.action-buttons {
    margin-top: 20px;
    text-align: right;
}
</style>
