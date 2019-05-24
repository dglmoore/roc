import { Curve, IPlotFormat } from './curve';
import { SVG } from './svg';
import * as util from './util';

/**
 * The [[ROC]] class represents a receiver operating characteristic curve.
 */
export class ROC extends Curve {
    /**
     * Create an [[ROC]] curve from a binary classification.
     *
     * @param real Real binary labels
     * @param score Target scores
     * @throws `Error` if `real` and `score` have different lengths
     * @throws `Error` if `real` has no `true` labels
     * @throws `Error` if `real` has no `false` labels
     * @returns A computed ROC curve.
     */
    public static curve(real: boolean[], score: number[]): ROC {
        if (real.length !== score.length) {
            throw new Error('real and score must have the same length');
        } else if (util.allTrue(real)) {
            throw new Error('must have at least one negative sample');
        } else if (util.allFalse(real)) {
            throw new Error('must have at least one positive sample');
        }

        const perm = util.argsort(score).reverse();
        const layers = util.applyperm(real, perm).map(x => +x);
        score = util.applyperm(score, perm);

        const tps = [0].concat(util.cumsum(layers));
        const fps = [0].concat(util.cumsum(layers.map(x => 1 - x)));

        const p = tps[tps.length - 1];
        const f = fps[fps.length - 1];

        const fpr: number[] = fps.map(fp => fp / f);
        const tpr: number[] = tps.map(tp => tp / p);

        return new ROC(fpr, tpr);
    }

    /**
     * Increasing false positive rates.
     */
    public get fpr(): number[] {
        return this.points.map(p => p.x);
    }

    /**
     * Increasing true positive rates.
     */
    public get tpr(): number[] {
        return this.points.map(p => p.y);
    }

    /**
     * Construct an [[ROC]] curve from a false positive and true positive rates.
     *
     * @param fpr Increasing false positive rates
     * @param tpr Increasing true positive rates
     * @throws `Error` if `fpr` or `tpr` does not start with `0`
     * @throws `Error` if `fpr` or `tpr` does not end with `1`
     * @throws `Error` if `fpr` or `tpr` has a value outside the range `[0,1]`
     */
    constructor(fpr: number[], tpr: number[]) {
        if (fpr.some(x => x < 0 || x > 1)) {
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

        super(
            fpr.map((x, i) => {
                return { x, y: tpr[i] };
            }),
        );
    }

    /**
     * Plot the curve as an SVG.
     *
     * @param fmt The format to use for the plot.
     * @return The beautiful plot.
     */
    public plot(format?: IPlotFormat): SVG {
        const fmt: IPlotFormat = Object.assign(
            {
                diagonal: true,
                title: 'ROC',
                xlabel: 'FPR',
                xrange: [0, 1],
                ylabel: 'TPR',
                yrange: [0, 1],
            },
            format,
        );

        return super.plot(fmt);
    }
}
