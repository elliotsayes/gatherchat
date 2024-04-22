import { z } from "zod";

const zFeeType = z.enum(["One-Time", "Monthly"]);
const zFeeValue = z.number().gt(0, {
	message: "Must be greater than 0",
});

export const zAccess = z.enum(["public", "restricted"]);

export const zAccessFeeType = zFeeType;

export const zAccessFeeValue = zFeeValue;

export const zDerivations = z.enum([
	"Allowed-With-Credit",
	"Allowed-With-Indication",
	"Allowed-With-License-Passthrough",
	"Allowed-With-RevenueShare",
]);

export const zRevenueSharePercentage = z
	.number()
	.gt(0, {
		message: "Must be greater than 0",
	})
	.max(100, {
		message: "Must not be greater than 100",
	});

export const zCommercialUse = z.enum(["Allowed", "Allowed-With-Credit"]);

export const zLicenseType = zFeeType;

export const zLicenseFeeValue = zFeeValue;

export const zLicenseFeeCurrency = z.enum(["AR"]);

export const zExpires = z
	.number()
	.int({
		message: "Must be a whole number of years",
	})
	.gt(0, {
		message: "Must be greater than 0",
	});

export const zPaymentAddress = z.string().min(1, {
	message: "Cannot be empty",
});

export const zPaymentMode = z.enum([
	"Random-Distribution",
	"Global-Distribution",
]);

export const zUnspecified = z.enum(["Unspecified"]);

export const zUdlInputSchema = z
	.object({
		Access: z.union([zUnspecified, zAccess]),
		"Access Fee Type": zAccessFeeType,
		"Access Fee Value": z.union([
			z.coerce.number().pipe(zAccessFeeValue),
			z.string().length(0),
		]),
		Derivations: z.union([zUnspecified, zDerivations]),
		"Revenue Share Percentage": z.union([
			z.coerce.number().pipe(zRevenueSharePercentage),
			z.string().length(0),
		]),
		"Commercial Use": z.union([zUnspecified, zCommercialUse]),
		"License Type": z.union([zUnspecified, zLicenseType]),
		"License Fee Value": z.union([
			z.coerce.number().pipe(zLicenseFeeValue),
			z.string().length(0),
		]),
		"License Fee Currency": z.union([z.enum(["$U"]), zLicenseFeeCurrency]),
		Expires: z.union([z.coerce.number().pipe(zExpires), z.string().length(0)]),
		"Payment Address": z.union([z.string().length(0), zPaymentAddress]),
		// "Payment Mode": z.union([zUnspecified, zPaymentMode]),
	})
	.superRefine((values, context) => {
		if (
			values.Derivations === "Allowed-With-RevenueShare" &&
			typeof values["Revenue Share Percentage"] !== "number"
		) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Required field",
				path: ["Revenue Share Percentage"],
			});
		}
	})
	.superRefine((values, context) => {
		if (
			values.Access === "restricted" &&
			typeof values["Access Fee Value"] !== "number"
		) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Required field",
				path: ["Access Fee Value"],
			});
		}
	})
	.superRefine((values, context) => {
		if (
			values["License Type"] !== "Unspecified" &&
			typeof values["License Fee Value"] !== "number"
		) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Required field",
				path: ["License Fee Value"],
			});
		}
	});
