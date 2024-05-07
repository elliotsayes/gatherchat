import {
	zExpires,
	zPaymentAddress,
	type zUdlInputSchema,
} from "@/udl/lib/schema";
import type { z } from "zod";

// const udlV1LicenseTxId = "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8";
const udlV2LicenseTxId = "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8";

export const udlConfigToTags = (
	config: z.infer<typeof zUdlInputSchema>,
): Record<string, string> | undefined => {
	const tags: Record<string, string> = {
		License: udlV2LicenseTxId,
	};

	if (config.Access !== "Unspecified") {
		tags.Access = config.Access;

		if (tags.Access === "restricted") {
			tags["Access-Fee"] =
				`${config["Access Fee Type"]}-${config["Access Fee Value"]}`;
			tags["Payment-Mode"] = "Global-Distribution";
		}
	}

	if (config.Derivations === "Allowed-With-RevenueShare") {
		tags.Derivation = `Allowed-With-RevenueShare-${config["Revenue Share Percentage"]}%`;
	} else if (config.Derivations !== "Unspecified") {
		tags.Derivation = config.Derivations;
	}

	if (config["Commercial Use"] !== "Unspecified") {
		tags["Commercial-Use"] = config["Commercial Use"];
	}

	if (config["License Type"] !== "Unspecified") {
		tags["License-Fee"] =
			`${config["License Type"]}-${config["License Fee Value"]}`;
		if (config["License Fee Currency"] !== "$U") {
			tags.Currency = config["License Fee Currency"];
		}
	}

	if (
		(config.Derivations !== "Unspecified" ||
			config["License Type"] !== "Unspecified") &&
		zPaymentAddress.safeParse(config["Payment Address"]).success
	) {
		tags["Payment-Address"] = config["Payment Address"];
	}

	if (zExpires.safeParse(config.Expires).success) {
		tags.Expires = config.Expires.toString();
	}

	return tags;
};
