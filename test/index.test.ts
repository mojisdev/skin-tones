import type { SkinTone } from "../src";
import { describe, expect, it } from "vitest";
import { setSkinTone } from "../src";

it("should return the same emoji if skin tone is none", () => {
  const emoji = "👍";
  const tone: SkinTone = "none";
  const expectedEmoji = emoji;
  const result = setSkinTone(emoji, tone);
  expect(result).toBe(expectedEmoji);
});

it("should add skin tone to emoji if skin tone is white", () => {
  const emoji = "👍";
  const tone: SkinTone = "white";
  const expectedEmoji = "👍🏻";
  const result = setSkinTone(emoji, tone);
  expect(result).toBe(expectedEmoji);
});

it("should add skin tone to emoji if skin tone is cream", () => {
  const emoji = "👍";
  const tone: SkinTone = "cream";
  const expectedEmoji = "👍🏼";
  const result = setSkinTone(emoji, tone);
  expect(result).toBe(expectedEmoji);
});

it("should add skin tone to emoji if skin tone is light", () => {
  const emoji = "👍";
  const tone: SkinTone = "light";
  const expectedEmoji = "👍🏽";
  const result = setSkinTone(emoji, tone);
  expect(result).toBe(expectedEmoji);
});

it("should add skin tone to emoji if skin tone is brown", () => {
  const emoji = "👍";
  const tone: SkinTone = "brown";
  const expectedEmoji = "👍🏾";
  const result = setSkinTone(emoji, tone);
  expect(result).toBe(expectedEmoji);
});

it("should add skin tone to emoji if skin tone is dark", () => {
  const emoji = "👍";
  const tone: SkinTone = "dark";
  const expectedEmoji = "👍🏿";
  const result = setSkinTone(emoji, tone);
  expect(result).toBe(expectedEmoji);
});

it("should remove skin tone to emoji if skin tone is none", () => {
  const emoji = "👍🏿";
  const tone: SkinTone = "none";
  const expectedEmoji = "👍";
  const result = setSkinTone(emoji, tone);
  expect(result).toBe(expectedEmoji);
});

it("should add different skin tone to emoji", () => {
  const emoji = "👸🏼";
  const tone: SkinTone = "light";
  const expectedEmoji = "👸🏽";
  const result = setSkinTone(emoji, tone);
  expect(result).toBe(expectedEmoji);
});

it("should return the same emoji if skin tone can't be set", () => {
  const emoji = "🌍";
  const tone: SkinTone = "light";
  const expectedEmoji = "🌍";
  const result = setSkinTone(emoji, tone);
  expect(result).toBe(expectedEmoji);
});

describe("handle tricky emojis", () => {
  it.each([
    {
      emoji: "🕵️‍♀️",
      tone: "brown",
      expected: "🕵🏾‍♀",
    },
    {
      emoji: "⛹️‍♀️",
      tone: "dark",
      expected: "⛹🏿‍♀",
    },
    {
      emoji: "👩‍❤️‍👨",
      tone: "brown",
      expected: "👩🏾‍❤‍👨🏾",
    },
    {
      emoji: "👬",
      tone: "white",
      expected: "👬🏻",
    },
  ])("expect $emoji to be $expected", ({ emoji, tone, expected }) => {
    const result = setSkinTone(emoji, tone as SkinTone);
    expect(result).toBe(expected);
  });
});

describe("handle emojis without support for skin tones", () => {
  it.each([
    ["👩‍👦", "brown", "👩‍👦"],
    ["👩‍👩‍👧‍👧", "white", "👩‍👩‍👧‍👧"],
  ])("should ignore %s", (emoji, tone, expected) => {
    const result = setSkinTone(emoji, tone as SkinTone);
    expect(result).toBe(expected);
  });
});
