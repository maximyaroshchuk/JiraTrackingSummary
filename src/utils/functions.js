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