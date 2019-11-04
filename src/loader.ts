import webpack from 'webpack';
import { isBuffer } from 'util';
import parseSoundFont from './utils/parseSoundFont';
import generateMIDI from './utils/generateMIDI';
import applySoundFont from './utils/applySoundFont';
import { getOptions } from 'loader-utils';
import validate from 'schema-utils';
import { LoaderOptions } from './decls';

const schema: Parameters<typeof validate>[0] = {
  type: 'object',
  required: ['bitrate'],
  properties: {
    bitrate: { type: 'number' },
    resample: { type: 'number' },
  },
  additionalProperties: false,
};

const loader: webpack.loader.Loader = function(source, sourceMap) {
  if (!isBuffer(source)) throw new Error();
  const options = getOptions(this) as LoaderOptions;
  validate(schema, options, { name: 'Sf2 Loader' });

  const callback = this.async();
  if (!callback) return;

  const soundfont = this.resourcePath;

  (async () => {
    const data = await parseSoundFont(source);
    if (!data) return callback(new Error());

    const midiList = generateMIDI(data);
    const promises = midiList.map(async ({ name, midi }) => {
      const dataurl = await applySoundFont(midi, soundfont, options);
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
