<template>
    <div class="container">
        <h1 class="text-center" v-html="$t('terms.title')"></h1>
        <div class="terms-section">
            <h3>1. {{ $t('terms.introduction.title') }}</h3>
            <p v-html="$t('terms.introduction.content')"></p>

            <div class="mt-4">
                <h3>2. {{ $t('terms.eligibility.title') }}</h3>
                <p v-html="$t('terms.eligibility.content')"></p>
            </div>

            <div class="mt-4">
                <h3>3. {{ $t('terms.description.title') }}</h3>
                <p v-html="$t('terms.description.content')"></p>
            </div>

            <div class="mt-4">
                <h3>4. {{ $t('terms.responsibilities.title') }}</h3>
                <p v-html="$t('terms.responsibilities.content')"></p>
            </div>

            <div class="mt-4">
                <h3>5. {{ $t('terms.intellectualProperty.title') }}</h3>
                <p v-html="$t('terms.intellectualProperty.yourContent')"></p>
                <p v-html="$t('terms.intellectualProperty.ourContent')"></p>
            </div>

            <div class="mt-4">
                <h3>6. {{ $t('terms.prohibitedActivities.title') }}</h3>
                <h3 v-html="$t('terms.prohibitedActivities.title')"></h3>
                <p v-html="$t('terms.prohibitedActivities.content')"></p>
            </div>

            <div class="mt-4">
                <h3>7. {{ $t('terms.fileStorage.title') }}</h3>
                <p v-html="$t('terms.fileStorage.content')"></p>
            </div>

            <div class="mt-4">
                <h3>8. {{ $t('terms.limitationOfLiability.title') }}</h3>
                <p v-html="$t('terms.limitationOfLiability.content')"></p>
            </div>

            <div class="mt-4">
                <h3>9. {{ $t('terms.indemnification.title') }}</h3>
                <p v-html="$t('terms.indemnification.content')"></p>
            </div>

            <div class="mt-4">
                <h3>10. {{ $t('terms.termination.title') }}</h3>
                <p v-html="$t('terms.termination.content')"></p>
            </div>

            <div class="mt-4">
                <h3>11. {{ $t('terms.changesToTerms.title') }}</h3>
                <p v-html="$t('terms.changesToTerms.content')"></p>
            </div>

            <div class="mt-4">
                <h3>12. {{ $t('terms.governingLaw.title') }}</h3>
                <p v-html="$t('terms.governingLaw.content')"></p>
            </div>

            <div class="mt-4">
                <h3>13. {{ $t('terms.contactInfo.title') }}</h3>
                <p v-html="$t('terms.contactInfo.content')"></p>
            </div>

            <div class="mt-4">
                <h3>14. {{ $t('terms.entireAgreement.title') }}</h3>
                <p v-html="$t('terms.entireAgreement.content')"></p>
            </div>

            <div class="mt-4">
                <h3>15. {{ $t('terms.severability.title') }}</h3>
                <p v-html="$t('terms.severability.content')"></p>
            </div>

            <div class="mt-4">
                <h3>16. {{ $t('terms.waiver.title') }}</h3>
                <p v-html="$t('terms.waiver.content')"></p>
            </div>

            <div class="mt-4">
                <h3>17. {{ $t('terms.assignment.title') }}</h3>
                <p v-html="$t('terms.assignment.content')"></p>
            </div>

            <div class="mt-4">
                <h3>18. {{ $t('terms.thirdPartyServices.title') }}</h3>
                <p v-html="$t('terms.thirdPartyServices.content')"></p>
            </div>

            <div class="mt-4">
                <h3>19. {{ $t('terms.betaFeatures.title') }}</h3>
                <p v-html="$t('terms.betaFeatures.content')"></p>
            </div>

            <div class="mt-4">
                <h3>20. {{ $t('terms.feedback.title') }}</h3>

                <p v-html="$t('terms.feedback.content')"></p>
            </div>
        </div>
        <div class="flex justify-content-center mt-6">
            <Button type="link" download href="/docs/LightConvert%20Terms%20of%20Use.pdf">
                {{ $t('terms.downloadOriginalFileText') }}
            </Button>
        </div>
    </div>
</template>

<style scoped>
.terms-section {
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