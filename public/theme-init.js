(function () {
  try {
    var storageKey = 'tcps-theme';
    var root = document.documentElement;
    var savedTheme = window.localStorage.getItem(storageKey);
    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var theme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : systemTheme;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  } catch (error) {}
})();
