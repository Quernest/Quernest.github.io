
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function () {
  'use strict';

  var colorIndexRegExp = /((?:not )?all and )?(\(color-index: *(22|48|70)\))/i;
  var prefersColorSchemeRegExp = /prefers-color-scheme:/i;

  var prefersColorSchemeInit = function (initialColorScheme) {
    var mediaQueryString = '(prefers-color-scheme: dark)';
    var mediaQueryList = window.matchMedia && matchMedia(mediaQueryString);
    var hasNativeSupport = mediaQueryList && mediaQueryList.media === mediaQueryString;

    var mediaQueryListener = function () {
      set(mediaQueryList.matches ? 'dark' : 'light');
    };

    var removeListener = function () {
      if (mediaQueryList) {
        mediaQueryList.removeListener(mediaQueryListener);
      }
    };

    var set = function (colorScheme) {
      if (colorScheme !== currentColorScheme) {
        currentColorScheme = colorScheme;

        if (typeof result.onChange === 'function') {
          result.onChange();
        }
      }

      [].forEach.call(document.styleSheets || [], function (styleSheet) {
        [].forEach.call(styleSheet.cssRules || [], function (cssRule) {
          var colorSchemeMatch = prefersColorSchemeRegExp.test(Object(cssRule.media).mediaText);

          if (colorSchemeMatch) {
            var index = [].indexOf.call(cssRule.parentStyleSheet.cssRules, cssRule);
            cssRule.parentStyleSheet.deleteRule(index);
          } else {
            var colorIndexMatch = (Object(cssRule.media).mediaText || '').match(colorIndexRegExp);

            if (colorIndexMatch) {
              cssRule.media.mediaText = ((/^dark$/i.test(colorScheme) ? colorIndexMatch[3] === '48' : /^light$/i.test(colorScheme) ? colorIndexMatch[3] === '70' : colorIndexMatch[3] === '22') ? 'not all and ' : '') + cssRule.media.mediaText.replace(colorIndexRegExp, '$2');
            }
          }
        });
      });
    };

    var result = Object.defineProperty({
      hasNativeSupport: hasNativeSupport,
      removeListener: removeListener
    }, 'scheme', {
      get: function () { return currentColorScheme; },
      set: set
    }); // initialize the color scheme using the provided value, the system value, or light

    var currentColorScheme = initialColorScheme || (mediaQueryList && mediaQueryList.matches ? 'dark' : 'light');
    set(currentColorScheme); // listen for system changes

    if (mediaQueryList) {
      mediaQueryList.addListener(mediaQueryListener);
    }

    return result;
  };
  //# sourceMappingURL=index.mjs.map

  var THEME_LOCAL_STORAGE_KEY = 'theme';
  var THEME_DARK_CLASS = 'theme-dark';
  var THEME_LIGHT_CLASS = 'theme-light';
  var THEME_META_NAME = 'theme-color';
  var SCHEME_DARK = 'dark';
  var SCHEME_LIGHT = 'light';

  var prefersColorScheme = prefersColorSchemeInit();
  var currentScheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
  var themeToggler = document.querySelector(".theme-toggler");
  var meta = document.createElement("meta");
  var body = document.body;

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

}());
