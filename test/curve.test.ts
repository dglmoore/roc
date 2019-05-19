import { Curve } from '../src/curve';

describe('construction', function() {
    test('.x has length less than 2', function() {
        expect(() => new Curve([], [0, 1])).toThrow(/at least two elements/);
        expect(() => new Curve([0], [0, 1])).toThrow(/at least two elements/);
    });

    test('.y has length less than 2', function() {
        expect(() => new Curve([0, 1], [])).toThrow(/at least two elements/);
        expect(() => new Curve([0, 1], [0])).toThrow(/at least two elements/);
    });

    test('.x and y have different lengths', function() {
        expect(() => new Curve([0.0, 1.0], [0.0, 0.2, 1.0])).toThrow(/same length/);
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
`('Curve($x, $y) = $auc', function({ x, y, auc }) {
    expect(new Curve(x, y).auc()).toBeCloseTo(auc);
});
