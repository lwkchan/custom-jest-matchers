/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isObject = (item: any) => {
    return !!(item && typeof item === 'object' && !Array.isArray(item));
};
