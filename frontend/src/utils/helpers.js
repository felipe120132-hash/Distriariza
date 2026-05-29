import { BACKEND } from '../constants/index.js';

export const moneda = (v) =>
  new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP', minimumFractionDigits:0 }).format(v);

export const imgSrc = (url) =>
  !url ? 'https://via.placeholder.com/300' : url.startsWith('http') ? url : `${BACKEND}/productos/${url}`;

export const normaliza = (s) => (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
