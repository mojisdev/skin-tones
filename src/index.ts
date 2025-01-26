// https://en.wikipedia.org/wiki/Fitzpatrick_scale
// i'm not sure if this is the best way to describe them
// i'm sorry if you feel offended by the names
export type SkinTone = "none" | "light" | "medium-light" | "medium" | "medium-dark" | "dark";

export const FITZPATRICK_SCALE = new Map<SkinTone, string>([
  ["none", ""],
  ["light", "🏻"],
  ["medium-light", "🏼"],
  ["medium", "🏽"],
  ["medium-dark", "🏾"],
  ["dark", "🏿"],
]);

// Emoji presentation selector (U+FE0F) can interfere with skin tone modifiers.
// see: https://unicode.org/reports/tr51/#composing_zwj_seq
// Therefore, it should be removed if present, otherwise it causes issues with emojis with multiple traits.
// such as `female-detective` (🕵️‍♀️) turning into a detective with a gender symbol next to it,
// instead of showing a female detective with the correct skin-tone
const EMOJI_PRESENTATION_SELECTOR = "\u{FE0F}";

// Family Emojis doesn't support skin tones.
// There is both the 3+ person family emojis and the 2 person family emojis.
// The 3+ person family emojis can be easily checked by the number of modifiable components.
// For two person family emojis it's needed to check directly to distinguish them from other two person emojis: couple, handshake, fencing, etc.
const TWO_FAMILY_EMOJIS = new Set(["👩‍👦", "👩‍👧", "👨‍👧", "👨‍👦"]);

/**
 * Change the skin tone of an emoji.
 *
 * @param {string} emoji - The emoji to modify
 * @param {SkinTone} tone - The new `skin tone` to use for `emoji`
 *
 * @returns {string} - The emoji with the new skin tone
 *
 * @example
 * ```ts
 * const result = setSkinTone("👍", "dark");
 * // result => "👍🏿"
 * ```
 */
export function setSkinTone(emoji: string, tone: SkinTone): string {
  if (!FITZPATRICK_SCALE.has(tone)) {
    throw new Error(`invalid skin tone: ${tone}`);
  }

  emoji = emoji.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "");

  const EMOJI_MODIFIER_BASE_REGEX = /\p{Emoji_Modifier_Base}/gu;

  // fast path if:
  // 1. the skin tone is 'none'
  // 2. the emojis has more than two modifiable components
  // 3. it is a two-person family emoji
  if (tone === "none" || (emoji.match(EMOJI_MODIFIER_BASE_REGEX)?.length ?? 0) > 2 || TWO_FAMILY_EMOJIS.has(emoji)) {
    return emoji;
  }

  let processedEmoji = "";

  for (const codePoint of emoji) {
    // if we encounter an emoji presentation selector, we should skip it
    if (codePoint === EMOJI_PRESENTATION_SELECTOR) {
      continue;
    }

    processedEmoji += codePoint;
    // tone should be applied to all modifiable components.
    // e.g. 👩‍❤️‍💋‍👨 -> 👩🏽‍❤️‍👨🏽 and not 👩🏼‍❤️‍👨🏿
    if (EMOJI_MODIFIER_BASE_REGEX.test(codePoint)) {
      processedEmoji += FITZPATRICK_SCALE.get(tone);
    }
  }

  return processedEmoji;
}

/**
 * Applies skin tone modifiers to an emoji string.
 *
 * @param {string} emoji - The emoji string to modify
 * @param {SkinTone[]} tones - Array of skin tones to apply. If multiple tones are provided, they will be applied in sequence to modifiable components
 * @returns {string} The emoji with applied skin tones
 *
 * @example
 * ```ts
 * setSkinTones("👋", ["light"]) // "👋🏻"
 * setSkinTones("🫱🏿‍🫲🏾", ["light", "dark"]) // "🫱🏻‍🫲🏿"
 * setSkinTones("👨‍👩‍👧‍👦", ["light"]) // "👨‍👩‍👧‍👦" (family emojis are not modified)
 * ```
 */
export function setSkinTones(emoji: string, tones: SkinTone[]): string {
  if (tones.some((tone) => !FITZPATRICK_SCALE.has(tone))) {
    throw new Error(`invalid skin tone in: ${tones.join(", ")}`);
  }

  // remove existing skin tone modifiers
  emoji = emoji.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "");

  const EMOJI_MODIFIER_BASE_REGEX = /\p{Emoji_Modifier_Base}/gu;

  // fast path if:
  // 1. no tones provided
  // 2. all tones are 'none'
  // 3. the emojis has more than two modifiable components
  // 4. it is a two-person family emoji
  if (
    !tones.length
    || tones.every((tone) => tone === "none")
    || (emoji.match(EMOJI_MODIFIER_BASE_REGEX)?.length ?? 0) > 2
    || TWO_FAMILY_EMOJIS.has(emoji)
  ) {
    return emoji;
  }

  let processedEmoji = "";
  let toneIndex = 0;

  for (const codePoint of emoji) {
    // if we encounter an emoji presentation selector, we should skip it
    if (codePoint === EMOJI_PRESENTATION_SELECTOR) {
      continue;
    }

    processedEmoji += codePoint;

    // tone should be applied to all modifiable components.
    if (EMOJI_MODIFIER_BASE_REGEX.test(codePoint)) {
      const currentTone = tones[toneIndex % tones.length];
      if (currentTone == null) continue;

      processedEmoji += FITZPATRICK_SCALE.get(currentTone);
      toneIndex++;
    }
  }

  return processedEmoji;
}

/**
 * Gets the skin tone from an emoji string.
 *
 * @param {string} emoji - The emoji string to extract the skin tone from
 * @returns {SkinTone} The skin tone value from the Fitzpatrick scale, or "none" if no skin tone is present
 *
 * @example
 * ```ts
 * getSkinTone("👋🏽") // => "medium"
 * getSkinTone("👋") // => "none"
 * ```
 */
export function getSkinTone(emoji: string): SkinTone {
  const SKIN_TONE_REGEX = /[\u{1F3FB}-\u{1F3FF}]/gu;

  const match = emoji.match(SKIN_TONE_REGEX);

  if (match && match.length > 0) {
    const skinToneModifier = match[0];

    for (const [tone, modifier] of FITZPATRICK_SCALE.entries()) {
      if (modifier === skinToneModifier) {
        return tone;
      }
    }
  }

  return "none";
}

/**
 * Checks if the given emoji contains a skin tone modifier
 * @param {string} emoji - The emoji to check for skin tone
 * @returns {boolean} `true` if the emoji contains a skin tone modifier, `false` otherwise
 *
 * @example
 * ```ts
 * hasSkinTone("👋") // => false
 * hasSkinTone("👋🏻") // => true
 * ```
 */
export function hasSkinTone(emoji: string): boolean {
  return getSkinTone(emoji) !== "none";
}
