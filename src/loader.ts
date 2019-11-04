import webpack from 'webpack';
import { Parser } from 'sf2-parser/src/sf2-parser';
import { isBuffer } from 'util';
import { sf2 } from './decls';
import generateMIDI from './utils/generateMIDI';
import applySoundFont from './utils/applySoundFont';

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

  const soundfont = this.resourcePath;

  (async () => {
    const data = await extractSoundfontData(source);
    if (!data) return callback(new Error());

    const midiList = generateMIDI(data);
    const promises = midiList.map(async ({ name, midi }) => {
      const dataurl = await applySoundFont(midi, soundfont);
      return [name, dataurl] as const;
    });

    const entries = await Promise.all(promises);
    const contentJson = entries.reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
    const content = `module.exports=JSON.parse(${JSON.stringify(contentJson)})`;
    callback(null, content);
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

export = loader;
