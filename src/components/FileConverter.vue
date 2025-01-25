<template>
    <div>
        <h2>Convert <span class="uppercase">{{ selectedInputFormat }}</span> to <span
            class="uppercase">{{ selectedOutputFormat }}</span></h2>

        <div class="flex flex-column">
            <Button type="dashed" class="btn-60" @click="triggerFileSelection">Choose a file (up to 100MB)</Button>
            <input
                ref="fileInputRef"
                type="file"
                id="fileInput"
                :accept="`.${selectedInputFormat}`"
                @change="handleFileChange"
                style="display: none;"
            />
            <p class="p-secondary" for="fileInput">{{ selectedFile?.name }}</p>
        </div>

        <form @submit.prevent="convertFile">
            <div v-if="!selectedOutputFormat" class="flex justify-content-center align-items-center">
                <h5>
                    <span class="uppercase">
                        {{ selectedInputFormat }}
                    </span>
                    to
                </h5>
                <Select class="ml-2 uppercase" v-model:value="selectedOutputFormat">
                    <option class="uppercase" v-for="format in availableOutputFormats" :key="format" :value="format">
                    </option>
                </Select>
            </div>
            <div class="flex flex-column">
                <Button type="primary" class="btn-60" htmlType="submit" :loading="convertionInProgress"
                        :disabled="!selectedFile">{{ convertButtonText }}
                </Button>

                <a
                    id="download_converted_file_button"
                    v-if="downloadUrl"
                    class="link-60 mt-4"
                    download
                    :href="downloadUrl"
                >
                    {{ downloadConverterFileButtonText }}
                </a>
            </div>
        </form>
    </div>
</template>

<script setup>
import {ref, computed, watch, defineProps, onMounted} from 'vue';
import {getFileCategory, getAvailableOutputFormats} from '@/services/fileFormatService';
import {showToaster} from "@/services/messagesService";
import {post} from "@/services/system/Request";
import {AES, enc} from 'crypto-js';

const props = defineProps({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    }
});

const selectedFile = ref(null);
const selectedOutputFormat = ref(null);
const selectedInputFormat = ref(null);
const convertionInProgress = ref(false);
const downloadUrl = ref(null);
const fileInputRef = ref(null);

onMounted(() => {
    selectedInputFormat.value = props.from;
    selectedOutputFormat.value = props.to;
});

watch(
    () => [props.from, props.to],
    ([newFrom, newTo]) => {
        selectedInputFormat.value = newFrom;
        selectedOutputFormat.value = newTo;
    },
    {immediate: true}
);

const fileCategory = computed(() => getFileCategory(selectedInputFormat.value));

const availableOutputFormats = computed(() => {
    return getAvailableOutputFormats(fileCategory.value, selectedInputFormat.value);
});

const convertButtonText = computed(() => {
    return convertionInProgress.value ? 'Convert in progress...' : 'Convert';
});

const downloadConverterFileButtonText = computed(() => {

    return `Download converted ${fileCategory.value}`
});

const triggerFileSelection = () => {
    if (fileInputRef.value) {
        fileInputRef.value.click();
    }
};

const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0];
    downloadUrl.value = null;
};

const downloadConvertedFile = () => {
    if (!downloadUrl.value) {
        showToaster('error', 'No file available for download');
        return;
    }

    setTimeout(() => {
        const downloadButton = document.getElementById('download_converted_file_button');
        downloadButton.click()
    }, 1000)
};

const secretKey = 'mySecretKey123';

const convertFile = async () => {
    if (!selectedFile.value || !selectedOutputFormat.value) return;

    const fileBuffer = await selectedFile.value.arrayBuffer();

    const fileBase64 = arrayBufferToBase64(fileBuffer);

    const encryptedFile = AES.encrypt(fileBase64, secretKey).toString();

    const dataToEncrypt = {
        fileType: fileCategory.value,
        inputFormat: selectedInputFormat.value,
        outputFormat: selectedOutputFormat.value.toLowerCase(),
        fileName: selectedFile.value.name,
    };

    const encryptedData = AES.encrypt(JSON.stringify(dataToEncrypt), secretKey).toString();

    const formData = new FormData();
    formData.append('file', new Blob([encryptedFile], {type: 'text/plain'}), selectedFile.value.name);
    formData.append('encryptedData', encryptedData);

    convertionInProgress.value = true;
    downloadUrl.value = null;

    await showToaster('loading', 'Conversion started');

    try {
        const response = await post('/api/convert', formData);

        downloadUrl.value = AES.decrypt(response.data.encryptedDownloadLink, secretKey).toString(enc.Utf8);

        convertionInProgress.value = false;
        downloadConvertedFile();
        await showToaster('success', 'Conversion completed successfully');
    } catch (error) {
        selectedFile.value = null;
        convertionInProgress.value = false;
        await showToaster('error', error.data?.message);
    }
};

const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

watch(
    () => [props.from, props.to],
    ([newFrom, newTo]) => {
        document.title = `Convert ${newFrom.toUpperCase()} to ${newTo.toUpperCase()} - LightConvert`;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', `Convert ${newFrom.toUpperCase()} files to ${newTo.toUpperCase()} format online. Fast, free, and easy to use!`);
        }

        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', `Convert ${newFrom} to ${newTo}, by LightConvert ${newFrom} to ${newTo}, online ${newFrom} to ${newTo} converter`);
        }
    },
    {immediate: true}
);
</script>