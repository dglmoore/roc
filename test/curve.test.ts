import { IPoint, Curve } from '../src/curve';

describe('construction', function() {
    test('.throws if point has length less than 2', function() {
        expect(() => {
            const points: IPoint[] = [];
            new Curve(points);
        }).toThrow(/at least two points/);

        expect(() => new Curve([{ x: 0, y: 0 }])).toThrow(/at least two points/);
    });
});

test.each`
    x              | y               | auc
    ${[0, 1]}      | ${[0, 0]}       | ${0.0}
    ${[0, 1]}      | ${[0, 1]}       | ${0.5}
    ${[0, 1]}      | ${[0, 0.5]}     | ${0.25}
    ${[0, 0]}      | ${[0, 0]}       | ${0.0}
    ${[0, 0]}      | ${[0, 1]}       | ${0.0}
    ${[0, 0, 1]}   | ${[0, 1, 1]}    | ${1.0}
    ${[0, 0, 1]}   | ${[0, 0.5, 1]}  | ${0.75}
    ${[0, 0.5, 1]} | ${[0, 0.5, 1]}  | ${0.5}
    ${[0, 0.5, 1]} | ${[0, 0.75, 1]} | ${0.625}
`('Curve with (xs=$x, ys=$y) = $auc', function({ x, y, auc }) {
    const points = x.map((x: number, i: number) => {
        return { x: x, y: y[i] };
    });
    expect(new Curve(points).auc()).toBeCloseTo(auc);
});

describe('plotting', function() {
    test('.can plot a simple line', function() {
        const svg = new Curve([{ x: 0, y: 0 }, { x: 1, y: 1 }]).plot({
            title: 'Title',
            xlabel: 'X',
            ylabel: 'Y',
        });
        expect(svg.html).not.toEqual('<svg version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>');
    });

    test('.can plot a simple line with diagonal', function() {
        const svg = new Curve([{ x: 0, y: 0 }, { x: 1, y: 1 }]).plot({
            title: 'Title',
            xlabel: 'X',
            ylabel: 'Y',
            diagonal: true,
        });
        expect(svg.html).not.toEqual('<svg version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>');
    });
});
