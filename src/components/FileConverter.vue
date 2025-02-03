<template>
    <div>
        <h2>{{ $t('converter.convertTo') }} <span class="uppercase">{{ selectedInputFormat }}</span>
            {{ $t('converter.to') }} <span class="uppercase">{{ selectedOutputFormat }}</span>
        </h2>

        <div class="flex flex-column">
            <Button type="dashed" class="input-60" @click="triggerFileSelection">
                {{ $t('converter.chooseFile') }}
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
            <p class="m-0 mt-3">{{ fileName }}</p>
        </div>

        <form @submit.prevent="convertFile">
            <div v-if="!selectedOutputFormat" class="flex justify-content-center align-items-center">
                <h5>
                    <span class="uppercase">{{ selectedInputFormat }}</span>
                    {{ $t('converter.to') }}
                </h5>
                <Select class="ml-2 uppercase" size="large" v-model:value="selectedOutputFormat">
                    <option class="uppercase" v-for="format in availableOutputFormats" :key="format" :value="format">
                        {{ format }}
                    </option>
                </Select>
            </div>
            <div class="flex flex-column">
                <Button
                    :key="convertButtonKey"
                    type="primary"
                    class="input-60 mt-3"
                    htmlType="submit"
                    :loading="conversionInProgress"
                    :disabled="!hasFile || !selectedOutputFormat"
                >
                    {{ convertButtonText }}
                </Button>

                <a
                    v-if="downloadUrl"
                    id="download_converted_file_button"
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
import {ref, computed, watch, defineProps, onMounted, onBeforeUnmount} from 'vue';
import {getFileCategory, getAvailableOutputFormats} from '@/services/fileFormatService';
import {showToaster} from "@/services/messagesService";
import {post} from "@/services/system/Request";
import {AES, enc} from 'crypto-js';
import {useI18n} from "vue-i18n";
import {useHead} from '@vueuse/head';
import {v4 as uuidv4} from 'uuid';

const {t} = useI18n();

const MAX_FILE_SIZE = 104857600;
const CHUNK_SIZE = 1024 * 1024;
const CONVERSION_KEY = process.env.VUE_APP_CONVERSION_SECRET_KEY;

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

const fileInputRef = ref(null);
const fileName = ref('');
const hasFile = ref(false);
const fileId = ref(null);
const fileSize = ref(0);
const selectFileInputKey = ref(0);
const convertButtonKey = ref(0);
const selectedOutputFormat = ref(null);
const selectedInputFormat = ref(null);
const conversionInProgress = ref(false);
const downloadUrl = ref(null);

const cleanup = () => {
    if (downloadUrl.value) {
        URL.revokeObjectURL(downloadUrl.value);
    }
    fileName.value = '';
    hasFile.value = false;
    fileSize.value = 0;
    downloadUrl.value = null;
};

onMounted(() => {
    selectedInputFormat.value = props.from;
    selectedOutputFormat.value = props.to;
});

onBeforeUnmount(() => {
    cleanup();
});

watch(
    () => [props.from, props.to],
    ([newFrom, newTo]) => {
        cleanup();
        selectedInputFormat.value = newFrom;
        selectedOutputFormat.value = newTo;
    },
    {immediate: true}
);

const fileCategory = computed(() => getFileCategory(selectedInputFormat.value, props.to));

const availableOutputFormats = computed(() =>
    getAvailableOutputFormats(fileCategory.value, selectedInputFormat.value)
);

const convertButtonText = computed(() =>
    conversionInProgress.value
        ? t('converter.convertButtonTextInProgress')
        : t('converter.convertButtonText')
);

const triggerFileSelection = () => {
    if (fileInputRef.value) {
        fileInputRef.value.click();
    }
};

const handleFileChange = async (event) => {
    cleanup();
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
        await showToaster('error', t('converter.fileTooLarge', {size: '100MB'}));
        return;
    }

    fileName.value = file.name;
    fileSize.value = file.size;
    hasFile.value = true;
};

/**
 * Завантажує файл чанками. Кожен чанк відправляється на бекенд за адресою "/api/upload-chunk".
 * Функція повертає згенерований унікальний fileId.
 */
async function uploadFileInChunks(file) {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileId = uuidv4();
    for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk, file.name);
        formData.append('fileId', fileId);
        formData.append('chunkNumber', i);
        formData.append('totalChunks', totalChunks);
        formData.append('fileName', file.name);

        // Відправляємо кожен чанк на кінцеву точку /api/upload-chunk
        await post('/api/upload-chunk', formData);
    }
    return fileId;
}

const downloadConvertedFile = () => {
    if (!downloadUrl.value) {
        showToaster('error', t('converter.noFileAvailableForDownload'));
        return;
    }
    setTimeout(() => {
        const downloadButton = document.getElementById('download_converted_file_button');
        downloadButton.click();
    }, 1000);
};

const convertFile = async () => {
    if (!hasFile.value || !selectedOutputFormat.value) return;

    try {
        convertButtonKey.value++;
        conversionInProgress.value = true;

        const file = fileInputRef.value.files[0];

        fileId.value = await uploadFileInChunks(file);

        const dataToEncrypt = {
            fileType: fileCategory.value,
            inputFormat: selectedInputFormat.value,
            outputFormat: selectedOutputFormat.value.toLowerCase(),
        };
        const encryptedData = AES.encrypt(JSON.stringify(dataToEncrypt), CONVERSION_KEY).toString();

        const conversionPayload = {
            fileName: file.name,
            encryptedData,
        };

        await showToaster('loading', t('converter.conversionStarted'));

        const response = await post('/api/convert', conversionPayload);
        const decryptedUrl = AES.decrypt(response.data.encryptedDownloadLink, CONVERSION_KEY).toString(enc.Utf8);
        downloadUrl.value = decryptedUrl;

        downloadConvertedFile();
        await showToaster('success', t('converter.conversionSuccessfullyCompleted'));
    } catch (error) {
        cleanup();
        selectFileInputKey.value++;
        const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            error
        await showToaster('error', errorMessage);
    } finally {
        conversionInProgress.value = false;
    }
};

const updateMeta = () => {
    const fromUpper = props.from.toUpperCase();
    const toUpper = props.to.toUpperCase();

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
    });
};

watch(() => [props.from, props.to], updateMeta, {immediate: true});
</script>
