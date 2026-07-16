/* Applies page edits saved from the admin panel (admin.html).
   The admin stores a full snapshot of each page's <body> in localStorage
   under 'riwayat_content' as { "<page>.html": { "body": "<html>" } }.
   This script must be loaded BEFORE main.js: both wait for
   DOMContentLoaded, so the snapshot is swapped in first and main.js then
   binds its handlers to the restored elements. */
(function () {
  var PAGE = location.pathname.split('/').pop() || 'index.html';
  var store = {};
  try { store = JSON.parse(localStorage.getItem('riwayat_content') || '{}'); } catch (e) {}
  var snapshot = store[PAGE] && store[PAGE].body;
  if (!snapshot) return;

  function apply() {
    /* Inline scripts inserted via innerHTML never execute, so the inert
       script tags inside the snapshot are harmless. */
    document.body.innerHTML = snapshot;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
