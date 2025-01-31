<template>
    <div class="container">
        <h1 class="text-center">{{ $t('about.title') }}</h1>
        <p>
            <b>{{ $t('about.projectName') }}</b>, {{ $t('about.developedBy') }} <b>{{ $t('about.companyName') }}</b>,
            {{ $t('about.description') }}
            <Tooltip>
                <template #title>{{ $t('about.tooltipUkraine') }}</template>
                <b>{{ $t('about.ukraine') }}</b>
            </Tooltip>
            {{ $t('about.process') }}
        </p>
        <p>
            {{ $t('about.mission') }}
        </p>
        <p>
            {{ $t('about.security') }}
        </p>
        <p>
            <b>{{ $t('about.companyName') }}</b> {{ $t('about.foundation') }}
            <Tooltip>
                <template #title>{{ $t('about.tooltipUkraine') }}</template>
                <b>{{ $t('about.ukraine') }}</b>
            </Tooltip>
            {{ $t('about.values') }}
        </p>
        <p>
            {{ $t('about.focus') }}
        </p>
        <small>{{ $t('about.version') }}</small>
    </div>
</template>

<script setup lang="ts">
</script>