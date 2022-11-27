import { Parser, Builder } from 'xml2js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const parser = new Parser();
const builder = new Builder();

if (process.argv.length != 3) {
  console.error('node date.mjs source.gpx');
  process.exit();
}

parser.parseString(readFileSync(process.argv[2], 'utf-8'), (_, root) =>
  root.gpx.trk.forEach((trk) => {
    const name = trk.name[0];
    if (!/^\d\d\d\d-\d\d-\d\d/.test(name)) {
      trk.name[0] = `0000-00-00 ${name}`;
    }
    writeFileSync(process.argv[2], builder.buildObject(root), 'utf-8');
  })
);
