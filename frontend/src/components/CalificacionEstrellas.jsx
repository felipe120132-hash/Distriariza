import React, { useState, memo } from 'react';

export const CalificacionEstrellas = memo(({ productId, ratings, onRate, readonly = false, size = '1rem' }) => {
  const [hover, setHover] = useState(0);
  const current = ratings[productId] || 0;
  return (
    <div style={{ display:'flex', gap:'2px', alignItems:'center' }}>
      {[1,2,3,4,5].map(star => (
        <span key={star} className={readonly ? '' : 'star'}
          style={{ fontSize:size, color:(hover || current) >= star ? 'var(--gold)' : 'var(--ink-3)', lineHeight:1, cursor:readonly ? 'default' : 'pointer' }}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onRate(productId, star)}
        >★</span>
      ))}
      {current > 0 && !readonly && (
        <span style={{ fontSize:'0.7rem', color:'var(--ink-3)', marginLeft:'4px' }}>{current}/5</span>
      )}
    </div>
  );
});
