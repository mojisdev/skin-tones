# skin-tones

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Modify the skin tone of emojis.

## 📦 Installation

```bash
npm install @mojis/skin-tone
```

## 🚀 Usage

```ts
import { setSkinTone } from "@mojis/skin-tone";

console.log(setSkinTone("👍", "dark")); // -> 👍🏿
console.log(setSkinTone("👍", "light")); // -> 👍🏻
console.log(setSkinTone("👍🏻", "none")); // -> 👍
```

## 📄 License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@mojis/skin-tone?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/@mojis/skin-tone
[npm-downloads-src]: https://img.shields.io/npm/dm/@mojis/skin-tone?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/@mojis/skin-tone
