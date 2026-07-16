/* Applies content edits saved from the admin panel (admin.html).
   Overrides are stored in localStorage under 'riwayat_content' as
   { "<page>.html": { "<css path>": "<html>" } } and applied on load. */
(function () {
  var PAGE = location.pathname.split('/').pop() || 'index.html';
  var store = {};
  try { store = JSON.parse(localStorage.getItem('riwayat_content') || '{}'); } catch (e) {}
  var overrides = store[PAGE] || {};

  function apply() {
    Object.keys(overrides).forEach(function (path) {
      try {
        var el = document.querySelector(path);
        if (el) el.innerHTML = overrides[path];
      } catch (e) { /* stale selector after a layout change — skip */ }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
