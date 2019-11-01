import { sf2 } from '../decls';
export as namespace sf2Parser;
export = sf2Parser;

type sf2Type = typeof sf2Parser;
declare namespace sf2Parser {
  const sf2: sf2Type;
  interface Parser extends Partial<sf2.SoundFontData> {}
  class Parser {
    constructor(data: Uint8Array, options: Options);
    parse(): void;
    input: Uint8Array | null;
    parserOptions: ParserOptions;
  }

  interface Options {
    index?: number;
    length?: number;
    padding?: boolean;
    bigEndian?: boolean;
    parserOptions: ParserOptions;
  }

  interface ParserOptions {
    isSf3?: boolean;
  }
}
