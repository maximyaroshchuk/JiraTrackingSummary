<script setup>
import { ref } from 'vue';
import { Card, Form, FormItem, Input, Button, Space, message } from 'ant-design-vue';
import {showToaster} from "../../services/messagesService.js";
import {register, login} from "../../services/auth/AuthService.js";
import {useRouter} from "vue-router";

const isLogin = ref(true);
const router = useRouter();

// Данные формы
const formData = ref({
    email: '',
    fullname: '',
    password: '',
    confirmPassword: ''
});

const handleLogin = async () => {
    try {
        const response = await login(formData.value.email, formData.value.password);
        setTimeout(() => {
            showToaster('success',`Welcome ${response.user.fullname}`)
        }, 100)
        await router.push({name: 'summary'});
    } catch (error) {
        showToaster('error', error.error)
        if (error.warning) {
            showToaster('error', 'Enter a valid email address');
        }
    }
};

const handleRegister = async () => {
    if (formData.value.password === formData.value.confirmPassword) {
        if (formData.value.email && formData.value.password) {
            try {
                const response = await register(formData.value.email, formData.value.password, formData.value.fullname);
                toggleAuthState();
            } catch (error) {
                showToaster('error', error.error || error.data.error);
            }
        } else {
            showToaster('error', 'Please fill in all fields');
        }
    } else {
        showToaster('error', 'Passwords do not match');
    }
};

const toggleAuthState = () => {
    isLogin.value = !isLogin.value;
    formData.value = { email: '', fullname: '', password: '', confirmPassword: '' };
};
</script>

<template>
    <div class="h-full mx-3 flex align-items-center justify-content-center">
        <Card class="w-full">
            <h2 class="mb-5">Jira tracking summary app</h2>
            <Form layout="vertical">
                <FormItem label="Email">
                    <Input v-model:value="formData.email" />
                </FormItem>

                <div v-if="!isLogin">
                    <FormItem label="Fullname">
                        <Input v-model:value="formData.fullname"  />
                    </FormItem>
                </div>

                <FormItem label="Password">
                    <Input v-model:value="formData.password" type="password" />
                </FormItem>

                <div v-if="!isLogin">
                    <FormItem label="Confirm Password">
                        <Input v-model:value="formData.confirmPassword" type="password" />
                    </FormItem>
                </div>

                <Space>
                    <Button type="primary" @click="isLogin ? handleLogin() : handleRegister()">
                        {{ isLogin ? 'Login' : 'Register' }}
                    </Button>
                    <Button @click="toggleAuthState">
                        {{ isLogin ? 'Create an account' : 'Already have an account?' }}
                    </Button>
                </Space>
            </Form>
        </Card>
    </div>
</template>

<style scoped lang="scss">
.action-buttons {
    margin-top: 20px;
    text-align: right;
}
</style>
