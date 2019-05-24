import * as d3 from 'd3';
import { SVG } from './svg';

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
 * The [[IMargins]] interface represents the margins of a plot.
 */
export interface IPlotMargins {
    bottom: number;
    left: number;
    right: number;
    top: number;
}

/**
 * The [[IPlotFormat]] interface represents the basic formatting
 * for the plot.
 */
export interface IPlotFormat {
    /**
     * Render a diagonal line. (default `false`).
     */
    diagonal?: boolean;
    /**
     * The height of the plot (in pixels).
     */
    height?: number;
    /**
     * The margins between the plot body and the edges of the figure.
     */
    margins?: IPlotMargins;
    /**
     * The title of the plot.
     */
    title: string;
    /**
     * The width of the plot (in pixels).
     */
    width?: number;
    /**
     * The label on the x-axis.
     */
    xlabel: string;
    /**
     * The range of values on the x-axis.
     */
    xrange?: [number, number];
    /**
     * The label on the y-axis.
     */
    ylabel: string;
    /**
     * The range of values on the y-ayis.
     */
    yrange?: [number, number];
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

    /**
     * Plot the curve as an SVG.
     *
     * @param fmt The format to use for the plot.
     * @return The beautiful plot.
     */
    public plot(fmt: IPlotFormat): SVG {
        fmt.width = fmt.width ? fmt.width : 600;
        fmt.height = fmt.height ? fmt.height : 600;
        fmt.margins = fmt.margins
            ? fmt.margins
            : {
                  bottom: 60,
                  left: 60,
                  right: 60,
                  top: 60,
              };

        const xrange = d3.extent(this.points.map(p => p.x));
        const yrange = d3.extent(this.points.map(p => p.y));

        fmt.xrange = fmt.xrange ? fmt.xrange : xrange[0] ? xrange : [0, 1];
        fmt.yrange = fmt.xrange ? fmt.xrange : yrange[0] ? yrange : [0, 1];
        fmt.diagonal = fmt.diagonal !== undefined ? fmt.diagonal : false;

        const width = fmt.width - fmt.margins.left - fmt.margins.right;
        const height = fmt.height - fmt.margins.top - fmt.margins.bottom;

        const x = d3
            .scaleLinear()
            .rangeRound([0, width])
            .domain(fmt.xrange);
        const y = d3
            .scaleLinear()
            .rangeRound([height, 0])
            .domain(fmt.yrange);

        const line = d3
            .line<IPoint>()
            .x(d => x(d.x))
            .y(d => y(d.y));

        const svg = new SVG();
        svg.handle
            .attr('title', fmt.title)
            .attr('width', fmt.width)
            .attr('height', fmt.height);

        const g = svg.handle
            .append('g')
            .attr('transform', 'translate(' + fmt.margins.left + ',' + fmt.margins.top + ')');

        g.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x))
            .append('text')
            .attr('fill', '#000000')
            .attr('font-size', '14pt')
            .attr('x', width)
            .attr('y', (7 * fmt.margins.bottom) / 8)
            .attr('text-anchor', 'end')
            .text(fmt.xlabel);

        g.append('g')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('fill', '#000000')
            .attr('font-size', '14pt')
            .attr('transform', 'rotate(-90)')
            .attr('y', (-3 * fmt.margins.left) / 4)
            .attr('text-anchor', 'end')
            .text(fmt.ylabel);

        if (fmt.diagonal) {
            g.append('path')
                .datum([{ x: 0, y: 0 }, { x: 1, y: 1 }])
                .attr('fill', 'none')
                .attr('d', line)
                .attr('stroke', '#aaaaaa')
                .attr('stroke-dasharray', '5,5');
        }

        g.append('path')
            .datum(this.points)
            .attr('fill', 'none')
            .attr('d', line)
            .attr('stroke', '#000000');

        svg.handle
            .append('text')
            .attr('font-size', '16pt')
            .attr('font-weight', 'bold')
            .attr('x', fmt.margins.left + width / 2)
            .attr('y', fmt.margins.top / 3)
            .attr('dy', '1em')
            .attr('text-anchor', 'middle')
            .text(fmt.title);

        return svg;
    }
}
