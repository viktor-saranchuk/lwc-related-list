import { PROP_NAMES } from "./constants";

export const isPlainObject = (value) => {
    return (
        !!value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}

export const areArraysEqual = (arr1, arr2) => {
    if (arr1 === arr2 || (!arr1 && !arr2)) return true;
    if (!arr1 || !arr2) return false;
    if (!arr1.length && !arr2.length) return true;

    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    return set1.size === set2.size && [...set1].every(item => set2.has(item));
}

export const areFilterValuesEqual = (val1, val2) => {
    if (val1 === val2 || (!val1 && !val2) ) return true;
    if (!val1 || !val2) return false;

    if (Array.isArray(val1) && Array.isArray(val2)) {
        return areArraysEqual(val1, val2);
    }

    if (isPlainObject(val1) && isPlainObject(val2)) {
        return (
            Object.hasOwn(val1,PROP_NAMES.start) && Object.hasOwn(val2,PROP_NAMES.start) && val1[PROP_NAMES.start] === val2[PROP_NAMES.start] &&
            Object.hasOwn(val1,PROP_NAMES.end) && Object.hasOwn(val2,PROP_NAMES.end) && val1[PROP_NAMES.end] === val2[PROP_NAMES.end]
        ) || (
            Object.hasOwn(val1,PROP_NAMES.min) && Object.hasOwn(val2,PROP_NAMES.min) && val1[PROP_NAMES.min] === val2[PROP_NAMES.min] &&
            Object.hasOwn(val1,PROP_NAMES.max) && Object.hasOwn(val2,PROP_NAMES.max) && val1[PROP_NAMES.max] === val2[PROP_NAMES.max]
        )
    }

    return false;
}

export const isSet = (v) => Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined && v !== '';