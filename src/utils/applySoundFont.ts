import cp from 'child_process';
import fs from 'fs';
import temp from 'temp';
import { promisify } from 'util';
import { Lame } from 'node-lame';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const exec = promisify(cp.exec);

const applySoundFont = async (midi: Buffer, soundfontPath: string) => {
  const wav = await midiToWav(midi, soundfontPath);
  const mp3 = await encodeToMp3(wav);
  return toDataUrl(mp3);
};

const midiToWav = async (midi: Buffer, soundfontPath: string): Promise<Buffer> => {
  const wavPath = temp.path();
  const midiPath = temp.path();

  await writeFile(midiPath, midi);
  await exec(`fluidsynth -C, 1, -R, 1, -g, 0.5, -F ${wavPath} ${soundfontPath} ${midiPath}`);
  const wav = await readFile(wavPath);
  await unlink(midiPath);
  await unlink(wavPath);
  return wav;
};

const encodeToMp3 = async (wav: Buffer): Promise<Buffer> => {
  const decoder = new Lame({ output: 'buffer', bitrate: 128 }).setBuffer(wav);
  await decoder.encode();
  return decoder.getBuffer();
};

const toDataUrl = (mp3: Buffer) => `data:audio/mpeg;base64,${mp3.toString('base64')}`;

export default applySoundFont;
