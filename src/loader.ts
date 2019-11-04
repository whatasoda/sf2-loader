import webpack from 'webpack';
import { isBuffer } from 'util';
import parseSoundFont from './utils/parseSoundFont';
import generateMIDI from './utils/generateMIDI';
import applySoundFont from './utils/applySoundFont';

const loader: webpack.loader.Loader = function(source, sourceMap) {
  if (!isBuffer(source)) throw new Error();
  const callback = this.async();
  if (!callback) return;

  const soundfont = this.resourcePath;

  (async () => {
    const data = await parseSoundFont(source);
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
    callback(null, content, sourceMap);
  })();
};
loader.raw = true;

export = loader;
