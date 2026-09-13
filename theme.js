// Runs before CSS to avoid a flash; storage failures never block rendering.
(() => {
  let saved;
  try { saved = localStorage.getItem('lorensio-theme'); } catch {}
  const theme = ['light', 'dark'].includes(saved) ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
})();
