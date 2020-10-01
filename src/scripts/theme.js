import initPrefersColorScheme from "css-prefers-color-scheme";

import {
  SCHEME_DARK,
  SCHEME_LIGHT,
  THEME_META_NAME,
  THEME_DARK_CLASS,
  THEME_LIGHT_CLASS,
  THEME_LOCAL_STORAGE_KEY,
} from "./constants";

const prefersColorScheme = initPrefersColorScheme();
const currentScheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
const themeToggler = document.querySelector(".theme-toggler");
const meta = document.createElement("meta");
const body = document.body;

function getThemeColor() {
  return window.getComputedStyle(document.body).backgroundColor;
}

function applyDarkTheme() {
  if (body.classList.contains(THEME_LIGHT_CLASS)) {
    body.classList.remove(THEME_LIGHT_CLASS);
  }

  body.classList.add(THEME_DARK_CLASS);
}

function applyLightTheme() {
  if (body.classList.contains(THEME_DARK_CLASS)) {
    body.classList.remove(THEME_DARK_CLASS);
  }

  body.classList.add(THEME_LIGHT_CLASS);
}

function onTogglerClick(event) {
  if (prefersColorScheme.scheme === SCHEME_DARK) {
    prefersColorScheme.scheme = SCHEME_LIGHT;
    applyLightTheme();
  } else if (prefersColorScheme.scheme === SCHEME_LIGHT) {
    prefersColorScheme.scheme = SCHEME_DARK;
    applyDarkTheme();
  } else {
    applyLightTheme();
  }

  event.target.dataset.mode = prefersColorScheme.scheme;

  if (meta) {
    meta.content = getThemeColor();
  }

  localStorage.setItem(THEME_LOCAL_STORAGE_KEY, prefersColorScheme.scheme);
}

if (currentScheme) {
  prefersColorScheme.scheme = currentScheme;
}

prefersColorScheme.scheme === "dark" ? applyDarkTheme() : applyLightTheme();
themeToggler.dataset.mode = prefersColorScheme.scheme;
meta.name = THEME_META_NAME;
meta.content = getThemeColor();
themeToggler.addEventListener("click", onTogglerClick);
document.getElementsByTagName("head")[0].appendChild(meta);
