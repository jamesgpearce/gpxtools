import { Parser, Builder } from 'xml2js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const parser = new Parser();
const builder = new Builder();

if (process.argv.length != 4) {
  console.error('node split.mjs source.gpx directory');
  process.exit();
}

parser.parseString(readFileSync(process.argv[2], 'utf-8'), (_, root) =>
  root.gpx.trk.forEach((trk) => {
    const name = trk.name[0];
    const clone = {
      gpx: {
        $: {
          xmlns: 'http://www.topografix.com/GPX/1/1',
          version: '1.1',
          creator: 'gpxtools',
        },
        metadata: {
          time: new Date().toISOString(),
          depthunits: 'meters',
          tempunits: 'F',
          sogunits: 'm/s',
        },
        trk,
      },
    };
    writeFileSync(
      resolve(
        process.argv[3],
        `${name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.gpx`
      ),
      builder.buildObject(clone),
      'utf-8'
    );
  })
);
