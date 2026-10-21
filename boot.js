// Runs before first paint: embed mode flag and the remembered (opt-in) light theme.
(function () {
  var d = document.documentElement;
  if (/[?&]embed=1(&|$)/.test(location.search)) d.classList.add("embed");
  try { if (localStorage.getItem("theme") === "light") d.dataset.theme = "light"; } catch (e) { /* storage blocked */ }
})();
