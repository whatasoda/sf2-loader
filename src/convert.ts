import parseSoundFont from './utils/parseSoundFont';
import generateMIDI from './utils/generateMIDI';
import applySoundFont from './utils/applySoundFont';
import { ConverterOptions } from './decls';

const convert = async (source: Buffer, resourcePath: string, options: ConverterOptions = {}) => {
  const data = await parseSoundFont(source);
  if (!data) throw new Error(`Failed parsing soundfont: ${resourcePath}`);

  const midiList = generateMIDI(data);
  const promises = midiList.map(async ({ name, midi }) => {
    const dataurl = await applySoundFont(midi, resourcePath, options);
    return [name, dataurl] as const;
  });

  const entries = await Promise.all(promises);
  const contentObj = entries.reduce<Record<string, string>>((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
  return contentObj;
};

export default convert;
