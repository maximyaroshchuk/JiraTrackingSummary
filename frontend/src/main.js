import { createApp } from 'vue'
import './style.css'
import router from './router'
import pinia from './store';
import piniaPersist from 'pinia-plugin-persistedstate';
import App from './App.vue'

import {
    Spin,
    Button,
    ConfigProvider,
    Layout,
    LayoutContent,
    PageHeader,
    Card,
    Descriptions,
    DescriptionsItem,
    Form,
    FormItem,
    Input,
    Space,
    Row,
    Col,
    Avatar,
    Table,
    Tooltip,
    DatePicker
} from 'ant-design-vue';
import {setRouter} from "./services/system/RouterService.js";

createApp(App).mount('#app')
pinia.use(piniaPersist);

createApp(App)
    .component('Spinner', Spin)
    .component('Button', Button)
    .component('ConfigProvider', ConfigProvider)
    .component('TSLayout', Layout)
    .component('TSLayoutContent', LayoutContent)
    .component('TSPageHeader', PageHeader)
    .component('TSCard', Card)
    .component('TSDescriptions', Descriptions)
    .component('TSDescriptionsItem', DescriptionsItem)
    .component('TSForm', Form)
    .component('TSFormItem', FormItem)
    .component('TSInput', Input)
    .component('TSSpace', Space)
    .component('TSRow', Row)
    .component('TSCol', Col)
    .component('TSTable', Table)
    .component('TSAvatar', Avatar)
    .component('TSTooltip', Tooltip)
    .component('TSDatePicker', DatePicker)
    .use(router)
    .use(pinia)
    .mount('#app')

setRouter(router);