<template>
    <div class="container">
        <h1 class="text-center">{{ $t('contact.title') }}</h1>
        <div class="flex flex-column align-items-center">
            <Form
                :model="formState"
                name="basic"
                class="w-full"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 16 }"
                autocomplete="off"
                @finish="onFinish"
                @finishFailed="onFinishFailed"
            >
                <!-- Name -->
                <FormItem
                    :label="$t('contact.nameLabel')"
                    name="name"
                    :rules="[{ required: true, message: $t('contact.nameError') }]"
                >
                    <Input v-model:value="formState.name"/>
                </FormItem>

                <!-- Email -->
                <FormItem
                    :label="$t('contact.emailLabel')"
                    name="email"
                    :rules="[{ required: true, message: $t('contact.emailError') }]"
                >
                    <Input v-model:value="formState.email"/>
                </FormItem>

                <!-- Subject -->
                <FormItem
                    :label="$t('contact.subjectLabel')"
                    name="subject"
                    :rules="[{ required: true, message: $t('contact.subjectError') }]"
                >
                    <Select v-model:value="formState.subject" :placeholder="$t('contact.subjectPlaceholder')">
                        <SelectOption value="API">{{ $t('contact.subjectOptions.api') }}</SelectOption>
                        <SelectOption value="Error Report">{{ $t('contact.subjectOptions.errorReport') }}</SelectOption>
                        <SelectOption value="Other">{{ $t('contact.subjectOptions.other') }}</SelectOption>
                    </Select>
                </FormItem>

                <!-- Message -->
                <FormItem
                    :label="$t('contact.messageLabel')"
                    name="message"
                    :rules="[{ required: true, message: $t('contact.messageError') }]"
                >
                    <Textarea rows="10" v-model:value="formState.message"/>
                </FormItem>

                <!-- Privacy Policy -->
                <FormItem class="text-right" name="accept-privacy-policy" :wrapper-col="{ span: 11 }">
                    <Checkbox v-model:checked="formState.acceptPrivacyPolicy">
                        {{ $t('contact.privacyPolicy') }}
                        <a target="_blank" href="/privacy">{{ $t('contact.privacyPolicyLinkText') }}</a>
                    </Checkbox>
                </FormItem>

                <!-- Submit Button -->
                <FormItem class="text-right" :wrapper-col="{ span: 22 }">
                    <Button :disabled="!allowSend" type="primary" html-type="submit">{{ $t('contact.submit') }}</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script setup>
import {computed, reactive} from "vue";
import {empty} from "@/utils/functions";
import {post} from "@/services/system/Request";
import {showToaster} from "@/services/messagesService";

const formState = reactive({
    name: "",
    email: "",
    subject: "",
    message: "",
    acceptPrivacyPolicy: false,
});
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmailValid = computed(() => emailPattern.test(formState.email));

const allowSend = computed(() => {
    return (
        !empty(formState.name) &&
        !empty(formState.email) &&
        !empty(formState.subject) &&
        !empty(formState.message) &&
        formState.acceptPrivacyPolicy
    );
});

const cleanForm = () => {
    formState.name = "";
    formState.email = "";
    formState.subject = "";
    formState.message = "";
    formState.acceptPrivacyPolicy = false;
}

const onFinish = async (values) => {
    if (allowSend.value) {
        if (isEmailValid.value) {
            try {
                const response = await post("/contact", values, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                await showToaster('success', response.data?.message);

                cleanForm()
            } catch (error) {
                console.error("Error:", error);
                await showToaster('error', "An error occurred. Please try again.");
            }
        } else {
            await showToaster('error', 'Enter a valid email address');
        }
    }
};

const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    showToaster('error', "Please fill all required fields correctly.");
};
</script>