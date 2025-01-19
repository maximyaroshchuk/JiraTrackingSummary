<template>
    <footer class="footer-wrapper">
        <div class="footer-content">
            <div class="footer-menu flex flex-wrap">
                <div class="align-self-center">
                    <div class="flex flex-wrap px-3">
                        <div class="menu-item">
                            <h5 class="text-bold-600">Company</h5>
                            <ul class="list-unstyled mb-0">
                                <li>
                                    <router-link to="/about">
                                        About Us
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/security">
                                        Security
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                        <div class="menu-item">
                            <h5 class="text-bold-600">Resources</h5>
                            <ul class="list-unstyled mb-0">
                                <li>
                                    <a href="https://status.lightconvert.app" target="_blank" rel="noopener">Status</a>
                                </li>
                            </ul>
                        </div>
                        <div class="menu-item">
                            <h5 class="text-bold-600">Legal</h5>
                            <ul class="list-unstyled mb-0">
                                <li>
                                    <router-link to="/privacy">
                                        Privacy
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/terms">
                                        Terms
                                    </router-link>
                                </li>
                                <!--                                <li>-->
                                <!--                                    <router-link to="/about#imprint">-->
                                <!--                                        Imprint-->
                                <!--                                    </router-link>-->
                                <!--                                </li>-->
                            </ul>
                        </div>
                        <div class="menu-item">
                            <h5 class="text-bold-600">Contact</h5>
                            <ul class="list-unstyled mb-0">
                                <li>
                                    <router-link to="/contact">
                                        Contact Us
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-3 text-center mr-6 mt-2 mt-md-2"><p>
                    © 2025 Strixyco <br><span class="text-muted d-none d-lg-inline d-xl-inline d-md-inline mt-1">Made in Ukraine 🇺🇦, with love ❤️  </span>
                </p></div>
            </div>
            <!--        <p class="text-center text-muted font-medium-4 my-3">-->
            <!--            We've already converted-->
            <!--            <strong><span data-v-0abbdf5a="">2,288,950,831</span>-->
            <!--                files-->
            <!--            </strong>-->
            <!--            with a total size of-->
            <!--            <strong><span data-v-0abbdf5a="">18,020</span>-->
            <!--                TB</strong>.-->
            <!--        </p>-->
            <FooterStatistics class="my-6"/>
        </div>
    </footer>
</template>

<script setup>
import FooterStatistics from "@/components/footer/FooterStatistics.vue";
</script>

