import {useRouteKeyStore} from '@/store/system/refreshRouteKey';

/**
 * Check if var is empty. Analog PHP function empty()
 * This function does not check the object. The object will always be non-empty.
 * Use the @emptyObject function to validate the object correctly
 *
 * @param variable
 * @param checkObject
 * @returns {boolean}
 */
export function empty(variable, checkObject = false) {
    let emptyObject = false;
    if (checkObject) {
        emptyObject = variable instanceof Object && Object.keys(variable).length === 0;
    }
    return (
        variable === undefined
        || variable === ''
        || variable === 0
        || variable === '0'
        || variable === null
        || variable === false
        || (variable instanceof Array && variable.length === 0)
        || emptyObject
    );
}

/**
 *
 * @param func
 * @param delay
 * @returns {(function(...[*]): void)|*}
 */
export function debounce(func, delay) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

/**
 * Global method to refresh the route view by updating the route key.
 * This method triggers the route to re-render by refreshing the route view key.
 */
export function refreshRoute() {
    const routeKeyStore = useRouteKeyStore();
    routeKeyStore.refreshRoute();
}

/**
 * Global method to refresh the page data.
 * This method triggers the load data.
 */
export function refreshPageData(callback) {
    callback()
}


export function getContrastYIQ(hexColor) {
    console.log('hexColor', hexColor)
    if (!hexColor) return "text-gray-900";
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    console.log(yiq >= 128)
    return yiq >= 128 ? "text-gray-900" : "text-white";
}

export async function compressImage(base64Image) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Image;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxWidth = 800;
            const maxHeight = 600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/png', 0.7);
            resolve(compressedBase64);
        };
    });
};