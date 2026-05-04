document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });

  const searchInput = document.querySelector('#trackSearch');
  const genreFilter = document.querySelector('#genreFilter');
  const versionFilter = document.querySelector('#versionFilter');
  const bpmFilter = document.querySelector('#bpmFilter');
  const clearFilters = document.querySelector('#clearFilters');
  const rows = Array.from(document.querySelectorAll('[data-track-row]'));

  const applyFilters = () => {
    if (!rows.length) return;

    const query = (searchInput?.value || '').toLowerCase();
    const genre = genreFilter?.value || 'all';
    const version = versionFilter?.value || 'all';
    const bpm = bpmFilter?.value || 'all';

    rows.forEach((row) => {
      const text = (row.dataset.search || '').toLowerCase();
      const rowGenre = row.dataset.genre || '';
      const rowVersion = row.dataset.version || '';
      const rowBpm = Number(row.dataset.bpm || 0);

      const matchesQuery = text.includes(query);
      const matchesGenre = genre === 'all' || rowGenre === genre;
      const matchesVersion = version === 'all' || rowVersion === version;
      let matchesBpm = true;

      if (bpm === 'under100') matchesBpm = rowBpm < 100;
      if (bpm === '100to110') matchesBpm = rowBpm >= 100 && rowBpm <= 110;
      if (bpm === '111plus') matchesBpm = rowBpm >= 111;

      row.style.display = matchesQuery && matchesGenre && matchesVersion && matchesBpm ? '' : 'none';
    });
  };

  [searchInput, genreFilter, versionFilter, bpmFilter].forEach((element) => {
    if (element) {
      element.addEventListener('input', applyFilters);
      element.addEventListener('change', applyFilters);
    }
  });

  if (clearFilters) {
    clearFilters.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (genreFilter) genreFilter.value = 'all';
      if (versionFilter) versionFilter.value = 'all';
      if (bpmFilter) bpmFilter.value = 'all';
      applyFilters();
      searchInput?.focus();
    });
  }

  applyFilters();
});
