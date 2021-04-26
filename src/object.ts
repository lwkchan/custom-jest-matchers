// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isObject = (item: any) => {
    return !!(item && typeof item === 'object' && !Array.isArray(item));
};
