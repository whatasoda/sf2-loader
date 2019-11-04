# sf2-loader
**`sf2-loader`** is a webpack loader to parse sf2 soundfont file. It is based on https://github.com/colinbdclark/sf2-parser. The output file is formatted for use with https://github.com/danigb/soundfont-player.

## Installation
### Requirement
`sf2-loader` uses [LAME](http://lame.sourceforge.net/) and [FluidSynth](http://www.fluidsynth.org/).

To install LAME, see [here](https://github.com/jankarres/node-lame#installation)
To install FluidSynth, see [here](https://github.com/FluidSynth/fluidsynth/wiki/Download)

### install from npm
```sh
npm i -D sf2-loader
```

### webpack config file
```js
module.exports = {
  // ...

  module: {
    rules: [
      {
        test: /\.sf2$/,
        use: [
          {
            loader: 'sf2-loader',
            options: {
              bitrate: 64,
            },
          },
        ],
      },
    ],
  },

  // ...
}
```

## Options
`sf2-loader` options is for `node-lame`. You can specify `bitrate`(REQUIRED) and `resample`.
About deteail, see [here](https://www.npmjs.com/package/node-lame#all-options).

## [LICENSE](https://github.com/whatasoda/sf2-loader/blob/master/LICENSE)
