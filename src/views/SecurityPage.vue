<template>
    <div class="container">
        <h1 class="text-center" v-html="$t('security.title')"></h1>

        <p v-html="$t('security.introduction.content')"></p>

        <div class="p-grid p-align-start">
            <div class="p-col-12 p-md-4">
                <h3 class="text-center">
                    <i :class="$t('security.features.dataEncryption.icon')"></i>
                    {{ $t('security.features.dataEncryption.title') }}
                </h3>
                <p v-html="$t('security.features.dataEncryption.content')"></p>
            </div>

            <div class="p-col-12 p-md-4">
                <h3 class="text-center">
                    <i :class="$t('security.features.privacyProtection.icon')"></i>
                    {{ $t('security.features.privacyProtection.title') }}
                </h3>
                <p v-html="$t('security.features.privacyProtection.content')"></p>
            </div>

            <div class="p-col-12 p-md-4">
                <h3 class="text-center">
                    <i :class="$t('security.features.regulatoryCompliance.icon')"></i>
                    {{ $t('security.features.regulatoryCompliance.title') }}
                </h3>
                <p v-html="$t('security.features.regulatoryCompliance.content')"></p>
            </div>
        </div>

        <p class="text-center" v-html="$t('security.commitment.content')"></p>

        <h3 class="text-center" v-html="$t('security.securityFeatures.title')"></h3>
        <ul v-html="$t('security.securityFeatures.features')">
        </ul>

        <p v-html="$t('security.conclusion.content')"></p>

        <div class="flex justify-content-center mt-6">
            <Button type="link" download href="/docs/LightConvert%20Security.pdf">
                {{ $t('security.downloadOriginalFileText') }}
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>

.p-grid {
    margin-top: 30px;
}

.p-md-4 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

i {
    font-size: 1rem;
    margin-right: 10px;
}

ul {
    list-style-type: disc;
    padding-left: 20px;
    margin-top: 20px;
}
</style>
