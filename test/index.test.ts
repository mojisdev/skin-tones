import { describe, expect, it } from "vitest";
import { getSkinTone, hasSkinTone, setSkinTone, setSkinTones, type SkinTone } from "../src";

describe("set skin tone", () => {
  it("should throw error for invalid skin tone", () => {
    expect(() => setSkinTone("👍", "invalid" as SkinTone)).toThrow("invalid skin tone: invalid");
  });

  it.each([
    { emoji: "👍", tone: "none", expected: "👍" },
    { emoji: "👍", tone: "light", expected: "👍🏻" },
    { emoji: "👍", tone: "medium-light", expected: "👍🏼" },
    { emoji: "👍", tone: "medium", expected: "👍🏽" },
    { emoji: "👍", tone: "medium-dark", expected: "👍🏾" },
    { emoji: "👍", tone: "dark", expected: "👍🏿" },
    { emoji: "👍🏿", tone: "none", expected: "👍" },
    { emoji: "👍🏿", tone: "light", expected: "👍🏻" },
    { emoji: "👍🏿", tone: "medium-light", expected: "👍🏼" },
    { emoji: "👍🏿", tone: "medium", expected: "👍🏽" },
    { emoji: "👍🏿", tone: "medium-dark", expected: "👍🏾" },
    { emoji: "👍🏿", tone: "dark", expected: "👍🏿" },

    // without a skin tone
    { emoji: "🌏", tone: "none", expected: "🌏" },
    { emoji: "🌏", tone: "light", expected: "🌏" },
    { emoji: "🌏", tone: "medium-light", expected: "🌏" },
    { emoji: "🌏", tone: "medium", expected: "🌏" },

    // tricky emojis
    { emoji: "👸🏼", tone: "medium", expected: "👸🏽" },
    { emoji: "🕵️‍♀️", tone: "medium-dark", expected: "🕵🏾‍♀" },
    { emoji: "⛹️‍♀️", tone: "dark", expected: "⛹🏿‍♀" },
    { emoji: "👩‍❤️‍👨", tone: "medium-dark", expected: "👩🏾‍❤‍👨🏾" },
    { emoji: "👬", tone: "light", expected: "👬🏻" },
    { emoji: "🤝", tone: "dark", expected: "🤝🏿" },
  ] as const)("expect $emoji to be $expected", ({ emoji, tone, expected }) => {
    const result = setSkinTone(emoji, tone);
    expect(result).toBe(expected);
  });

  it.each([
    ["👩‍👦", "medium-dark", "👩‍👦"],
    ["👩‍👩‍👧‍👧", "light", "👩‍👩‍👧‍👧"],
  ] as const)("should ignore %s", (emoji, tone, expected) => {
    const result = setSkinTone(emoji, tone);
    expect(result).toBe(expected);
  });
});

interface TestSetSkinTones {
  emoji: string;
  tones: SkinTone[];
  expected: string;
}

describe("set skin tones", () => {
  it("should throw error for invalid skin tones", () => {
    expect(() => setSkinTones("👍", ["invalid" as SkinTone])).toThrow("invalid skin tone in: invalid");
  });

  it.each([
    { emoji: "👍", tones: ["none"], expected: "👍" },
    { emoji: "👍", tones: ["light"], expected: "👍🏻" },
    { emoji: "👍", tones: ["medium-light"], expected: "👍🏼" },
    { emoji: "👍", tones: ["medium"], expected: "👍🏽" },
    { emoji: "👍", tones: ["medium-dark"], expected: "👍🏾" },
    { emoji: "👍", tones: ["dark"], expected: "👍🏿" },
    { emoji: "👍🏿", tones: ["none"], expected: "👍" },
    { emoji: "👍🏿", tones: ["light"], expected: "👍🏻" },
    { emoji: "👍🏿", tones: ["medium-light"], expected: "👍🏼" },
    { emoji: "👍🏿", tones: ["medium"], expected: "👍🏽" },
    { emoji: "👍🏿", tones: ["medium-dark"], expected: "👍🏾" },
    { emoji: "👍🏿", tones: ["dark"], expected: "👍🏿" },
    { emoji: "👸🏼", tones: ["medium"], expected: "👸🏽" },
    { emoji: "🕵️‍♀️", tones: ["medium-dark"], expected: "🕵🏾‍♀" },
    { emoji: "⛹️‍♀️", tones: ["dark"], expected: "⛹🏿‍♀" },
    { emoji: "👩‍❤️‍👨", tones: ["medium-dark"], expected: "👩🏾‍❤‍👨🏾" },
    { emoji: "👬", tones: ["light"], expected: "👬🏻" },

    // multiple tones
    { emoji: "👩‍❤️‍👨", tones: ["light", "dark"], expected: "👩🏻‍❤‍👨🏿" },
    { emoji: "🫱🏿‍🫲🏾", tones: ["medium-light", "medium"], expected: "🫱🏼‍🫲🏽" },
    { emoji: "👨‍👩‍👧‍👦", tones: ["light", "dark"], expected: "👨‍👩‍👧‍👦" },
  ] satisfies TestSetSkinTones[])("expect $emoji to be $expected", ({ emoji, tones, expected }) => {
    expect(setSkinTones(emoji, tones)).toBe(expected);
  });

  it("should return unchanged emoji when no tones provided", () => {
    expect(setSkinTones("👍", [])).toBe("👍");
  });

  it("should return unchanged emoji when all tones are none", () => {
    expect(setSkinTones("👍", ["none", "none"])).toBe("👍");
  });
});

it.each([
  { emoji: "👍", expected: "none" },
  { emoji: "👍🏻", expected: "light" },
  { emoji: "👍🏼", expected: "medium-light" },
  { emoji: "👍🏽", expected: "medium" },
  { emoji: "👍🏾", expected: "medium-dark" },
  { emoji: "👍🏿", expected: "dark" },
  { emoji: "🌍", expected: "none" },

  // multiple skin tones
  { emoji: "👩🏼‍❤️‍👨🏿", expected: ["medium-light", "dark"] },
  { emoji: "🫱🏿‍🫲🏾", expected: ["dark", "medium-dark"] },
])("expect $emoji to have skin tone: $expected", ({ emoji, expected }) => {
  expect(getSkinTone(emoji)).toStrictEqual(expected);
});

it.each([
  ["👍", false],
  ["👍🏻", true],
  ["👍🏼", true],
  ["👍🏽", true],
  ["👍🏾", true],
  ["👍🏿", true],
  ["🌍", false],
  ["👩🏻‍❤️‍👨🏿", true],
])("expect %s to have skin tone: %s", (emoji, expected) => {
  expect(hasSkinTone(emoji)).toBe(expected);
});
