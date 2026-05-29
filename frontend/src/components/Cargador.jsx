import React from 'react';

export const Cargador = () => (
  <div style={{
    position: 'fixed', inset: 0,
    background: 'var(--bg)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: '36px', zIndex: 9999
  }}>
    {/* Glow ring behind wheel */}
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        position: 'absolute',
        width: '200px', height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,131,74,0.18) 0%, transparent 70%)',
        filter: 'blur(12px)',
        animation: 'pulse 2s ease-in-out infinite',
      }} />
      <div
        aria-label="Hamster corriendo en una rueda"
        role="img"
        className="wheel-and-hamster"
        style={{ fontSize: '16px' }}
      >
        <div className="wheel"></div>
        <div className="hamster">
          <div className="hamster__body">
            <div className="hamster__head">
              <div className="hamster__ear"></div>
              <div className="hamster__eye"></div>
              <div className="hamster__nose"></div>
            </div>
            <div className="hamster__limb hamster__limb--fr"></div>
            <div className="hamster__limb hamster__limb--fl"></div>
            <div className="hamster__limb hamster__limb--br"></div>
            <div className="hamster__limb hamster__limb--bl"></div>
            <div className="hamster__tail"></div>
          </div>
        </div>
        <div className="spoke"></div>
      </div>
    </div>

    <div style={{ textAlign: 'center' }}>
      <p style={{
        fontFamily: 'var(--font-display)', fontSize: '1.8rem',
        fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.5px',
        marginBottom: '6px'
      }}>
        Distribuciones Ariza
      </p>
      <p style={{
        fontSize: '0.82rem', color: 'var(--ink-3)',
        fontWeight: 500, letterSpacing: '1.5px',
        textTransform: 'uppercase'
      }}>
        Cargando catálogo…
      </p>
    </div>
  </div>
);
