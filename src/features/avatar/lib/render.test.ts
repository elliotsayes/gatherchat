import { describe, expect, it } from "vitest";
import { generateSpriteData } from "./renderAvatar";

describe("generateSpriteData", () => {
  it("should generate sprite data", () => {
    const data = generateSpriteData("/api/sprite/generate?seed=123");
    expect(data).toMatchSnapshot();
  });
});
