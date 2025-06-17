import { useState } from "react";

const useThemeModeSwitcher: () => [boolean, () => void] = () => {
  const [darkMode, setDarkMode] = useState(true);

  const switchMode = () => {
    setDarkMode((prevDarkMode) => {
      document.documentElement.setAttribute("data-theme", prevDarkMode ? "light" : "dark");
      return !prevDarkMode;
    });
  };

  return [darkMode, switchMode];
};

export default useThemeModeSwitcher;
