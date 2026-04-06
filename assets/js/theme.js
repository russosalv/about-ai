(function () {
  var STORAGE_KEY = "theme";

  function getPreferred() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var btn = document.querySelector(".theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "\u2600" : "\u263D";
  }

  function toggle() {
    var current = document.documentElement.getAttribute("data-theme") || getPreferred();
    var next = current === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  }

  // Apply immediately to prevent flash
  apply(getPreferred());

  // Bind toggle button after DOM ready
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-toggle");
    if (btn) btn.addEventListener("click", toggle);
  });
})();
