import React from 'react';

export const Contador = ({ value, onAdd, onRemove, onChange }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
    <button className="icon-btn" onClick={onRemove} aria-label="Restar">−</button>
    <input type="number" min="1" value={value}
      onChange={(e) => { const v=parseInt(e.target.value); if(!isNaN(v) && v>=0) onChange(v); }}
      style={{ width:'36px', textAlign:'center', border:'1.5px solid var(--border)', borderRadius:'8px', padding:'5px 0', fontFamily:'var(--font-body)', fontWeight:600, fontSize:'0.9rem', background:'transparent', color:'var(--ink)' }}
    />
    <button className="icon-btn" onClick={onAdd} aria-label="Sumar">+</button>
  </div>
);
