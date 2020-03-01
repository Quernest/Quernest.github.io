import initPrefersColorScheme from 'css-prefers-color-scheme';

const prefersColorScheme = initPrefersColorScheme();
const darkModeToggler = document.querySelector('.theme-toggler');
const body = document.body;

const applyDarkTheme = () => {
  if (body.classList.contains('theme-light')) {
    body.classList.remove('theme-light');
  }

  body.classList.add('theme-dark');
};

const applyLightTheme = () => {
  if (body.classList.contains('theme-dark')) {
    body.classList.remove('theme-dark');
  }

  body.classList.add('theme-light');
};

let chosenTheme = localStorage.getItem('theme');

if (chosenTheme) {
  prefersColorScheme.scheme = chosenTheme;
}

prefersColorScheme.scheme === 'dark' ? applyDarkTheme() : applyLightTheme();
darkModeToggler.dataset.mode = prefersColorScheme.scheme;

const onTogglerClick = () => {
  if (prefersColorScheme.scheme === 'dark') {
    prefersColorScheme.scheme = 'light';
    applyLightTheme();
  } else if (prefersColorScheme.scheme === 'light') {
    prefersColorScheme.scheme = 'dark';
    applyDarkTheme();
  } else {
    applyLightTheme();
  }

  localStorage.setItem('theme', prefersColorScheme.scheme);
  darkModeToggler.dataset.mode = prefersColorScheme.scheme;
};

darkModeToggler.addEventListener('click', onTogglerClick);
