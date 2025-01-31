<template>
    <p>
        {{ $t('footer_statistics.convertedFiles') }}
        <span ref="totalFilesEl" class="highlight">{{ statistics.totalFiles }}</span>
        {{ $t('footer_statistics.withTotalSize') }}
        <span ref="totalSizeEl" class="highlight">{{ statistics.totalSizeTB }}</span> {{
            $t('footer_statistics.format')
        }}.
    </p>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {get} from '@/services/system/Request';
import {CountUp} from 'countup.js';

const statistics = ref({
    totalFiles: 0,
    totalSizeTB: 0,
});

const totalFilesEl = ref(null);
const totalSizeEl = ref(null);

let totalFilesCountUp, totalSizeCountUp;

const fetchStatistics = async () => {
    try {
        const response = await get('/get-statistics');
        if (response) {
            if (totalFilesCountUp) {
                totalFilesCountUp.update(response.totalFiles);
            } else {
                totalFilesCountUp = new CountUp(totalFilesEl.value, response.totalFiles, {
                    useEasing: true,
                    useGrouping: true,
                    duration: 2,
                });
                totalFilesCountUp.start();
            }

            if (totalSizeCountUp) {
                totalSizeCountUp.update(response.totalSizeTB);
            } else {
                totalSizeCountUp = new CountUp(totalSizeEl.value, response.totalSizeTB, {
                    useEasing: true,
                    useGrouping: true,
                    decimalPlaces: 2,
                    duration: 2,
                });
                totalSizeCountUp.start();
            }

            statistics.value = response;
        }
    } catch (error) {
        console.error('Failed to fetch statistics:', error);
    }
};

onMounted(() => {
    fetchStatistics();
    setInterval(fetchStatistics, 20000);
});
</script>

<style scoped>
p {
    text-align: center;
    font-size: 18px;
    margin: 20px 0;
}

.highlight {
    font-weight: bold;
    color: #1DA079;
    font-size: 20px;
}
</style>
