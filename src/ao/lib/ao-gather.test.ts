import { describe, expect, it } from "vitest";
import { AoGatherProvider } from "./ao-gather";

function getTestInstance() {
	return new AoGatherProvider({});
}

describe("AoGatherProvider", () => {
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

	it("should be able to get room index", () => {
		const aoGatherProvider = getTestInstance();
		expect(aoGatherProvider.getRoomIndex()).resolves.toMatchSnapshot();
	});

	it("should be able to get all rooms", () => {
		const aoGatherProvider = getTestInstance();
		expect(aoGatherProvider.getRooms()).resolves.toMatchSnapshot();
	});

	it("should be able to get a specific room", () => {
		const aoGatherProvider = getTestInstance();
		expect(
			aoGatherProvider.getRoom({ roomId: "WelcomeLobby" }),
		).resolves.toMatchSnapshot();
	});

	it("should be able to get all posts", () => {
		const aoGatherProvider = getTestInstance();
		expect(aoGatherProvider.getPosts()).resolves.toMatchSnapshot();
	});

	it("should be able to get posts from a specific room", () => {
		const aoGatherProvider = getTestInstance();
		expect(
			aoGatherProvider.getPosts({ roomId: "WelcomeLobby" }),
		).resolves.toMatchSnapshot();
	});
});
