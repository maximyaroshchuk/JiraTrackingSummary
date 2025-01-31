<template>
    <div class="container">
        <h1 class="text-center" v-html="$t('privacy.title')"></h1>
        <div class="privacy-section">
            <h3>1. {{ $t('privacy.introduction.title') }}</h3>
            <p v-html="$t('privacy.introduction.purpose')"></p>
            <p v-html="$t('privacy.introduction.scope')"></p>

            <div class="mt-4">
                <h3>2. {{ $t('privacy.dataCollection.title') }}</h3>
                <p v-html="$t('privacy.dataCollection.personalData')"></p>
                <p v-html="$t('privacy.dataCollection.nonPersonalData')"></p>
            </div>

            <div class="mt-4">
                <h3>3. {{ $t('privacy.dataCollectionMethods.title') }}</h3>
                <p v-html="$t('privacy.dataCollectionMethods.direct')"></p>
                <p v-html="$t('privacy.dataCollectionMethods.automated')"></p>
                <p v-html="$t('privacy.dataCollectionMethods.thirdParty')"></p>
            </div>

            <div class="mt-4">
                <h3>4. {{ $t('privacy.dataUsage.title') }}</h3>
                <p v-html="$t('privacy.dataUsage.serviceProvision')"></p>
                <p v-html="$t('privacy.dataUsage.analyticsImprovement')"></p>
                <p v-html="$t('privacy.dataUsage.marketing')"></p>
                <p v-html="$t('privacy.dataUsage.legalCompliance')"></p>
            </div>

            <div class="mt-4">
                <h3>5. {{ $t('privacy.dataRetention.title') }}</h3>
                <p v-html="$t('privacy.dataRetention.storageDuration')"></p>
                <p v-html="$t('privacy.dataRetention.dataDeletion')"></p>
                <p v-html="$t('privacy.dataRetention.fileDeletionPolicy')"></p>
            </div>

            <div class="mt-4">
                <h3>6. {{ $t('privacy.dataSecurity.title') }}</h3>
                <p v-html="$t('privacy.dataSecurity.encryption')"></p>
                <p v-html="$t('privacy.dataSecurity.accessControl')"></p>
                <p v-html="$t('privacy.dataSecurity.breachResponse')"></p>
            </div>

            <div class="mt-4">
                <h3>7. {{ $t('privacy.cookies.title') }}</h3>
                <p v-html="$t('privacy.cookies.usage')"></p>
                <ul>
                    <li v-html="$t('privacy.cookies.types.essential')"></li>
                    <li v-html="$t('privacy.cookies.types.analytical')"></li>
                    <li v-html="$t('privacy.cookies.types.marketing')"></li>
                </ul>
                <p v-html="$t('privacy.cookies.optOut')"></p>
            </div>

            <div class="mt-4">
                <h3>8. {{ $t('privacy.dataSharing.title') }}</h3>
                <p v-html="$t('privacy.dataSharing.partners')"></p>
                <p v-html="$t('privacy.dataSharing.legalObligations')"></p>
                <p v-html="$t('privacy.dataSharing.internationalTransfers')"></p>
            </div>

            <div class="mt-4">
                <h3>9. {{ $t('privacy.userRights.title') }}</h3>
                <p v-html="$t('privacy.userRights.access')"></p>
                <p v-html="$t('privacy.userRights.portability')"></p>
                <p v-html="$t('privacy.userRights.erasure')"></p>
                <p v-html="$t('privacy.userRights.withdrawal')"></p>
            </div>

            <div class="mt-4">
                <h3>10. {{ $t('privacy.childrenPrivacy.title') }}</h3>
                <p v-html="$t('privacy.childrenPrivacy.ageRestrictions')"></p>
                <p v-html="$t('privacy.childrenPrivacy.parentalConsent')"></p>
            </div>

            <div class="mt-4">
                <h3>11. {{ $t('privacy.policyChanges.title') }}</h3>
                <p v-html="$t('privacy.policyChanges.notification')"></p>
                <p v-html="$t('privacy.policyChanges.versioning')"></p>
            </div>

            <div class="mt-4">
                <h3>12. {{ $t('privacy.contact.title') }}</h3>
                <p v-html="$t('privacy.contact.inquiries')"></p>
                <ul>
                    <li v-html="$t('privacy.contact.email')"></li>
                </ul>
            </div>

            <div class="mt-4">
                <h3>13. {{ $t('privacy.governingLaw.title') }}</h3>
                <p v-html="$t('privacy.governingLaw.jurisdiction')"></p>
            </div>
        </div>
        <div class="flex justify-content-center mt-6">
            <Button type="link" download href="/docs/LightConvert%20Privacy%20Policy.pdf">
                <span v-html="$t('privacy.downloadOriginalFileText')"></span>
            </Button>
        </div>
    </div>
</template>

<style scoped>
.privacy-section {
    margin-top: 20px;
}

h3 {
    font-size: 1.2rem;
    margin-top: 10px;
}

p {
    font-size: 1rem;
    margin-bottom: 15px;
}

ul {
    margin-bottom: 15px;
    padding-left: 20px;
    list-style: none;
}
</style>

<script setup lang="ts">
</script>