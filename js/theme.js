// js/theme.js — dark / light mode toggle with persistence

const Theme = (function () {
  const THEME_KEY = "gmail_clone_theme";

  function apply(theme) {
    document.body.classList.toggle("dark", theme === "dark");
  }

  function init() {
    const saved = localStorage.getItem(THEME_KEY) || "light";
    apply(saved);
  }

  function toggle() {
    const isDark = document.body.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    apply(next);
    localStorage.setItem(THEME_KEY, next);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeToggleBtn");
    if (btn) btn.addEventListener("click", toggle);
  });

  return { init, toggle };
})();
