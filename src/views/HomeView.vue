<template>
    <div class="home">
        <h1>{{ $t('welcome') }} <span class="brand">{{ $t('brand') }}</span></h1>
        <p>{{ $t('description') }}</p>

        <div class="cta">
            <div class="conversion-type-selector mb-4">
                <RadioGroup v-model:value="selectedType" button-style="solid" size="large">
                    <RadioButton value="images">
                        <i class="pi pi-image mr-2"></i>{{ $t('conversion_types.images') }}
                    </RadioButton>
                    <RadioButton value="video">
                        <i class="pi pi-video mr-2"></i>{{ $t('conversion_types.videos') }}
                    </RadioButton>
                </RadioGroup>
            </div>

            <div class="flex justify-content-center align-items-center">
                <Select size="large" class="mr-2 uppercase" v-model:value="selectedFromFormat">
                    <option class="uppercase" v-for="format in availableFromConversionFormats" :key="format"
                            :value="format">
                        {{ format }}
                    </option>
                </Select>
                <h4>{{ $t('to') }}</h4>
                <Select size="large" class="ml-2 uppercase" v-model:value="selectedToFormat">
                    <option class="uppercase" v-for="format in availableToConversionFormats" :key="format"
                            :value="format">
                        {{ format }}
                    </option>
                </Select>
            </div>

            <Button type="primary" class="input-60 mt-4" @click="goToConversionPage"
                    :disabled="!selectedFromFormat || !selectedToFormat">
                {{ $t('start_converting_now') }}
            </Button>
        </div>

        <div class="popular-conversions" v-if="selectedType === 'images'">
            <h2>{{ $t('popular_image_conversions') }}</h2>
            <div class="conversion-list">
                <router-link to="/converter/png-to-jpg" class="conversion-card">
                    <span>PNG {{ $t('to') }} JPG</span>
                </router-link>
                <router-link to="/converter/jpg-to-png" class="conversion-card">
                    <span>JPG {{ $t('to') }} PNG</span>
                </router-link>
                <router-link to="/converter/webp-to-png" class="conversion-card">
                    <span>WEBP {{ $t('to') }} PNG</span>
                </router-link>
                <router-link to="/converter/png-to-webp" class="conversion-card">
                    <span>PNG {{ $t('to') }} WEBP</span>
                </router-link>
            </div>
        </div>

        <div class="popular-conversions" v-if="selectedType === 'video'">
            <h2>{{ $t('popular_video_conversions') }}</h2>
            <div class="conversion-list">
                <router-link to="/converter/mp4-to-mov" class="conversion-card">
                    <span>MP4 {{ $t('to') }} MOV</span>
                </router-link>
                <router-link to="/converter/mov-to-mp4" class="conversion-card">
                    <span>MOV {{ $t('to') }} MP4</span>
                </router-link>
                <router-link to="/converter/mp4-to-avi" class="conversion-card">
                    <span>MP4 {{ $t('to') }} AVI</span>
                </router-link>
                <router-link to="/converter/avi-to-mp4" class="conversion-card">
                    <span>AVI {{ $t('to') }} MP4</span>
                </router-link>
            </div>
        </div>

        <div class="benefits">
            <h2>{{ $t('why_choose') }}</h2>
            <div class="benefits-list">
                <div class="benefit-card">
                    <h3 class="flex align-items-center justify-content-center">
                        <i class="pi pi-bolt mr-2"></i>
                        {{ $t('benefits.lightning_fast') }}
                    </h3>
                    <p>{{ $t('benefits.lightning_fast_desc') }}</p>
                </div>
                <div class="benefit-card">
                    <h3 class="flex align-items-center justify-content-center">
                        <i class="pi pi-user mr-2"></i>
                        {{ $t('benefits.no_registration') }}
                    </h3>
                    <p>{{ $t('benefits.no_registration_desc') }}</p>
                </div>
                <div class="benefit-card">
                    <h3 class="flex align-items-center justify-content-center">
                        <i class="pi pi-shield mr-2"></i>
                        {{ $t('benefits.secure_private') }}
                    </h3>
                    <p>{{ $t('benefits.secure_private_desc') }}</p>
                </div>
                <div class="benefit-card">
                    <h3 class="flex align-items-center justify-content-center">
                        <i class="pi pi-code mr-2"></i>
                        {{ $t('benefits.developer_friendly_api') }}
                    </h3>
                    <p>
                        {{ $t('benefits.developer_friendly_api_desc') }}
                        <a href="/api-docs" class="api-link">{{ $t('benefits.learn_more') }}</a>.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue';
import {useRouter} from 'vue-router';
import {getAvailableOutputFormats} from '@/services/fileFormatService';
import {RadioButton, RadioGroup} from "ant-design-vue";

const router = useRouter();
const selectedType = ref('images');
const selectedFromFormat = ref('');
const selectedToFormat = ref('');

const availableFromConversionFormats = computed(() => {
    return getAvailableOutputFormats(selectedType.value, selectedToFormat.value);
});

const availableToConversionFormats = computed(() => {
    return getAvailableOutputFormats(selectedType.value, selectedFromFormat.value);
});

const goToConversionPage = () => {
    if (selectedFromFormat.value && selectedToFormat.value) {
        router.push(`/converter/${selectedFromFormat.value}-to-${selectedToFormat.value}`);
    }
};

watch([selectedFromFormat, selectedToFormat], ([newFrom, newTo]) => {
    if (newFrom && newTo && newFrom === newTo) {
        if (selectedFromFormat.value === newFrom) {
            selectedToFormat.value = '';
        } else {
            selectedFromFormat.value = '';
        }
    }
});

watch(selectedType, () => {
    selectedFromFormat.value = '';
    selectedToFormat.value = '';
});
</script>

<style scoped>
.home {
    text-align: center;
    padding: 2rem;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.brand {
    color: #1DA079;
    font-weight: bold;
}

p {
    color: #666;
    margin-bottom: 2rem;
}

.conversion-type-selector {
    margin-bottom: 2rem;
}

.popular-conversions {
    margin: 3rem 0;
}

.conversion-list {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1rem;
}

.conversion-card {
    padding: 1rem 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-decoration: none;
    color: #333;
    transition: all 0.3s ease;
}

.conversion-card:hover {
    background-color: #f9f9f9;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.benefits {
    margin: 3rem 0;
}

.benefits-list {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    margin-top: 2rem;
}

.benefit-card {
    max-width: 300px;
    padding: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.benefit-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>