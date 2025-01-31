<template>
    <div>
        <h2>{{ $t('converter.convertTo') }} <span class="uppercase">{{ selectedInputFormat }}</span>
            {{ $t('converter.to') }} <span
                class="uppercase">{{ selectedOutputFormat }}</span></h2>

        <div class="flex flex-column">
            <Button type="dashed" class="input-60" @click="triggerFileSelection">{{
                    $t('converter.chooseFile')
                }}
            </Button>
            <input
                :key="selectFileInputKey"
                ref="fileInputRef"
                type="file"
                id="fileInput"
                :accept="`.${selectedInputFormat}`"
                @change="handleFileChange"
                style="display: none;"
            />
            <p class="m-0 mt-3" for="fileInput">{{ selectedFile?.name }}</p>
        </div>

        <form @submit.prevent="convertFile">
            <div v-if="!selectedOutputFormat" class="flex justify-content-center align-items-center">
                <h5>
                    <span class="uppercase">
                        {{ selectedInputFormat }}
                    </span>
                    {{ $t('converter.to') }}
                </h5>
                <Select class="ml-2 uppercase" size="large" v-model:value="selectedOutputFormat">
                    <option class="uppercase" v-for="format in availableOutputFormats" :key="format" :value="format">
                    </option>
                </Select>
            </div>
            <div class="flex flex-column">
                <Button type="primary" class="input-60 mt-3" htmlType="submit" :loading="convertionInProgress"
                        :disabled="!selectedFile || !selectedOutputFormat">{{ convertButtonText }}
                </Button>

                <a
                    id="download_converted_file_button"
                    v-if="downloadUrl"
                    class="link-60"
                    download
                    :href="downloadUrl"
                >
                    {{ $t('converter.downloadConverterFileButtonText') }}
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
import {useI18n} from "vue-i18n";
import {useHead} from '@vueuse/head'

const {t} = useI18n();

const MAX_FILE_SIZE = 104857600;
const CONVERSION_KEY = process.env.VUE_APP_CONVERSION_SECRET_KEY

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
const selectFileInputKey = ref(0);
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

const fileCategory = computed(() => getFileCategory(selectedInputFormat.value, props.to));

const availableOutputFormats = computed(() => {
    return getAvailableOutputFormats(fileCategory.value, selectedInputFormat.value);
});

const convertButtonText = computed(() => {
    return convertionInProgress.value ? t('converter.convertButtonTextInProgress') : t('converter.convertButtonText');
});

const triggerFileSelection = () => {
    if (fileInputRef.value) {
        fileInputRef.value.click();
    }
};

const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
        showToaster('error', t('converter.fileTooLarge', {size: '100MB'}));
        selectedFile.value = null;
        return;
    }

    selectedFile.value = file;
    downloadUrl.value = null;
};

const downloadConvertedFile = () => {
    if (!downloadUrl.value) {
        showToaster('error', t('converter.noFileAvailableForDownload'));
        return;
    }

    setTimeout(() => {
        const downloadButton = document.getElementById('download_converted_file_button');
        downloadButton.click()
    }, 1000)
};

const convertFile = async () => {
    if (!selectedFile.value || !selectedOutputFormat.value) return;

    const fileBuffer = await selectedFile.value.arrayBuffer();

    const fileBase64 = arrayBufferToBase64(fileBuffer);

    const encryptedFile = AES.encrypt(fileBase64, CONVERSION_KEY).toString();

    const dataToEncrypt = {
        fileType: fileCategory.value,
        inputFormat: selectedInputFormat.value,
        outputFormat: selectedOutputFormat.value.toLowerCase(),
        fileName: selectedFile.value.name,
    };

    const encryptedData = AES.encrypt(JSON.stringify(dataToEncrypt), CONVERSION_KEY).toString();

    const formData = new FormData();
    formData.append('file', new Blob([encryptedFile], {type: 'text/plain'}), selectedFile.value.name);
    formData.append('encryptedData', encryptedData);

    convertionInProgress.value = true;
    downloadUrl.value = null;

    await showToaster('loading', t('converter.conversionStarted'));

    try {
        const response = await post('/api/convert', formData);

        downloadUrl.value = AES.decrypt(response.data.encryptedDownloadLink, CONVERSION_KEY).toString(enc.Utf8);

        convertionInProgress.value = false;
        downloadConvertedFile();
        await showToaster('success', t('converter.conversionSuccessfullyCompleted'));
    } catch (error) {
        selectedFile.value = null;
        selectFileInputKey.value += 1
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

const updateMeta = () => {
    const fromUpper = props.from.toUpperCase()
    const toUpper = props.to.toUpperCase()

    useHead({
        title: t('converter.metaTitle', {from: fromUpper, to: toUpper}),
        meta: [
            {
                name: 'description',
                content: t('converter.metaDescription', {from: fromUpper, to: toUpper})
            },
            {
                name: 'keywords',
                content: t('converter.metaKeywords', {from: props.from, to: props.to})
            },
            {
                property: 'og:title',
                content: t('converter.metaTitle', {from: fromUpper, to: toUpper})
            },
            {
                property: 'og:description',
                content: t('converter.metaDescription', {from: fromUpper, to: toUpper})
            }
        ]
    })
}

watch(
    () => [props.from, props.to],
    () => {
        updateMeta()
    },
    {immediate: true}
)
</script>