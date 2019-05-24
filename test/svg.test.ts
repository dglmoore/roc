import { SVG } from '../src/svg';
import * as fs from 'fs';
import { join } from 'path';

const SLOP = join(__dirname, 'slop');

function remove(path: string) {
    if (fs.existsSync(path)) {
        if (fs.lstatSync(path).isDirectory()) {
            fs.readdirSync(path).forEach(file => remove(join(path, file)));
            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }
    }
}

beforeEach(async function() {
    if (!fs.existsSync(SLOP)) {
        fs.mkdirSync(SLOP);
    }
});

afterAll(() => remove(SLOP));

test('.can construct with no content', function() {
    const svg = new SVG();
    expect(svg).toBeDefined();
    expect(svg).not.toBeNull();
    expect(svg.html).toEqual('<svg version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>');
});

test('.can construct with no svg content', function() {
    const svg = new SVG('<h1>Title</h1>');
    expect(svg).toBeDefined();
    expect(svg).not.toBeNull();
    expect(svg.html).toEqual('<svg version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>');
});

test('.can construct with svg content', function() {
    const html = '<svg version="2.0" xmlns="https://github.com/dglmoore/roc"></svg>';
    const svg = new SVG(html);
    expect(svg).toBeDefined();
    expect(svg).not.toBeNull();
    expect(svg.html).toEqual(html);
});

test('.handle modifies', function() {
    const svg = new SVG();
    expect(svg.html).toEqual('<svg version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>');

    svg.handle.append('text').text('SVG');

    expect(svg.html).toEqual('<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><text>SVG</text></svg>');
});

test('.writes', async function() {
    const filename = join(SLOP, 'empty.svg');
    await new SVG().write(filename);

    expect(fs.existsSync(filename)).toBeTruthy();

    const contents = fs.readFileSync(filename).toString('utf8');

    expect(contents).toEqual('<svg version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>');
});

test('.reads', async function() {
    const filename = join(SLOP, 'hastext.svg');

    const expected = new SVG();
    expected.handle.append('text').html('hastext');
    await expected.write(filename);
    expect(fs.existsSync(filename)).toBeTruthy();

    const got = await SVG.read(filename);
    expect(got.html).toEqual(expected.html);
});
