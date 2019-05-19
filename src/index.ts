function argsort(data: number[]): number[] {
    return data
        .map((x, i) => [x, i])
        .sort((a, b) => (a[0] < b[0] ? -1 : a[0] === b[0] ? 0 : 1))
        .map(x => x[1]);
}

function applysort<T>(data: T[], perm: number[]): T[] {
    return perm.map(i => data[i]);
}

function cumsum(data: number[]): number[] {
    let acc: number = 0;
    return data.map(x => (acc += x));
}

function all(data: boolean[]): boolean {
    return data.every(x => x);
}

function none(data: boolean[]): boolean {
    return data.every(x => !x);
}

export class ROC {
    public static curve(real: boolean[], score: number[]): ROC {
        if (real.length !== score.length) {
            throw new Error('real and score must have the same length');
        } else if (all(real)) {
            throw new Error('must have at least one negative sample');
        } else if (none(real)) {
            throw new Error('must have at least one positive sample');
        }

        const perm = argsort(score).reverse();
        const layers = applysort(real, perm).map(x => +x);
        score = applysort(score, perm);

        const tps = [0].concat(cumsum(layers));
        const fps = [0].concat(cumsum(layers.map(x => 1 - x)));

        const p = tps[tps.length - 1];
        const f = fps[fps.length - 1];

        const fpr: number[] = fps.map(fp => fp / f);
        const tpr: number[] = tps.map(tp => tp / p);

        return new ROC(fpr, tpr);
    }

    public fpr: number[];
    public tpr: number[];

    constructor(fpr: number[], tpr: number[]) {
        if (fpr.length < 2) {
            throw new Error('fpr must have at least two elements');
        } else if (tpr.length < 2) {
            throw new Error('tpr must have at least two elements');
        } else if (fpr.length !== tpr.length) {
            throw new Error('fpr and tpr must have the same length');
        } else if (fpr.some(x => x < 0 || x > 1)) {
            throw new Error('fpr values must be in the range [0, 1]');
        } else if (tpr.some(x => x < 0 || x > 1)) {
            throw new Error('tpr values must be in the range [0, 1]');
        } else if (fpr[0] !== 0) {
            throw new Error(`first fpr value must be 0`);
        } else if (fpr[fpr.length - 1] !== 1) {
            throw new Error('last fpr value must be 1');
        } else if (tpr[0] !== 0) {
            throw new Error('first tpr value must be 0');
        } else if (tpr[tpr.length - 1] !== 1) {
            throw new Error('last tpr value must be 1');
        }
        this.fpr = fpr;
        this.tpr = tpr;
    }
}
