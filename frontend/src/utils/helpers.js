import { BACKEND } from '../constants/index.js';

export const moneda = (v) =>
  new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP', minimumFractionDigits:0 }).format(v);

export const imgSrc = (url) => {
  if (!url) return 'https://via.placeholder.com/300';
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_800,c_limit/');
  }
  if (url.startsWith('http')) return url;
  return `${BACKEND}/productos/${url}`;
};

export const normaliza = (s) => (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();

export const slugify = (nombre) =>
  (nombre||'').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

export const flyToCart = (e, imgSrc) => {
  const cartIcon = document.getElementById('cart-icon');
  if (!cartIcon || !e) return;
  
  // Find the image element to get its bounding rect
  const card = e.currentTarget.closest('.prod-card') || e.currentTarget.closest('.modal-sheet');
  if (!card) return;
  const imgEl = card.querySelector('img');
  if (!imgEl) return;

  const startRect = imgEl.getBoundingClientRect();
  const endRect = cartIcon.getBoundingClientRect();

  const flyImg = document.createElement('img');
  flyImg.src = imgSrc;
  flyImg.className = 'fly-item';
  flyImg.style.top = `${startRect.top}px`;
  flyImg.style.left = `${startRect.left}px`;
  flyImg.style.width = `${startRect.width}px`;
  flyImg.style.height = `${startRect.height}px`;

  document.body.appendChild(flyImg);

  // Trigger reflow
  flyImg.getBoundingClientRect();

  // Move to cart
  flyImg.style.top = `${endRect.top + endRect.height/2 - 15}px`;
  flyImg.style.left = `${endRect.left + endRect.width/2 - 15}px`;
  flyImg.style.width = '30px';
  flyImg.style.height = '30px';
  flyImg.style.opacity = '0';
  flyImg.style.transform = 'scale(0.2)';

  // Pop animation on cart
  setTimeout(() => {
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => cartIcon.style.transform = 'scale(1)', 200);
    flyImg.remove();
  }, 700);
};