"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined,
);

const getResolvedTheme = (theme: Theme): "light" | "dark" => {
  if (typeof window === "undefined") return "light";

  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return theme === "dark" ? "dark" : "light";
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = window.localStorage.getItem("theme") as Theme | null;
    const nextTheme = savedTheme ?? defaultTheme;
    setThemeState(nextTheme);
    setMounted(true);
  }, [defaultTheme]);

  React.useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const resolvedTheme = getResolvedTheme(theme);
    const root = document.documentElement;

    root.classList.toggle("dark", resolvedTheme === "dark");
    root.dataset.theme = resolvedTheme;
    window.localStorage.setItem("theme", theme);
  }, [mounted, theme]);

  const value = React.useMemo<ThemeContextType>(
    () => ({
      theme,
      resolvedTheme: getResolvedTheme(theme),
      setTheme: (nextTheme) => setThemeState(nextTheme),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
