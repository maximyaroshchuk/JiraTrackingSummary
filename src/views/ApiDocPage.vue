<script setup>
// Логика пока не требуется
</script>

<template>
    <div class="api-docs-placeholder">
        <h1>API Documentation</h1>
        <p>We're working hard to bring you the best API experience. Please check back soon!</p>
        <div class="construction-icon">
            <i class="pi pi-cog" style="font-size: 4rem; color: #1DA079;"></i>
        </div>
        <p>In the meantime, feel free to <a href="/contact" class="api-link">contact us</a> if you have any questions.
        </p>
    </div>
</template>

<style scoped>
.api-docs-placeholder {
    text-align: center;
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #1DA079; /* Цвет бренда */
}

p {
    font-size: 1rem;
    color: #666;
    line-height: 1.5;
    margin-bottom: 1.5rem;
}

.construction-icon {
    margin: 2rem 0;
    animation: spin 4s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.api-link {
    color: #1DA079; /* Цвет бренда */
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s;
}

.api-link:hover {
    color: #168a6b; /* Темнее для hover */
}
</style>