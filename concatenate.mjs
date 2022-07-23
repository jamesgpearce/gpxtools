import { Parser, Builder } from 'xml2js';
import { readFile, writeFile } from 'fs';

const parser = new Parser();
const builder = new Builder();

if (process.argv.length != 4) {
  console.error('node concatenate.mjs source.gpx destination.gpx');
  process.exit();
}

readFile(process.argv[2], (_, data) => {
  parser.parseString(data, (_, root) => {
    const trkpts = [];
    root.gpx.trk.forEach((trk) => {
      trk.trkseg.forEach((trkseg) => trkpts.push(...trkseg.trkpt));
      return {};
    });
    trkpts.sort((trkpt1, trkpt2) => {
      return trkpt1.time[0] > trkpt2.time[0] ? 1 : -1;
    });
    root.gpx.trk = [
      {
        name: [{ _: 'Combined' }],
        trkseg: [{ trkpt: trkpts }],
      },
    ];
    writeFile(process.argv[3], builder.buildObject(root), () =>
      console.log('Done')
    );
  });
});
