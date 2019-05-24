/**
 * The [[IPoint]] interface represents a point in 2-dimensions.
 */
export interface IPoint {
    /**
     * The x-coordinate of the point.
     */
    x: number;

    /**
     * The y-coordinate of the point.
     */
    y: number;
}

/**
 * The [[Curve]] class represents a generic 2-dimensional curve.
 */
export class Curve {
    public points: IPoint[];

    /**
     * Construct a [[Curve]] from an array of [[IPoint]] objects.
     *
     * @param points An array of points
     * @throws `Error` if `points` has fewer than two points
     */
    constructor(points: IPoint[]) {
        if (points.length < 2) {
            throw new Error('curve must have at least two points');
        }
        this.points = points;
    }

    /**
     * Compute the area under the curve (AUC) using the trapzoidal rule.
     */
    public auc(): number {
        let auc: number = 0;
        for (let i = 0, len = this.points.length; i < len - 1; ++i) {
            const a = this.points[i];
            const b = this.points[i + 1];
            auc += 0.5 * (a.y + b.y) * (b.x - a.x);
        }
        return auc;
    }
}
