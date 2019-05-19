/**
 * The [[Curve]] class represents a generic 2-dimensional curve.
 */
export class Curve {
    /**
     * The x-coordinates of the points of the curve.
     */
    public x: number[];
    /**
     * The y-coordinates of the points of the curve.
     */
    public y: number[];

    /**
     * Construct a [[Curve]] from x- and y-coordinates.
     *
     * @param x the x-coordinates in increasing order
     * @param y the y-coordinates
     * @throws `Error` if `x` or `y` has fewer than 2 elements
     * @throws `Error` if `x` and `y` have different lengths
     */
    constructor(x: number[], y: number[]) {
        if (x.length < 2) {
            throw new Error('x-coordinates must have at least two elements');
        } else if (y.length < 2) {
            throw new Error('y-coordinates must have at least two elements');
        } else if (x.length !== y.length) {
            throw new Error('x and y must have the same length');
        }

        this.x = x;
        this.y = y;
    }

    /**
     * Compute the area under the curve (AUC) using the trapzoidal rule.
     */
    public auc(): number {
        let auc: number = 0;
        for (let i = 0, len = this.x.length; i < len - 1; ++i) {
            const dx = this.x[i + 1] - this.x[i];
            const f = this.y[i] + this.y[i + 1];
            auc += 0.5 * f * dx;
        }
        return auc;
    }
}
