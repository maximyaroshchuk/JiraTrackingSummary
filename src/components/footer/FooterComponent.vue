<template>
    <footer class="footer-wrapper">
        <div class="footer-content">
            <div class="footer-menu flex flex-wrap">
                <div class="first align-self-center">
                    <div class="flex flex-wrap px-3">
                        <div class="menu-item">
                            <h5 class="text-bold-600">{{ $t('footer.company.title') }}</h5>
                            <ul class="list-unstyled mb-0">
                                <li>
                                    <router-link to="/about">
                                        {{ $t('footer.company.aboutUs') }}
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/security">
                                        {{ $t('footer.company.security') }}
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                        <div class="menu-item">
                            <h5 class="text-bold-600">{{ $t('footer.resources.title') }}</h5>
                            <ul class="list-unstyled mb-0">
                                <li>
                                    <a href="https://status.lightconvert.app" target="_blank" rel="noopener">
                                        {{ $t('footer.resources.status') }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="menu-item">
                            <h5 class="text-bold-600">{{ $t('footer.legal.title') }}</h5>
                            <ul class="list-unstyled mb-0">
                                <li>
                                    <router-link to="/privacy">
                                        {{ $t('footer.legal.privacy') }}
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/terms">
                                        {{ $t('footer.legal.terms') }}
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                        <div class="menu-item">
                            <h5 class="text-bold-600">{{ $t('footer.contact.title') }}</h5>
                            <ul class="list-unstyled mb-0">
                                <li>
                                    <router-link to="/contact">
                                        {{ $t('footer.contact.contactUs') }}
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="second">
                    <p>
                        © 2025 Strixyco <br>
                        <span class="text-muted d-none d-lg-inline d-xl-inline d-md-inline mt-1">
                            {{ $t('footer.madeInUkraine') }}
                        </span>
                    </p>
                </div>
            </div>
            <FooterStatistics class="my-6"/>
        </div>
    </footer>
</template>

<script setup>
import FooterStatistics from "@/components/footer/FooterStatistics.vue";
</script>
