import { ROC } from '../src/roc';

test('.canary', () => expect(ROC).toBeDefined());

describe('construction', function() {
    test('.invalid value in fpr', function() {
        expect(() => new ROC([0, -1, 0.5], [0.1, 0.2, 0.3])).toThrow(/in the range \[0, 1\]/);
    });

    test('.invalid value in tpr', function() {
        expect(() => new ROC([0.1, 0.2, 0.3], [0, -1, 0.5])).toThrow(/in the range \[0, 1\]/);
    });

    test('.fpr has invalid endpoint', function() {
        expect(() => new ROC([0, 0.5], [0, 1])).toThrow(/last fpr value must be 1/);
        expect(() => new ROC([0.5, 1.0], [0, 1])).toThrow(/first fpr value must be 0/);
    });

    test('.tpr has invalid endpoint', function() {
        expect(() => new ROC([0, 1], [0, 0.5])).toThrow(/last tpr value must be 1/);
        expect(() => new ROC([0, 1], [0.5, 1.0])).toThrow(/first tpr value must be 0/);
    });

    test('.valid tpr and fpr', function() {
        let roc = new ROC([0, 0.5, 1.0], [0, 0.8, 1.0]);
        expect(roc.fpr).toEqual([0, 0.5, 1.0]);
        expect(roc.tpr).toEqual([0, 0.8, 1.0]);
    });
});

describe('ROC from a classification', function() {
    test('.throws if real and score have different lengths', function() {
        expect(() => ROC.curve([true, false], [0.1, 0.2, 0.3])).toThrow(/same length/);
    });

    test('.throws if no positive cases', function() {
        expect(() => ROC.curve([false], [0.1])).toThrow(/positive sample/);
        expect(() => ROC.curve([false, false], [0.1, 0.2])).toThrow(/positive sample/);
    });

    test('.throws if no negative cases', function() {
        expect(() => ROC.curve([true], [0.1])).toThrow(/negative sample/);
        expect(() => ROC.curve([true, true], [0.1, 0.2])).toThrow(/negative sample/);
    });

    test.each`
        real                          | score                   | fpr                  | tpr
        ${[false, true]}              | ${[0.1, 0.4]}           | ${[0, 0, 1]}         | ${[0, 1, 1]}
        ${[false, false, true, true]} | ${[0.0, 0.1, 0.2, 0.3]} | ${[0, 0, 0, 0.5, 1]} | ${[0, 0.5, 1, 1, 1]}
        ${[false, true, false, true]} | ${[0.1, 0.3, 0.1, 0.2]} | ${[0, 0, 0, 0.5, 1]} | ${[0, 0.5, 1, 1, 1]}
    `('.correct curve for $real and $score', function({ real, score, fpr, tpr }) {
        expect(ROC.curve(real, score)).toEqual(new ROC(fpr, tpr));
    });
});

describe('plotting', function() {
    test('.can plot an ROC curve', function() {
        const svg = ROC.curve([false, false, true, true, true], [0, 2, 1, 3, 4]).plot();
        expect(svg.html).not.toEqual('<svg version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>');
    });
});
