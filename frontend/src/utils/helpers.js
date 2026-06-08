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