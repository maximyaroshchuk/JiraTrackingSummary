import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import 'primeicons/primeicons.css'
import store from './store'

import '../src/design/index.scss';

import {
    Input,
    Button,
    Select,
    SelectOption,
    ConfigProvider,
    Menu,
    Tooltip,
    Form,
    FormItem,
    Textarea,
    Checkbox
} from 'ant-design-vue';

createApp(App)
    .use(store)
    .component('Input', Input)
    .component('Button', Button)
    .component('Select', Select)
    .component('ConfigProvider', ConfigProvider)
    .component('Menu', Menu)
    .component('Tooltip', Tooltip)
    .component('Form', Form)
    .component('FormItem', FormItem)
    .component('Textarea', Textarea)
    .component('SelectOption', SelectOption)
    .component('Checkbox', Checkbox)
    .use(router)
    .mount('#app')
