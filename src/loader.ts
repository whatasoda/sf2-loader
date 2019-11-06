import webpack from 'webpack';
import { isBuffer } from 'util';
import { getOptions } from 'loader-utils';
import validate from 'schema-utils';
import { ConverterOptions } from './decls';
import convert from './convert';

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
  const options = getOptions(this) as ConverterOptions;
  validate(schema, options, { name: 'Sf2 Loader' });

  const callback = this.async();
  if (!callback) return;

  (async () => {
    try {
      const contentObj = await convert(source, this.resourcePath, options);
      const content = `module.exports=JSON.parse('${JSON.stringify(contentObj)}')`;
      callback(null, content, sourceMap);
    } catch (e) {
      callback(e);
    }
  })();
};
loader.raw = true;

export = loader;
