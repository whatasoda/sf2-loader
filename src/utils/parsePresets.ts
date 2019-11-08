import { sf2 } from '../decls';

type ParsedItem = Record<'gen' | 'mod', sf2.ParsedZone>;

const parsePresets = (data: sf2.SoundFontData) => {
  const instrumentList = parseZone(
    data.instrumentZone.map(({ instrumentGeneratorIndex, instrumentModulatorIndex }) => [
      instrumentGeneratorIndex,
      instrumentModulatorIndex,
    ]),
    data.instrumentZoneGenerator,
    data.instrumentZoneModulator,
  );

  const instruments = data.instrument.reduce<[string, ParsedItem[]][]>(
    (acc, { instrumentName, instrumentBagIndex }, i, { [i + 1]: next }) => {
      acc.push([
        instrumentName.replace('\u0000', ''),
        instrumentList.slice(instrumentBagIndex, next && next.instrumentBagIndex),
      ]);
      return acc;
    },
    [],
  );

  const presets = parseZone(
    data.presetZone.map(({ presetGeneratorIndex, presetModulatorIndex }) => [
      presetGeneratorIndex,
      presetModulatorIndex,
    ]),
    data.presetZoneGenerator,
    data.presetZoneModulator,
  ).map(({ gen: { instrument: i, ...gen }, ...preset }) => ({
    ...preset,
    gen: { ...gen, instrument: instruments[i!] },
  }));
  return presets;
};

const reduceEnumerator = (enums: sf2.OneOfEnumerator[], start: number, end: number) => {
  return enums.slice(start, start === end ? undefined : end).reduce<Record<string, any>>((acc, { type, value }) => {
    if ('code' in value) {
      acc[type] = value;
    } else if ('lo' in value && 'hi' in value) {
      acc[type] = [value.lo, value.hi];
    } else if ('amount' in value) {
      acc[type] = value.amount;
    } else {
      acc[type] = null;
    }
    return acc;
  }, {}) as sf2.ParsedZone;
};

const parseZone = (
  zoneList: [number, number][],
  generators: sf2.OneOfEnumerator[],
  modulators: sf2.OneOfEnumerator[],
) => {
  const first = zoneList[0];
  const [result] = [...zoneList.slice(1), [Infinity, Infinity] as [number, number]].reduce<
    [ParsedItem[], [number, number]]
  >(
    ([acc, curr], next) => {
      const [g0, m0] = curr;
      const [g1, m1] = next;
      acc.push({
        gen: reduceEnumerator(generators, g0, g1),
        mod: reduceEnumerator(modulators, m0, m1),
      });
      return [acc, next];
    },
    [[], first],
  );

  return result;
};

export default parsePresets;
