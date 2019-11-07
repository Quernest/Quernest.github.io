/* eslint-disable */

/**
 * Creates a temporary global va object and loads va-loader.js.
 * Parameters t, s, and m are all used internally. They could have been
 * declared using 'var', instead they are declared as parameters to save
 * 4 bytes ('var').
 *
 * @param {Window} w The global context object.
 * @param {HTMLDocument} d The DOM document object.
 * @param {string} t Must be 'script'.
 * @param {string} u URL of the va-loader.js script.
 * @param {number} i Id of configuration object.
 * @param {HTMLElement} s Async script tag.
 * @param {HTMLElement} m First script tag in document.
 */
(function(w, d, t, u, i, s, m) {
  w.__va__ = w.__va__ || function (cb) {
    (w.__va__.q = w.__va__.q || []).push(cb);
  };
  w.__va__.id = w.__va__.id || i;
  s = d.createElement(t);
  m = d.getElementsByTagName(t)[0];
  s.async = 1;
  s.src = u;
  m.parentNode.insertBefore(s, m);
})(window, document, 'script', 'scripts/va-loader.js', 1);
