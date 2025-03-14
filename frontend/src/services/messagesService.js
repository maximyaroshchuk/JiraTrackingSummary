import { notification } from 'ant-design-vue';

const showToaster = (type, content) => {
    notification[type]({
        message: type.charAt(0).toUpperCase() + type.slice(1),
        description: content,
        placement: 'topRight',
        duration: 4,
    });
};

export { showToaster };