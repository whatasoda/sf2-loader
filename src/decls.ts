export interface SoundFontJSONData extends Omit<sf2.SoundFontData, 'sample'> {
  sample: string[];
}

export declare namespace sf2 {
  export interface SoundFontData {
    samplingData: SamplingData;
    presetHeader: PresetHeader;
    presetZone: PresetZone;
    presetZoneModulator: PresetZoneModulator;
    presetZoneGenerator: PresetZoneGenerator;
    instrument: Instrument;
    instrumentZone: InstrumentZone;
    instrumentZoneModulator: InstrumentZoneModulator;
    instrumentZoneGenerator: InstrumentZoneGenerator;
    sample: Sample;
    sampleHeader: SampleHeader;
  }

  export interface SamplingData {
    type: 'smpl';
    size: number;
    offset: number;
  }

  export interface PresetHeader {
    presetName: string;
    preset: number;
    bank: number;
    presetBagIndex: number;
    library: number;
    genre: number;
    morphology: number;
  }

  export interface PresetZone extends Array<PresetZoneItem> {}
  export interface PresetZoneItem {
    presetGeneratorIndex: number;
    presetModulatorIndex: number;
  }

  export interface PresetZoneModulator extends Array<OneOfEnumerator> {}

  export interface PresetZoneGenerator extends Array<OneOfEnumerator> {}

  export interface Instrument extends Array<InstrumentItem> {}
  export interface InstrumentItem {
    instrumentName: string;
    instrumentBagIndex: number;
  }

  export interface InstrumentZone extends Array<InstrumentZoneItem> {}
  export interface InstrumentZoneItem {
    instrumentGeneratorIndex: number;
    instrumentModulatorIndex: number;
  }

  export interface InstrumentZoneModulator extends Array<OneOfEnumerator> {}

  export interface InstrumentZoneGenerator extends Array<OneOfEnumerator> {}

  export interface Sample extends Array<SampleItem> {}
  export interface SampleItem extends ArrayBuffer {}

  export interface SampleHeader extends Array<SampleHeaderItem> {}
  export interface SampleHeaderItem {
    sampleName: string;
    startLoop: number;
    endLoop: number;
    sampleRate: number;
    originalPitch: number;
    pitchCorrection: number;
    sampleLink: number;
    sampleType: number;
  }

  interface EnumeratorBase<T extends EnumeratorType> {
    type: T;
    value: T extends EnumeratorRangeType
      ? RangeValueObject
      : T extends EnumeratorAmountType
      ? AmountValueObject
      : {
          code: number;
          amount: number;
          lo: number;
          hi: number;
        };
  }
  export type OneOfEnumerator = {
    [T in EnumeratorType]: EnumeratorBase<T>;
  }[EnumeratorType];

  type RangeValueObject = Record<'lo' | 'hi', number>;
  type AmountValueObject = Record<'amount', number>;

  type ParsedZone = {
    [T in EnumeratorType]?: RangeValueObject extends EnumeratorBase<T>['value'] ? [number, number] : number;
  };

  type EnumeratorType = EnumeratorRangeType | EnumeratorAmountType;
  type EnumeratorRangeType = 'keyRange' | 'velRange' | 'keynum' | 'velocity';
  type EnumeratorAmountType =
    | 'startAddrsOffset'
    | 'endAddrsOffset'
    | 'startloopAddrsOffset'
    | 'endloopAddrsOffset'
    | 'startAddrsCoarseOffset'
    | 'modLfoToPitch'
    | 'vibLfoToPitch'
    | 'modEnvToPitch'
    | 'initialFilterFc'
    | 'initialFilterQ'
    | 'modLfoToFilterFc'
    | 'modEnvToFilterFc'
    | 'endAddrsCoarseOffset'
    | 'modLfoToVolume'
    | 'chorusEffectsSend'
    | 'reverbEffectsSend'
    | 'pan'
    | 'delayModLFO'
    | 'freqModLFO'
    | 'delayVibLFO'
    | 'freqVibLFO'
    | 'delayModEnv'
    | 'attackModEnv'
    | 'holdModEnv'
    | 'decayModEnv'
    | 'sustainModEnv'
    | 'releaseModEnv'
    | 'keynumToModEnvHold'
    | 'keynumToModEnvDecay'
    | 'delayVolEnv'
    | 'attackVolEnv'
    | 'holdVolEnv'
    | 'decayVolEnv'
    | 'sustainVolEnv'
    | 'releaseVolEnv'
    | 'keynumToVolEnvHold'
    | 'keynumToVolEnvDecay'
    | 'instrument'
    | 'startloopAddrsCoarseOffset'
    | 'initialAttenuation'
    | 'endloopAddrsCoarseOffset'
    | 'coarseTune'
    | 'fineTune'
    | 'sampleID'
    | 'sampleModes'
    | 'scaleTuning'
    | 'exclusiveClass'
    | 'overridingRootKey';
}
