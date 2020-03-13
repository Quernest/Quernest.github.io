import initPrefersColorScheme from 'css-prefers-color-scheme';

const prefersColorScheme = initPrefersColorScheme();
const darkModeToggler = document.querySelector('.theme-toggler');
const meta = document.createElement('meta');
const body = document.body;

function getThemeColor() {
  return window.getComputedStyle(document.body).backgroundColor;
}

function applyDarkTheme() {
  if (body.classList.contains('theme-light')) {
    body.classList.remove('theme-light');
  }

  body.classList.add('theme-dark');
}

function applyLightTheme() {
  if (body.classList.contains('theme-dark')) {
    body.classList.remove('theme-dark');
  }

  body.classList.add('theme-light');
}

let chosenTheme = localStorage.getItem('theme');

if (chosenTheme) {
  prefersColorScheme.scheme = chosenTheme;
}

prefersColorScheme.scheme === 'dark' ? applyDarkTheme() : applyLightTheme();
darkModeToggler.dataset.mode = prefersColorScheme.scheme;
meta.name = 'theme-color';
meta.content = getThemeColor();

function onTogglerClick() {
  if (prefersColorScheme.scheme === 'dark') {
    prefersColorScheme.scheme = 'light';
    applyLightTheme();
  } else if (prefersColorScheme.scheme === 'light') {
    prefersColorScheme.scheme = 'dark';
    applyDarkTheme();
  } else {
    applyLightTheme();
  }

  if (meta) {
    meta.content = getThemeColor();
  }

  localStorage.setItem('theme', prefersColorScheme.scheme);
  darkModeToggler.dataset.mode = prefersColorScheme.scheme;
}

darkModeToggler.addEventListener('click', onTogglerClick);
document.getElementsByTagName('head')[0].appendChild(meta);
