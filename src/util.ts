/**
 * Returns the indices that would sort a numeric array.
 */
export function argsort(data: number[]): number[] {
    return data
        .map((x, i) => [x, i])
        .sort((a, b) => (a[0] < b[0] ? -1 : a[0] === b[0] ? 0 : 1))
        .map(x => x[1]);
}

/**
 * Applies a permutation to a copy of an array.
 */
export function applyperm<T>(data: T[], perm: number[]): T[] {
    return perm.map(i => data[i]);
}

/**
 * Returns the cumulative sumve of the elements of a numeric array.
 */
export function cumsum(data: number[]): number[] {
    let acc: number = 0;
    return data.map(x => (acc += x));
}

/**
 * Determines if all of the values of a boolean array are `true`.
 */
export function allTrue(data: boolean[]): boolean {
    return data.every(x => x);
}

/**
 * Determines if all of the values of a boolean array are `false`.
 */
export function allFalse(data: boolean[]): boolean {
    return data.every(x => !x);
}
