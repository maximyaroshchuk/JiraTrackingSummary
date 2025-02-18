import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import {
    Spin,
    Button,
    ConfigProvider,
} from 'ant-design-vue';

createApp(App).mount('#app')

createApp(App)
    .component('Spinner', Spin)
    .component('Button', Button)
    .component('ConfigProvider', ConfigProvider)
    .mount('#app')
