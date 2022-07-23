import { Parser, Builder } from 'xml2js';
import { readFile, writeFile } from 'fs';

const parser = new Parser();
const builder = new Builder();

if (process.argv.length != 4) {
  console.error('node filter.mjs source.gpx destination.gpx');
  process.exit();
}

readFile(process.argv[2], (_, data) => {
  parser.parseString(data, (_, root) => {
    root.gpx.trk.forEach((trk) =>
      trk.trkseg.forEach(
        (trkseg) =>
          (trkseg.trkpt = trkseg.trkpt.filter((trkpt) => {
            const sog = parseInt(trkpt?.sog?.[0] ?? '0');
            delete trkpt.sog;
            delete trkpt.watertemp;
            return sog > 0.25; // 0.5 knt
          }))
      )
    );
    writeFile(process.argv[3], builder.buildObject(root), () =>
      console.log('Done')
    );
  });
});
