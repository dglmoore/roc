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
     */
    constructor(x: number[], y: number[]) {
        if (x.length !== y.length) {
            throw new Error('fpr and tpr must have the same length');
        }
        this.x = x;
        this.y = y;
    }
}
