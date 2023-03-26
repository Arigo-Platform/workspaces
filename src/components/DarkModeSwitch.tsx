import useDarkMode from "@/util/useDarkMode";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import * as Switch from "@radix-ui/react-switch";
import { useEffect, useState } from "react";

export default function DarkModeSwitch() {
  const [colorTheme, setTheme] = useDarkMode();

  const toggleDarkMode = (checked: boolean) => {
    setTheme(colorTheme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex items-center">
      <Switch.Root
        className="w-[42px]  bg-gray-200 rounded-full relative shadow-[0_2px_10px] shadow-violet-400 focus:shadow-[0_0_0_2px] focus:shadow-violet-400 data-[state=checked]:bg-violet-400 outline-none cursor-default"
        id="dark-mode"
        onCheckedChange={toggleDarkMode}
        defaultChecked={colorTheme === "dark"}
        // style={{ "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)" }}
      >
        <Switch.Thumb className="flex items-center cursor-pointer justify-center w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]">
          {colorTheme === "dark" ? (
            <MoonIcon className="w-3 h-3 text-gray-700" />
          ) : (
            <SunIcon className="w-3 h-3 text-gray-700" />
          )}
        </Switch.Thumb>
      </Switch.Root>
    </div>
  );
}
