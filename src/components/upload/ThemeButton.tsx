import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";
import { useTheme } from "./ThemeProvider";

export const ThemeButton = () => {
	const { activeTheme, setTheme } = useTheme();

	const toggleTheme = useCallback(() => {
		setTheme(activeTheme === "light" ? "dark" : "light");
	}, [activeTheme, setTheme]);

	return (
		<Button variant={"link"} onClick={toggleTheme} size={"icon"}>
			{activeTheme === "light" ? <MoonIcon /> : <SunIcon />}
		</Button>
	);
};
