import * as d3 from 'd3';
import { promises as fs } from 'fs';
import * as jsdom from 'jsdom';

/**
 * The [[SVG]] class encapsulates a [jsdom](https://github.com/jsdom/jsdom)-based
 * SVG element.
 */
export class SVG {
    /**
     * Read an SVG from a file.
     *
     * @param filename The filename of the file from which to read.
     * @return A promise which resolve to an SVG with the file contents.
     */
    public static read(filename: string): Promise<SVG> {
        return fs.readFile(filename).then(b => new SVG(b.toString('utf8')));
    }

    /**
     * The SVG's d3 selection.
     */
    private svg: d3.Selection<SVGSVGElement, {}, null, undefined>;

    /**
     * Construct a new [[SVG]] instance with optional content.
     *
     * @param body Optional DOM body content
     */
    constructor(body?: string) {
        body = body ? body : '';
        const dom = new jsdom.JSDOM(body);
        const doc = d3.select(dom.window.document);

        this.svg = doc.select('body').select('svg');
        if (this.svg.size() === 0) {
            this.svg = doc
                .select('body')
                .append('svg')
                .attr('version', 1.1)
                .attr('xmlns', 'http://www.w3.org/2000/svg');
        }
    }

    /**
     * Get the HTML representation of the [[SVG]] as a `string`.
     */
    get html(): string {
        const node = this.svg.node();
        return node ? node.outerHTML : '';
    }

    /**
     * Get a [d3](https://d3js.org) selection which can be modified using the
     * standard methods provided by `d3`.
     */
    get handle() {
        return this.svg;
    }

    /**
     * Write the contents of the [[SVG]] to a file.
     *
     * @param filename The filename to which to write.
     * @return A promise which resolves once the file has been written.
     */
    public write(filename: string): Promise<void> {
        return fs.writeFile(filename, this.html);
    }
}
