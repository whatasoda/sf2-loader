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
  
  export interface PresetZone {
    presetGeneratorIndex: number;
    presetModulatorIndex: number;
  }
  
  export interface PresetZoneModulator extends Array<GeneratorTable> {}
  
  export interface PresetZoneGenerator extends Array<GeneratorTable> {}
  
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
  
  export interface InstrumentZoneModulator extends Array<GeneratorTable> {}
  
  export interface InstrumentZoneGenerator extends Array<GeneratorTable> {}
  
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
  
  export interface GeneratorTable {
    type: GeneratorTableType;
    value: this['type'] extends GeneratorRangeTableType
      ? {
          lo: number;
          hi: number;
        }
      : {
          amount: number;
        };
  }
  
  type GeneratorTableType = GeneratorRangeTableType | GeneratorScalarTableType;
  type GeneratorRangeTableType = 'keyRange' | 'velRange';
  type GeneratorScalarTableType =
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
    | 'startloopAddrsCoarseOffset'
    | 'keynum'
    | 'velocity'
    | 'initialAttenuation'
    | 'endloopAddrsCoarseOffset'
    | 'coarseTune'
    | 'fineTune'
    | 'sampleModes'
    | 'scaleTuning'
    | 'exclusiveClass'
    | 'overridingRootKey';
}
