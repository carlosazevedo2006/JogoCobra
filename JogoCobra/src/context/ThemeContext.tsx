import React, { createContext, useContext, useState } from "react";
import { ColorValue } from "react-native";

type ThemeName = "dark" | "light";

const light = {
  name: "light" as ThemeName,
  background: "#f5f5f5",
  card: "#ffffff",
  primary: "#0f62fe",
  textPrimary: "#111111",
  textSecondary: "#333333",
  buttonBg: "#0f62fe",
  buttonText: "#ffffff",
  boardBg: "#e9e9e9",
  foodColor: "#ffb400",
};

const dark = {
  name: "dark" as ThemeName,
  background: "#0b0b0b",
  card: "#111111",
  primary: "#00e676",
  textPrimary: "#e6ffee",
  textSecondary: "#bfeecf",
  buttonBg: "#00e676",
  buttonText: "#0b0b0b",
  boardBg: "#000000",
  foodColor: "#ffd400",
};

type Theme = typeof light;

const ThemeContext = createContext<{
  theme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
  setThemeName: (t: ThemeName) => void;
}>({
  theme: dark,
  themeName: "dark",
  toggleTheme: () => {},
  setThemeName: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>("dark");
  const theme = themeName === "dark" ? dark : light;

  function toggleTheme() {
    setThemeName((t) => (t === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return { colors: ctx.theme, themeName: ctx.themeName, toggleTheme: ctx.toggleTheme, setThemeName: ctx.setThemeName };
}
