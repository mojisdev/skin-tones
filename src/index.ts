// https://en.wikipedia.org/wiki/Fitzpatrick_scale
// i'm not sure if this is the best way to describe them
// i'm sorry if you feel offended by the names
export type SkinTone = "none" | "white" | "cream" | "light" | "brown" | "dark";

export const FITZPATRICK_SCALE = new Map<SkinTone, string>([
  ["none", ""],
  ["white", "🏻"],
  ["cream", "🏼"],
  ["light", "🏽"],
  ["brown", "🏾"],
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
