import { setup } from "xstate";

export const gameMachine = setup({
	schemas: {},
}).createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgNwBdd0AbAYgG0AGAXUVAAcB7WS3L-OxAAPRAEYAzAFYSTAJwAmACwA2JQrkSlADiYqpAGhABPRNoUl9UlQoUqJasU21KAvq6NoseQqVhgKAFcORlYhbl4qASFRBAllEm0xBSklMXUAdhUMiW0VI1MEc0spa1t7R2c3dyN8Lgg4IS8cAmJwnj5opBFEAFp8kz6VWSZRsfGxjJqQZp9iMnw+WnbI-kFu2PUCszESeI0lZ21tDI106dnWvwDglc710FjbORIpMYlRlMUFdO2i3f2ckOxxOZ2qngwLV8JAATlx0KgCFA7lEHj0EGkXrYmE4MmIVDixKk-kk9s98fIJGI5FIMtV3EA */
	context: {
		currentPosition: {
			x: 0,
			y: 0,
		},
	},
	initial: "initial",
	states: {
		initial: {
			always: {
				target: "setup",
			},
		},
		setup: {
			always: {
				target: "roaming",
			},
		},
		roaming: {
			tags: ["SHOW_WORLD", "SHOW_OTHER_TOONS", "SHOW_TOON"],
		},
	},
});
