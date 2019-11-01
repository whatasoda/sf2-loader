import webpack from 'webpack';
import { Parser } from 'sf2-parser/src/sf2-parser';
import { isBuffer } from 'util';
import { sf2 } from './decls';

const EXPECTED_DATA_KEY = [
  'samplingData',
  'presetHeader',
  'presetZone',
  'presetZoneModulator',
  'presetZoneGenerator',
  'instrument',
  'instrumentZone',
  'instrumentZoneModulator',
  'instrumentZoneGenerator',
  'sample',
  'sampleHeader',
] as const;

const loader: webpack.loader.Loader = function(source) {
  if (!isBuffer(source)) throw new Error();
  const callback = this.async();
  if (!callback) return;

  (async () => {
    const data = await extractSoundfontData(source);
    if (!data) {
      callback(new Error());
    } else {
      callback(null, generate(data));
    }
  })();
};
loader.raw = true;

const extractSoundfontData = async (source: Uint8Array) => {
  await Promise.resolve();
  return extractSoundfontDataSync(source);
};

const extractSoundfontDataSync = (source: Uint8Array) => {
  const parser = new Parser(source, { parserOptions: {} });
  parser.parse();
  if (parser.input !== null) return null;

  return EXPECTED_DATA_KEY.reduce<Record<string, any>>((acc, key) => {
    acc[key] = parser[key];
    return acc;
  }, {}) as sf2.SoundFontData;
};

const generate = ({ sample, ...data }: sf2.SoundFontData) => {
  const sampleBase64 = sample.map((item) => Buffer.from(item).toString('base64'));
  const dataString = JSON.stringify({ sample: sampleBase64, ...data });
  return `module.exports=${dataString}`;
};

export = loader;
