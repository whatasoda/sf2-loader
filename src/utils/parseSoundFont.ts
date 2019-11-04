import { Parser } from 'sf2-parser/src/sf2-parser';
import { sf2 } from '../decls';

const KEY_LIST_TO_COLLECT = [
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

const parseSoundFont = async (source: Uint8Array) => {
  // escape from synchronous process
  await Promise.resolve();
  return parseSoundFontSync(source);
};

const parseSoundFontSync = (source: Uint8Array) => {
  const parser = new Parser(source, { parserOptions: {} });
  parser.parse();
  if (parser.input !== null) return null;

  return KEY_LIST_TO_COLLECT.reduce<Record<string, any>>((acc, key) => {
    acc[key] = parser[key];
    return acc;
  }, {}) as sf2.SoundFontData;
};

export default parseSoundFont;
