// Общие помощники и состояние
window.helpers = (function () {
  const stateKey = 'qbook_state';

  // Query String
  function qs(name, search) {
    const p = new URLSearchParams(search ?? location.search);
    return p.get(name);
  }
  function stars(n) {
    const r = Math.round(n);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }
  function money(v) { return v.toLocaleString('ru-RU') + ' ₸'; }

  // Манипуляции с local storage
  function read() {
    return JSON.parse(localStorage.getItem(stateKey) ||
      '{"cart":[],"reviews":{},"user":null}');
  }
  function write(s) { localStorage.setItem(stateKey, JSON.stringify(s)); updateBadges(); }
  function updateBadges() {
    const s = read();
    const cart = document.getElementById('cartBadge');
    if (cart) { cart.textContent = s.cart.length; cart.style.display = s.cart.length ? 'inline-grid' : 'none'; }
  }

  // отзывы
  function getReviews(id) { const s = read(); return s.reviews[id] || []; }
  function addReview(id, review) {
    const s = read(); s.reviews[id] = s.reviews[id] || []; s.reviews[id].push(review); write(s);
  }

  // пользователь
  function setUser(u) { const s = read(); s.user = u; write(s); }
  function getUser() { return read().user; }
  function isLogged() { return !!read().user; }
  function logout() { const s = read(); s.user = null; write(s); }

  // корзина
  function addToCart(id) { const s = read(); if (!s.cart.includes(id)) s.cart.push(id); write(s); }
  function getCart() { return read().cart; }
  function clearCart() { const s = read(); s.cart = []; write(s); }

  // поиск из хедера
  function bindHeaderSearch(formId, inputId) {
    const f = document.getElementById(formId);
    if (!f) return;
    f.addEventListener('submit', e => {
      e.preventDefault();
      const q = document.getElementById(inputId).value.trim();
      location.href = 'search.html?q=' + encodeURIComponent(q);
    });
  }

  // badge при старте
  document.addEventListener('DOMContentLoaded', updateBadges);

  return {
    qs, stars, money,
    bindHeaderSearch,
    getReviews, addReview,
    addToCart, getCart, clearCart,
    setUser, getUser, isLogged, logout,
    read, write
  };
})();

// Переключение тем
(function () {
  const KEY = 'qbook_theme'; // 'light' | 'dark'
  const root = document.documentElement;

  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch (e) { }
  }

  // Проверка какая тема
  const saved = (() => {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  })();
  const initial = saved || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(initial);

  // Кнопка
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const now = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; // Если дарк то лайт и наоборот
      setTheme(now);
    });
  }
})();

// Бургер
(function () {
  const menuBtn = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');

  if (!menuBtn || !menu) return;

  function closeMenu() { menu.classList.remove('active'); }
  function toggleMenu() { menu.classList.toggle('active'); }

  menuBtn.addEventListener('click', toggleMenu);

  // Закрытие по клику на ссылку
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeMenu();
  });

  // Закрытие при ресайзе на десктоп
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });

  // Закрытие по клику вне меню
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== menuBtn) {
      closeMenu();
    }
  }, true);
})();
