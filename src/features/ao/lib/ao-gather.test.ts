import { describe, expect, it } from "vitest";
import { AoGatherProvider } from "./ao-gather";

function getTestInstance() {
  return new AoGatherProvider({});
}

describe.skip("AoGatherProvider", () => {
  it("should be able to be instantiated", () => {
    const aoGatherProvider = getTestInstance();
    expect(aoGatherProvider).toBeDefined();
  });

  it("should be able to start", () => {
    const aoGatherProvider = getTestInstance();
    expect(() => aoGatherProvider.start()).not.toThrow();
  });

  it("should be able to stop", () => {
    const aoGatherProvider = getTestInstance();
    expect(() => {
      aoGatherProvider.start();
      aoGatherProvider.stop();
    }).not.toThrow();
  });

  it("should be able to ensure started", () => {
    const aoGatherProvider = getTestInstance();
    expect(() => aoGatherProvider.ensureStarted()).not.toThrow();
  });

  it("should be able to get users", () => {
    const aoGatherProvider = getTestInstance();
    expect(aoGatherProvider.getUsers()).resolves.toMatchSnapshot();
  });

  it("should be able to get world index", () => {
    const aoGatherProvider = getTestInstance();
    expect(aoGatherProvider.getWorldIndex()).resolves.toMatchSnapshot();
  });

  it("should be able to get all worlds", () => {
    const aoGatherProvider = getTestInstance();
    expect(aoGatherProvider.getWorlds()).resolves.toMatchSnapshot();
  });

  it("should be able to get a specific world", () => {
    const aoGatherProvider = getTestInstance();
    expect(
      aoGatherProvider.getWorld({ worldId: "WelcomeLobby" }),
    ).resolves.toMatchSnapshot();
  });

  it("should be able to get all posts", () => {
    const aoGatherProvider = getTestInstance();
    expect(aoGatherProvider.getPosts()).resolves.toMatchSnapshot();
  });

});
