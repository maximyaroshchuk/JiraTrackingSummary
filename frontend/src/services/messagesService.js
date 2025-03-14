import {message} from "ant-design-vue";

const showToaster = async (type, content) => {
    await message[type](content);
};

export {showToaster};
