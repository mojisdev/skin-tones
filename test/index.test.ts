import type { SkinTone } from "../src";
import { describe, expect, it } from "vitest";
import { getSkinTone, hasSkinTone, setMultipleSkinTones, setSkinTone } from "../src";

describe("set skin tone", () => {
  it("should return the same emoji if skin tone is `none`", () => {
    const emoji = "👍";
    const expectedEmoji = emoji;
    const result = setSkinTone(emoji, "none");
    expect(result).toBe(expectedEmoji);
  });

  it("should add skin tone to emoji if skin tone is `light`", () => {
    const emoji = "👍";
    const expectedEmoji = "👍🏻";
    const result = setSkinTone(emoji, "light");
    expect(result).toBe(expectedEmoji);
  });

  it("should add skin tone to emoji if skin tone is `medium-light`", () => {
    const emoji = "👍";
    const expectedEmoji = "👍🏼";
    const result = setSkinTone(emoji, "medium-light");
    expect(result).toBe(expectedEmoji);
  });

  it("should add skin tone to emoji if skin tone is `medium`", () => {
    const emoji = "👍";
    const expectedEmoji = "👍🏽";
    const result = setSkinTone(emoji, "medium");
    expect(result).toBe(expectedEmoji);
  });

  it("should add skin tone to emoji if skin tone is `medium-dark`", () => {
    const emoji = "👍";
    const expectedEmoji = "👍🏾";
    const result = setSkinTone(emoji, "medium-dark");
    expect(result).toBe(expectedEmoji);
  });

  it("should add skin tone to emoji if skin tone is `dark`", () => {
    const emoji = "👍";
    const expectedEmoji = "👍🏿";
    const result = setSkinTone(emoji, "dark");
    expect(result).toBe(expectedEmoji);
  });

  it("should remove skin tone to emoji if skin tone is `none`", () => {
    const emoji = "👍🏿";
    const expectedEmoji = "👍";
    const result = setSkinTone(emoji, "none");
    expect(result).toBe(expectedEmoji);
  });

  it("should add different skin tone to emoji", () => {
    const emoji = "👸🏼";
    const expectedEmoji = "👸🏽";
    const result = setSkinTone(emoji, "medium");
    expect(result).toBe(expectedEmoji);
  });

  it("should return the same emoji if skin tone can't be set", () => {
    const emoji = "🌍";
    const expectedEmoji = "🌍";
    const result = setSkinTone(emoji, "light");
    expect(result).toBe(expectedEmoji);
  });

  describe("handle tricky emojis", () => {
    it.each([
      {
        emoji: "🕵️‍♀️",
        tone: "medium-dark",
        expected: "🕵🏾‍♀",
      },
      {
        emoji: "⛹️‍♀️",
        tone: "dark",
        expected: "⛹🏿‍♀",
      },
      {
        emoji: "👩‍❤️‍👨",
        tone: "medium-dark",
        expected: "👩🏾‍❤‍👨🏾",
      },
      {
        emoji: "👬",
        tone: "light",
        expected: "👬🏻",
      },
    ] as const)("expect $emoji to be $expected", ({ emoji, tone, expected }) => {
      const result = setSkinTone(emoji, tone);
      expect(result).toBe(expected);
    });
  });

  describe("handle emojis without support for skin tones", () => {
    it.each([
      ["👩‍👦", "medium-dark", "👩‍👦"],
      ["👩‍👩‍👧‍👧", "light", "👩‍👩‍👧‍👧"],
    ] as const)("should ignore %s", (emoji, tone, expected) => {
      const result = setSkinTone(emoji, tone);
      expect(result).toBe(expected);
    });
  });
});

describe("get skin tone", () => {
  it("should return `none` for emoji without skin tone", () => {
    expect(getSkinTone("👍")).toBe("none");
  });

  it("should return `light` for emoji with `light` skin tone", () => {
    expect(getSkinTone("👍🏻")).toBe("light");
  });

  it("should return `medium-light` for emoji with `medium-light` skin tone", () => {
    expect(getSkinTone("👍🏼")).toBe("medium-light");
  });

  it("should return `medium` for emoji with `medium` skin tone", () => {
    expect(getSkinTone("👍🏽")).toBe("medium");
  });

  it("should return `medium-dark` for emoji with `medium-dark` skin tone", () => {
    expect(getSkinTone("👍🏾")).toBe("medium-dark");
  });

  it("should return `dark` for emoji with `dark` skin tone", () => {
    expect(getSkinTone("👍🏿")).toBe("dark");
  });

  it("should return none for non-modifiable emoji", () => {
    expect(getSkinTone("🌍")).toBe("none");
  });

  it("should return the first skin tone for emoji with multiple skin tones", () => {
    expect(getSkinTone("👩🏼‍❤️‍👨🏿")).toBe("medium-light");
  });
});

describe("has skin tone", () => {
  it("should return false for emoji without skin tone", () => {
    expect(hasSkinTone("👍")).toBe(false);
  });

  it("should return true for emoji with white skin tone", () => {
    expect(hasSkinTone("👍🏻")).toBe(true);
  });

  it("should return true for emoji with cream skin tone", () => {
    expect(hasSkinTone("👍🏼")).toBe(true);
  });

  it("should return true for emoji with light skin tone", () => {
    expect(hasSkinTone("👍🏽")).toBe(true);
  });

  it("should return true for emoji with brown skin tone", () => {
    expect(hasSkinTone("👍🏾")).toBe(true);
  });

  it("should return true for emoji with dark skin tone", () => {
    expect(hasSkinTone("👍🏿")).toBe(true);
  });

  it("should return false for non-modifiable emoji", () => {
    expect(hasSkinTone("🌍")).toBe(false);
  });
});
