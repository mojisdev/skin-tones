# @mojis/skin-tone

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

utilities to work with emoji skin tones

## 📦 Installation

```bash
npm install @mojis/skin-tone
```

## 🚀 Usage

```ts
import { getSkinTone, hasSkinTone, setSkinTone, setSkinTones } from "@mojis/skin-tone";

console.log(setSkinTone("👍", "dark")); // -> 👍🏿
console.log(setSkinTone("👍", "light")); // -> 👍🏻
console.log(setSkinTone("👍🏻", "none")); // -> 👍

console.log(setSkinTones("👩‍❤️‍👨", ["light", "dark"])); // -> 👩🏻‍❤‍👨🏿

console.log(getSkinTone("👍🏿")); // -> dark
console.log(getSkinTone("👍🏻")); // -> light
console.log(getSkinTone("👍")); // -> none
console.log(getSkinTone("👩🏼‍❤️‍👨🏿")); // -> ["medium-light", "dark"]

console.log(hasSkinTone("👍🏿")); // -> dark
console.log(hasSkinTone("👍🏻")); // -> light
console.log(hasSkinTone("👍")); // -> none
```

## 📄 License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@mojis/skin-tone?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/@mojis/skin-tone
[npm-downloads-src]: https://img.shields.io/npm/dm/@mojis/skin-tone?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/@mojis/skin-tone
