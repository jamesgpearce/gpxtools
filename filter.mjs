import { Parser, Builder } from 'xml2js';
import { readFileSync, writeFileSync } from 'fs';

const parser = new Parser();
const builder = new Builder();

if (process.argv.length != 3) {
  console.error('node filter.mjs source.gpx');
  process.exit();
}

const data = readFileSync(process.argv[2], 'utf-8');

parser.parseString(data, (_, root) => {
  root.gpx.trk.forEach((trk) => {
    let previousTime;
    trk.trkseg[0].trkpt = trk.trkseg[0].trkpt.filter((trkpt) => {
      const sog = parseFloat(trkpt?.sog?.[0] ?? '1');
      delete trkpt.sog;
      delete trkpt.watertemp;
      if (trkpt.time[0] == previousTime || sog < 0.1) {
        return false;
      }
      previousTime = trkpt.time[0];
      return true;
    });
    console.log(trk.name);
    console.log(trk.trkseg[0].trkpt[0]);
    trk.desc = trk.trkseg[0]?.trkpt[0]?.time[0]?.substr(0, 10);
  });
  writeFileSync(process.argv[2], builder.buildObject(root), 'utf-8');
});
