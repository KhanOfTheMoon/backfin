const API_URL = '/api';

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

  // API HELPER 
  async function api(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
      });
      return await res.json();
    } catch (error) {
      console.error("API Error:", error);
      return { msg: "Network Error" };
    }
  }

  // USER 
  function setUser(u) { localStorage.setItem('user', JSON.stringify(u)); }
  function getUser() { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; }
  function isLogged() { return !!getUser(); }
  function logout() { 
    localStorage.removeItem('user'); 
    localStorage.removeItem('token');
    updateBadges(); 
  }

  // CART 
  function readCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
  function writeCart(c) { localStorage.setItem('cart', JSON.stringify(c)); updateBadges(); }
  function addToCart(id) { 
    const c = readCart(); 
    if (!c.includes(id)) {
      c.push(id); 
      writeCart(c);
      alert('Added to cart');
    } else {
      alert('Already in cart');
    }
  }
  function getCart() { return readCart(); }
  function clearCart() { writeCart([]); }

  function updateBadges() {
    const c = readCart();
    const cart = document.getElementById('cartBadge');
    if (cart) { cart.textContent = c.length; cart.style.display = c.length ? 'inline-grid' : 'none'; }
  }

  // SEARCH 
  function bindHeaderSearch(formId, inputId) {
    const f = document.getElementById(formId);
    if (!f) return;
    f.addEventListener('submit', e => {
      e.preventDefault();
      const q = document.getElementById(inputId).value.trim();
      location.href = 'search.html?q=' + encodeURIComponent(q);
    });
  }

  document.addEventListener('DOMContentLoaded', updateBadges);

  return {
    qs, stars, money, bindHeaderSearch,
    getUser, setUser, isLogged, logout,
    addToCart, getCart, clearCart,
    api
  };
})();

// Theme Toggle 
(function () {
  const KEY = 'qbook_theme';
  const root = document.documentElement;
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch (e) { }
  }
  const saved = (() => { try { return localStorage.getItem(KEY); } catch (e) { return null; } })();
  const initial = saved || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(initial);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const now = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(now);
    });
  }
})();

// Mobile Menu
(function () {
  const menuBtn = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  if (!menuBtn || !menu) return;
  function closeMenu() { menu.classList.remove('active'); }
  function toggleMenu() { menu.classList.toggle('active'); }
  menuBtn.addEventListener('click', toggleMenu);
  menu.addEventListener('click', (e) => { if (e.target.tagName === 'A') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMenu(); });
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== menuBtn) closeMenu();
  }, true);
})();