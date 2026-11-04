"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

// 用户手动点过切换后将这个标记写成 manual，之后不再自动改主题
export const THEME_SOURCE_KEY = "theme-source";

const DAY_START = 7;
const DAY_END = 19;

export function AutoTheme() {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (localStorage.getItem(THEME_SOURCE_KEY) === "manual") return;
    const hour = new Date().getHours();
    setTheme(hour >= DAY_START && hour < DAY_END ? "light" : "dark");
  }, [setTheme]);

  return null;
}
