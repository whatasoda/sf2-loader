import { sf2 } from '../decls';
import jsmidi from '../jsmidi/midi';

const SAMPLE_BIT_SIZE = 16;
const DEFAULT_SAMPLE_RATE = 44100;
const TICKS_PER_SECOND = 1000;

const getNoteName = (() => {
  const pitchList = Object.values(jsmidi.noteTable);
  const table = Object.entries(jsmidi.noteTable).reduce<Record<number, jsmidi.MidiNoteName>>((acc, [name, pitch]) => {
    acc[pitch] = name as jsmidi.MidiNoteName;
    return acc;
  }, {});

  return (pitch: number) => {
    const targetPitch = pitchList.find((v) => v <= pitch);
    return targetPitch === undefined ? '' : table[targetPitch];
  };
})();

const generateMIDI = ({ sample, sampleHeader }: sf2.SoundFontData) => {
  return sampleHeader.map(({ originalPitch, sampleRate = DEFAULT_SAMPLE_RATE }, i) => {
    const bitLength = sample[i].byteLength * 8;
    const duration = Math.round((bitLength / sampleRate / SAMPLE_BIT_SIZE) * TICKS_PER_SECOND);

    const note = {
      duration: 0,
      channel: 0,
      pitch: originalPitch,
      volume: 85,
    };
    const events = [];

    events.push(jsmidi.MidiEvent.noteOn(note));
    note.duration = duration;
    events.push(jsmidi.MidiEvent.noteOff(note));

    const tracks = [new jsmidi.MidiTrack({ events })];
    const midi = jsmidi.MidiWriter({ tracks }).buffer;

    const name = getNoteName(originalPitch);
    return { name, midi };
  });
};

export default generateMIDI;
