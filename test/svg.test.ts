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

test('.can construct', function() {
    const svg = new SVG();
    expect(svg).toBeDefined();
    expect(svg).not.toBeNull();
    expect(svg.html).toEqual('<svg version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>');
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
