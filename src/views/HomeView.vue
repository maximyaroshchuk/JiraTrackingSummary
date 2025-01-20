<template>
    <div class="home">
        <h1>Welcome to <span class="brand">LightConvert</span></h1>
        <p>Your go-to solution for fast, free, and secure image conversions. Convert between popular formats like PNG,
            JPG, and more with ease.</p>

        <div class="cta">
            <div class="flex justify-content-center align-items-center">
                <Select size="large" class="mr-2 uppercase" v-model:value="selectedFromFormat">
                    <option class="uppercase" v-for="format in availableFromConversionFormats" :key="format"
                            :value="format">
                        {{ format }}
                    </option>
                </Select>
                <h4>to</h4>
                <Select size="large" class="ml-2 uppercase" v-model:value="selectedToFormat">
                    <option class="uppercase" v-for="format in availableToConversionFormats" :key="format"
                            :value="format">{{ format }}
                    </option>
                </Select>
            </div>
            <Button type="primary" class="btn-60" @click="goToConversionPage"
                    :disabled="!selectedFromFormat || !selectedToFormat">
                Start Converting Now
            </Button>
        </div>

        <div class="popular-conversions">
            <h2>Popular Image Conversions</h2>
            <div class="conversion-list">
                <router-link to="/converter?from=png&to=jpg" class="conversion-card">
                    <span>PNG to JPG</span>
                </router-link>
                <router-link to="/converter?from=jpg&to=png" class="conversion-card">
                    <span>JPG to PNG</span>
                </router-link>
                <router-link to="/converter?from=webp&to=png" class="conversion-card">
                    <span>WEBP to PNG</span>
                </router-link>
                <router-link to="/converter?from=png&to=webp" class="conversion-card">
                    <span>PNG to WEBP</span>
                </router-link>
            </div>
        </div>

        <div class="benefits">
            <h2>Why Choose LightConvert?</h2>
            <div class="benefits-list">
                <div class="benefit-card">
                    <h3 class="flex align-items-center justify-content-center">
                        <i style="font-size: 1rem" class="pi pi-bolt mr-2"></i>
                        Lightning Fast
                    </h3>
                    <p>Convert images in seconds with our optimized tools. Whether you're converting one file or a
                        batch, our system ensures minimal waiting time.</p>
                </div>
                <div class="benefit-card">
                    <h3 class="flex align-items-center justify-content-center">
                        <i style="font-size: 1rem" class="pi pi-user mr-2"></i>
                        No Registration
                    </h3>
                    <p>Start converting immediately—no sign-up required. We believe in providing a hassle-free
                        experience, so you can focus on your work without unnecessary steps.</p>
                </div>
                <div class="benefit-card">
                    <h3 class="flex align-items-center justify-content-center">
                        <i style="font-size: 1rem" class="pi pi-shield mr-2"></i>
                        Secure & Private
                    </h3>
                    <p>
                        Your files are safe with us. We use <strong>AES-256 encryption</strong>, the industry standard
                        for data security, to protect your files during transfer and processing.
                        All files are automatically deleted from our servers after conversion, ensuring your privacy.
                    </p>
                </div>
                <div class="benefit-card">
                    <h3 class="flex align-items-center justify-content-center">
                        <i style="font-size: 1rem" class="pi pi-code mr-2"></i>
                        Developer-Friendly API
                    </h3>
                    <p>
                        Integrate our powerful conversion tools into your applications with our easy-to-use API.
                        Perfect for developers and businesses looking to automate workflows or add file conversion
                        features to their platforms.
                        <a href="/api-docs" class="api-link">Learn more</a>.
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

const router = useRouter();
const selectedFromFormat = ref('');
const selectedToFormat = ref('');

// const fileCategory = computed(() => getFileCategory(selectedFromFormat.value));

// TEMPORARY SET IMAGE
const availableFromConversionFormats = computed(() => {
    return getAvailableOutputFormats('images', selectedToFormat.value);
});

const availableToConversionFormats = computed(() => {
    return getAvailableOutputFormats('images', selectedFromFormat.value);
});

const goToConversionPage = () => {
    if (selectedFromFormat.value && selectedToFormat.value) {
        router.push(`/converter?from=${selectedFromFormat.value}&to=${selectedToFormat.value}`);
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

.popular-conversions {
    margin: 2rem 0;
}

.conversion-list {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.conversion-card {
    padding: 1rem 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-decoration: none;
    color: #333;
    transition: background-color 0.3s;
}

.conversion-card:hover {
    background-color: #f9f9f9;
}

.benefits {
    margin: 2rem 0;
}

.benefits-list {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.benefit-card {
    max-width: 300px;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
}
</style>