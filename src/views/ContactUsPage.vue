<template>
    <div class="container">
        <h1 class="text-center">Contact us</h1>
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
                    label="Your name"
                    name="name"
                    :rules="[{ required: true, message: 'Please fill your name' }]"
                >
                    <Input v-model:value="formState.name"/>
                </FormItem>

                <!-- Email -->
                <FormItem
                    label="Your email"
                    name="email"
                    :rules="[{ required: true, message: 'Please fill your email' }]"
                >
                    <Input v-model:value="formState.email"/>
                </FormItem>

                <!-- Subject -->
                <FormItem
                    label="Subject"
                    name="subject"
                    :rules="[{ required: true, message: 'Please select a subject' }]"
                >
                    <Select v-model:value="formState.subject" placeholder="Please select Subject">
                        <SelectOption value="API">Technical and API support</SelectOption>
                        <SelectOption value="Error Report">Conversion does not work as expected</SelectOption>
                        <SelectOption value="Other">Other</SelectOption>
                    </Select>
                </FormItem>

                <!-- Message -->
                <FormItem
                    label="Your message"
                    name="message"
                    :rules="[{ required: true, message: 'Please write your message' }]"
                >
                    <Textarea rows="10" v-model:value="formState.message"/>
                </FormItem>

                <!-- Privacy Policy -->
                <FormItem class="text-right" name="accept-privacy-policy" :wrapper-col="{ span: 11 }">
                    <Checkbox v-model:checked="formState.acceptPrivacyPolicy">
                        I accept the <a target="_blank" href="/privacy">Privacy Policy</a>.
                    </Checkbox>
                </FormItem>

                <!-- Submit Button -->
                <FormItem class="text-right" :wrapper-col="{ span: 22 }">
                    <Button :disabled="!allowSend" type="primary" html-type="submit">Send</Button>
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