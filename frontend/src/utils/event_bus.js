import {ref} from 'vue';

const listeners = ref({});

export const clockyco_event_bus = {
    $on(event, callback) {
        if (!listeners.value[event]) {
            listeners.value[event] = [];
        }
        listeners.value[event].push(callback);
    },
    $off(event, callback) {
        if (!listeners.value[event]) {
            return;
        }
        if (!callback) {
            delete listeners.value[event];
        } else {
            listeners.value[event] = listeners.value[event].filter((cb) => cb !== callback);
            if (listeners.value[event].length === 0) {
                delete listeners.value[event];
            }
        }
    },
    $emit(event, ...args) {
        if (listeners.value[event]) {
            listeners.value[event].forEach((callback) => callback(...args));
        }
    },
};