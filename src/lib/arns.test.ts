import { expect, test } from "bun:test";
import { getArnsRootTransaction } from "./arns";

const arnsName = "udl-video-renderer";

test("arns", async () => {
	const res = await getArnsRootTransaction(arnsName);
	expect(res).toBe("D_yqOXi-rA2qNxd3IvEtSLlTMlytF4pWentesCP9t_k");
});
