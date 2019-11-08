import parseSoundFont from './utils/parseSoundFont';
import parsePresets from './utils/parsePresets';

const parse = async (buffer: Buffer) => {
  try {
    const soundfont = await parseSoundFont(buffer);
    if (!soundfont) throw new Error('Invalid soundfont');
    const presets = parsePresets(soundfont);
    return { soundfont, presets };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};

export default parse;
