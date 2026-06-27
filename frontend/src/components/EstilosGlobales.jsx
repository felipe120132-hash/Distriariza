import React from 'react';

export const EstilosGlobales = ({ dark }) => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:     ${dark ? '#f0f0ee' : '#0f0f0f'};
      --ink-2:   ${dark ? '#a0a0a0' : '#6b6b6b'};
      --ink-3:   ${dark ? '#555555' : '#b0b0b0'};
      --surface: ${dark ? '#1a1a1e' : '#ffffff'};
      --bg:      ${dark ? '#111115' : '#f5f4f1'};
      --card-bg: ${dark ? '#1f1f25' : '#ffffff'};
      --border:  ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'};
      --accent:  #1a5cff;
      --accent-h:#0040d8;
      --green:   #22c55e;
      --gold:    #f59e0b;
      --radius:  16px;
      --font-body: 'DM Sans', sans-serif;
      --font-display: 'Outfit', sans-serif;
      --shadow-sm: ${dark ? '0 1px 3px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.06)'};
      --shadow-md: ${dark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.08)'};
      --shadow-lg: ${dark ? '0 12px 40px rgba(0,0,0,0.6)' : '0 12px 40px rgba(0,0,0,0.12)'};
    }

    body {
      font-family: var(--font-body);
      background: var(--bg);
      color: var(--ink);
      transition: background 0.3s ease, color 0.3s ease;
    }

    input:focus { outline: 2px solid var(--accent); outline-offset: 0; }

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--ink-3); border-radius: 99px; }

    .aquarium-hero {
      position: relative;
      width: 100%;
      height: 440px;
      background: linear-gradient(180deg, #0a3d6b 0%, #0d5fa0 40%, #1a8cb8 75%, #2db8c8 100%);
      overflow: hidden;
    }

    .hero-text {
      position: absolute; bottom: 52px; left: 36px; z-index: 20;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    .loader-ring {
      width: 40px; height: 40px;
      border: 2px solid var(--bg);
      border-top-color: var(--ink);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.45s ease both; }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .prod-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
    .prod-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }

    .img-container {
      position: relative;
      overflow: hidden;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s ease;
    }

    .img-blend {
      mix-blend-mode: multiply;
      filter: contrast(1.05);
    }

    .img-container::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .prod-card:hover .img-container::after { opacity: 1; }

    .zoom-img {
      transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .prod-card:hover .zoom-img {
      transform: scale(1.12);
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);   opacity: 1; }
    }
    .panel { animation: slideIn 0.32s cubic-bezier(0.22,1,0.36,1) both; }

    @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes modalIn {
      from { opacity: 0; transform: translate(-50%,-46%) scale(0.93); }
      to   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
    }
    .modal { animation: modalIn 0.38s cubic-bezier(0.34,1.56,0.64,1) both; }
    .modal-overlay { animation: overlayIn 0.25s ease both; }

    .modal-img { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
    .modal-img:hover { transform: scale(1.06); }

    @keyframes revealUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .modal-content-1 { animation: revealUp 0.35s 0.15s ease both; }
    .modal-content-2 { animation: revealUp 0.35s 0.22s ease both; }
    .modal-content-3 { animation: revealUp 0.35s 0.30s ease both; }
    .modal-content-4 { animation: revealUp 0.35s 0.38s ease both; }

    .pill-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 10px 20px; border-radius: 99px;
      font-family: var(--font-body); font-size: 0.82rem; font-weight: 600;
      border: none; cursor: pointer; transition: background 0.2s, transform 0.15s;
    }
    .pill-btn:active { transform: scale(0.97); }
    .pill-btn--accent { background: var(--accent); color: #fff; }
    .pill-btn--accent:hover { background: var(--accent-h); }
    .pill-btn--ghost { background: ${dark ? 'rgba(255,255,255,0.08)' : '#ededea'}; color: var(--ink); }
    .pill-btn--ghost:hover { background: ${dark ? 'rgba(255,255,255,0.14)' : '#e2e2de'}; }
    .pill-btn--green { background: var(--green); color: #fff; }

    @keyframes fly-1 {
      from { transform: translateY(0.1em); }
      to   { transform: translateY(-0.1em); }
    }

    .send-btn {
      font-family: var(--font-body);
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      border: none;
      border-radius: 16px;
      background: var(--accent);
      color: #fff;
      padding: 0.6em 1em 0.6em 0.85em;
      display: inline-flex;
      align-items: center;
      overflow: hidden;
      transition: background 0.2s, transform 0.15s, opacity 0.2s;
    }
    .send-btn:hover:not(:disabled) { background: var(--accent-h); }
    .send-btn:active { transform: scale(0.95); }
    .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .send-btn .plus-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15em;
      font-weight: 900;
      line-height: 1;
      min-width: 1em;
      transform-origin: center center;
      transition: transform 0.3s ease-in-out;
      flex-shrink: 0;
    }
    .send-btn .btn-label {
      display: block;
      margin-left: 0.35em;
      transition: transform 0.3s ease-in-out;
      white-space: nowrap;
    }
    .send-btn .svg-wrapper-1 { display: flex; align-items: center; }
    .send-btn .svg-wrapper   { display: flex; align-items: center; }

    .send-btn:hover:not(:disabled) .svg-wrapper {
      animation: fly-1 0.6s ease-in-out infinite alternate;
    }
    .send-btn:hover:not(:disabled) .plus-icon {
      transform: translateX(1.2em) rotate(45deg) scale(1.1);
    }
    .send-btn:hover:not(:disabled) .btn-label {
      transform: translateX(5em);
    }

    .send-btn--sm { font-size: 0.72rem; border-radius: 12px; padding: 0.5em 0.9em 0.5em 0.75em; }
    .send-btn--sm .plus-icon { font-size: 1.1em; }
    .send-btn--lg { font-size: 0.9rem; border-radius: 16px; padding: 0.75em 1.2em 0.75em 1em; }
    .send-btn--lg .plus-icon { font-size: 1.25em; }

    .add-btn {
      position: relative;
      width: 130px;
      height: 38px;
      cursor: pointer;
      display: flex;
      align-items: center;
      border: 1.5px solid var(--accent-h);
      background-color: var(--accent);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s;
      font-family: var(--font-body);
    }
    .add-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .add-btn__text, .add-btn__icon { transition: all 0.3s; }
    .add-btn__text {
      transform: translateX(22px);
      color: #fff;
      font-weight: 600;
      font-size: 0.82rem;
      white-space: nowrap;
    }
    .add-btn__icon {
      position: absolute;
      transform: translateX(96px);
      height: 100%;
      width: 36px;
      background-color: var(--accent-h);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .add-btn__icon svg { width: 20px; stroke: #fff; }
    .add-btn:hover:not(:disabled) { background: var(--accent-h); }
    .add-btn:hover:not(:disabled) .add-btn__text { color: transparent; }
    .add-btn:hover:not(:disabled) .add-btn__icon { width: 128px; transform: translateX(0); }
    .add-btn:active:not(:disabled) .add-btn__icon { background-color: #0030b0; }
    .add-btn:active:not(:disabled) { border-color: #0030b0; }
    .add-btn--sm { width: 100px; height: 32px; }
    .add-btn--sm .add-btn__text { transform: translateX(16px); font-size: 0.75rem; }
    .add-btn--sm .add-btn__icon { transform: translateX(66px); width: 30px; }
    .add-btn--sm:hover:not(:disabled) .add-btn__icon { width: 98px; transform: translateX(0); }

    .icon-btn {
      width: 36px; height: 36px; border-radius: 10px;
      border: none; background: ${dark ? 'rgba(255,255,255,0.1)' : '#ededea'}; color: var(--ink);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 0.9rem; transition: background 0.15s;
    }
    .icon-btn:hover { background: ${dark ? 'rgba(255,255,255,0.18)' : '#ddddd9'}; }

    .form-input {
      width: 100%; padding: 13px 16px; border-radius: 12px;
      border: 1.5px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e5e5e1'};
      background: ${dark ? 'rgba(255,255,255,0.05)' : 'var(--surface)'};
      font-family: var(--font-body); font-size: 0.9rem; color: var(--ink);
      transition: border-color 0.2s;
    }
    .form-input:focus { border-color: var(--accent); }
    .form-input::placeholder { color: var(--ink-3); }
    textarea.form-input { font-family: var(--font-body); }

    .story-highlight {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      background: none; border: none; cursor: pointer; flex-shrink: 0; width: 80px;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .story-highlight:hover { transform: translateY(-4px) scale(1.05); }
    .story-highlight:active { transform: scale(0.93); }
    
    .story-ring {
      position: relative; width: 72px; height: 72px; border-radius: 50%;
      padding: 3px;
      background: ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'};
      transition: background 0.3s, box-shadow 0.3s, transform 0.3s;
    }
    .story-highlight:hover .story-ring {
      box-shadow: 0 4px 20px rgba(26,92,255,0.25);
    }
    .story-highlight--on .story-ring {
      background: linear-gradient(135deg, #0066ff 0%, #00b4ff 50%, #00d4aa 100%);
      box-shadow: 0 4px 24px rgba(0,102,255,0.4);
    }
    
    .story-icon {
      width: 100%; height: 100%; border-radius: 50%;
      background: ${dark ? '#18181b' : '#fff'};
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; transition: background 0.3s;
      overflow: hidden; position: relative;
    }
    .story-icon img {
      width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
    }
    .story-highlight--on .story-icon {
      background: ${dark ? '#0a0a0f' : '#f0f7ff'};
    }
    
    .story-label {
      font-size: 0.7rem; font-weight: 500; color: var(--ink-2);
      text-align: center; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      transition: color 0.3s, font-weight 0.3s;
      font-family: var(--font-body);
    }
    .story-highlight--on .story-label { font-weight: 700; color: var(--ink); }

    .nav-tab {
      background: none; border: none; cursor: pointer;
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      position: relative; padding: 6px 16px; border-radius: 20px;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s, box-shadow 0.3s;
    }
    .nav-tab:hover { transform: translateY(-5px) scale(1.08); background: ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'}; }
    .nav-tab:active { transform: translateY(-2px) scale(0.95); }
    .nav-tab-icon { display: inline-block; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .nav-tab:hover .nav-tab-icon { transform: scale(1.22) rotate(6deg); }
    .nav-tab-badge { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .nav-tab:hover .nav-tab-badge { transform: scale(1.15) translate(2px, -2px); }

    .review-tab {
      transition: color 0.25s, border-color 0.25s, transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    }
    .review-tab:hover { transform: translateY(-2px); color: var(--accent) !important; }

    .dark-toggle {
      width: 48px; height: 26px; border-radius: 99px; border: none; cursor: pointer;
      position: relative; transition: background 0.3s;
      background: ${dark ? 'var(--accent)' : '#d1d1ce'};
      flex-shrink: 0;
    }
    .dark-toggle::after {
      content: ''; position: absolute; top: 3px;
      left: ${dark ? '25px' : '3px'};
      width: 20px; height: 20px; border-radius: 50%;
      background: white; transition: left 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }

    .star { cursor: pointer; transition: transform 0.15s; font-size: 1rem; }
    .star:hover { transform: scale(1.2); }

    @keyframes badgePop {
      0%   { transform: scale(0.6) rotate(-12deg); opacity: 0; }
      60%  { transform: scale(1.1) rotate(2deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .badge-best { animation: badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }

    .best-scroll {
      display: flex; gap: 16px; overflow-x: auto;
      padding-bottom: 12px; scrollbar-width: none;
    }
    .best-scroll::-webkit-scrollbar { display: none; }

    * { transition-property: background-color, border-color, color; transition-duration: 0.25s; }
    .caustic-ray, .bubble, .seaweed { transition: none !important; }
    .parallax-layer { transition: none !important; }

    .form-control {
      position: relative; margin: 20px 0 40px; width: 190px;
    }
    .form-control input {
      background-color: transparent; border: 0; border-bottom: 2px #fff solid;
      display: block; width: 100%; padding: 15px 0; font-size: 18px; color: #fff;
    }
    .form-control input:focus, .form-control input:valid { outline: 0; border-bottom-color: lightblue; }
    .form-control label { position: absolute; top: 15px; left: 0; pointer-events: none; }
    .form-control label span {
      display: inline-block; font-size: 18px; min-width: 5px; color: #fff;
      transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    .form-control input:focus + label span,
    .form-control input:valid + label span { color: lightblue; transform: translateY(-30px); }

    .inputbox { position: relative; width: 100%; }
    .inputbox input {
      position: relative; width: 100%; padding: 20px 10px 10px;
      background: transparent; outline: none; box-shadow: none; border: none;
      color: var(--ink); font-family: var(--font-body); font-size: 1em;
      letter-spacing: 0.05em; transition: 0.5s; z-index: 10;
    }
    .inputbox span {
      position: absolute; left: 10px; top: 0; padding: 20px 0 10px;
      font-size: 1em; color: var(--ink-3); letter-spacing: 0.05em;
      transition: 0.5s; pointer-events: none;
    }
    .inputbox input:valid ~ span,
    .inputbox input:focus ~ span {
      color: var(--accent); transform: translateX(-10px) translateY(-28px); font-size: 0.75em;
    }
    .inputbox i {
      position: absolute; left: 0; bottom: 0; width: 100%; height: 2px;
      background: var(--accent); border-radius: 4px; transition: 0.5s;
      pointer-events: none; z-index: 9;
    }
    .inputbox input:valid ~ i,
    .inputbox input:focus ~ i {
      height: 44px;
      background: ${dark ? 'rgba(26,92,255,0.15)' : 'rgba(26,92,255,0.08)'};
      border-radius: 8px;
    }

    .inputbox--hero { position: relative; width: 100%; max-width: 320px; margin-top: 20px; }
    .inputbox--hero input {
      position: relative; width: 100%; padding: 20px 10px 10px;
      background: transparent; outline: none; box-shadow: none; border: none;
      color: #fff; font-family: var(--font-body); font-size: 1.05em;
      letter-spacing: 0.05em; transition: 0.5s; z-index: 10;
    }
    .inputbox--hero span {
      position: absolute; left: 10px; top: 0; padding: 20px 0 10px;
      font-size: 1.05em; color: rgba(255,255,255,0.6); letter-spacing: 0.05em;
      transition: 0.5s; pointer-events: none;
    }
    .inputbox--hero input:focus ~ span,
    .inputbox--hero input:not(:placeholder-shown) ~ span {
      color: #7dd3fc; transform: translateX(-10px) translateY(-28px); font-size: 0.75em;
    }
    .inputbox--hero i {
      position: absolute; left: 0; bottom: 0; width: 100%; height: 2px;
      background: rgba(255,255,255,0.7); border-radius: 4px; transition: 0.5s;
      pointer-events: none; z-index: 9;
    }
    .inputbox--hero input:focus ~ i,
    .inputbox--hero input:not(:placeholder-shown) ~ i {
      height: 44px; background: rgba(255,255,255,0.12); border-radius: 8px;
    }

    /* ── HAMSTER WHEEL ── */
    .wheel-and-hamster {
      --dur: 1s;
      position: relative;
      width: 12em;
      height: 12em;
      font-size: 14px;
    }
    .wheel, .hamster, .hamster div, .spoke { position: absolute; }
    .wheel, .spoke { border-radius: 50%; top: 0; left: 0; width: 100%; height: 100%; }
    .wheel {
      background: radial-gradient(
        100% 100% at center,
        hsla(0,0%,60%,0) 47.8%,
        ${dark ? 'hsl(220,15%,28%)' : 'hsl(220,15%,22%)'} 48%
      );
      z-index: 2;
    }
    .hamster {
      animation: hamster var(--dur) ease-in-out infinite;
      top: 50%; left: calc(50% - 3.5em);
      width: 7em; height: 3.75em;
      transform: rotate(4deg) translate(-0.8em,1.85em);
      transform-origin: 50% 0; z-index: 3;
    }
    .hamster__head {
      animation: hamsterHead var(--dur) ease-in-out infinite;
      background: ${dark ? '#e8a87c' : '#d4834a'};
      border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
      box-shadow: 0 -0.25em 0 ${dark ? '#c97b4b' : '#a85c28'};
      top: 0; left: -2em; width: 2.75em; height: 2.5em; transform-origin: 100% 50%;
    }
    .hamster__ear {
      animation: hamsterEar var(--dur) ease-in-out infinite;
      background: ${dark ? '#e8a87c' : '#d4834a'};
      border-radius: 50% 50% 30% 30%;
      box-shadow: -0.25em -0.25em 0 ${dark ? '#c97b4b' : '#a85c28'} inset,
                  0.25em 0.25em 0 ${dark ? '#f5c4a0' : '#e8a080'} inset;
      top: -0.25em; right: -0.25em; width: 0.75em; height: 0.75em; transform-origin: 50% 30%;
    }
    .hamster__eye {
      animation: hamsterEye var(--dur) ease-in-out infinite;
      background-color: ${dark ? '#1a1a2e' : '#111'};
      border-radius: 50%; top: 0.375em; left: 1.25em; width: 0.5em; height: 0.5em;
    }
    .hamster__nose {
      background: ${dark ? '#e8747c' : '#d46060'};
      border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
      top: 0.75em; left: 0; width: 0.2em; height: 0.25em;
    }
    .hamster__body {
      animation: hamsterBody var(--dur) ease-in-out infinite;
      background: ${dark ? '#e8a87c' : '#d4834a'};
      border-radius: 50% 30% 50% 30% / 20% 60% 35% 75%;
      box-shadow: 0.1em -0.75em 0 ${dark ? '#d4935c' : '#c07840'} inset,
                  0.15em -0.5em 0 ${dark ? '#f5c4a0' : '#e8a080'} inset;
      top: 0.25em; left: 2em; width: 4.5em; height: 3em; transform-origin: 17% 60%;
    }
    .hamster__limb--fr,
    .hamster__limb--fl {
      clip-path: polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%);
      top: 2em; left: 0.5em; width: 1em; height: 1.5em; transform-origin: 50% 0;
    }
    .hamster__limb--fr {
      animation: hamsterFRLimb var(--dur) ease-in-out infinite;
      background: linear-gradient(${dark ? '#d4935c' : '#c07840'} 80%, ${dark ? '#e8a87c' : '#d4834a'} 80%);
      z-index: 1;
    }
    .hamster__limb--fl {
      animation: hamsterFLLimb var(--dur) ease-in-out infinite;
      background: linear-gradient(${dark ? '#e8a87c' : '#d4834a'} 80%, ${dark ? '#f5c4a0' : '#e8a080'} 80%);
      z-index: 4;
    }
    .hamster__limb--br,
    .hamster__limb--bl {
      border-radius: 0.75em 0.75em 0 0;
      clip-path: polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%);
      top: 1em; left: 2.8em; width: 1.5em; height: 2.5em; transform-origin: 50% 30%;
    }
    .hamster__limb--br {
      animation: hamsterBRLimb var(--dur) ease-in-out infinite;
      background: linear-gradient(${dark ? '#d4935c' : '#c07840'} 80%, ${dark ? '#e8a87c' : '#d4834a'} 80%);
      z-index: 1;
    }
    .hamster__limb--bl {
      animation: hamsterBLLimb var(--dur) ease-in-out infinite;
      background: linear-gradient(${dark ? '#e8a87c' : '#d4834a'} 80%, ${dark ? '#f5c4a0' : '#e8a080'} 80%);
      z-index: 4;
    }
    .hamster__tail {
      animation: hamsterTail var(--dur) linear infinite;
      background: ${dark ? '#d4935c' : '#c07840'};
      border-radius: 0.25em 50% 50% 0.25em;
      box-shadow: 0 -0.2em 0 0.1em ${dark ? '#c07840' : '#a85c28'} inset;
      top: 1.5em; right: -0.5em; width: 1em; height: 0.5em; transform-origin: 0.25em 0.25em;
    }
    .spoke {
      animation: spoke var(--dur) linear infinite;
      background: radial-gradient(100% 100% at center,
        ${dark ? 'hsl(220,15%,28%)' : 'hsl(220,15%,22%)'} 4.8%,
        hsla(0,0%,60%,0) 5%,
        hsla(0,0%,60%,0) 71.8%,
        ${dark ? 'hsl(220,15%,28%)' : 'hsl(220,15%,22%)'} 72%,
        hsla(0,0%,60%,0) 100%
      ),
      repeating-conic-gradient(
        ${dark ? 'hsl(220,15%,35%)' : 'hsl(220,15%,22%)'} 0deg 3deg,
        transparent 3deg 45deg
      );
      z-index: 1;
    }

    @keyframes hamster {
      from, to { transform: rotate(4deg) translate(-0.8em,1.85em); }
      50% { transform: rotate(0) translate(-0.8em,1.85em); }
    }
    @keyframes hamsterHead {
      from, 25%, 50%, 75%, to { transform: rotate(0); }
      12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(8deg); }
    }
    @keyframes hamsterEye {
      from, 90%, to { transform: scaleY(1); }
      95% { transform: scaleY(0); }
    }
    @keyframes hamsterEar {
      from, 25%, 50%, 75%, to { transform: rotate(0); }
      12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(12deg); }
    }
    @keyframes hamsterBody {
      from, 25%, 50%, 75%, to { transform: rotate(0); }
      12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(-2deg); }
    }
    @keyframes hamsterFRLimb {
      from, to { transform: rotate(70deg) translateZ(-1px); }
      25%      { transform: rotate(-50deg) translateZ(-1px); }
      50%      { transform: rotate(70deg) translateZ(-1px); }
      75%      { transform: rotate(-50deg) translateZ(-1px); }
    }
    @keyframes hamsterFLLimb {
      from, to { transform: rotate(-50deg); }
      25%      { transform: rotate(70deg); }
      50%      { transform: rotate(-50deg); }
      75%      { transform: rotate(70deg); }
    }
    @keyframes hamsterBRLimb {
      from, to { transform: rotate(-80deg) translateZ(-1px); }
      25%      { transform: rotate(30deg) translateZ(-1px); }
      50%      { transform: rotate(-80deg) translateZ(-1px); }
      75%      { transform: rotate(30deg) translateZ(-1px); }
    }
    @keyframes hamsterBLLimb {
      from, to { transform: rotate(30deg); }
      25%      { transform: rotate(-80deg); }
      50%      { transform: rotate(30deg); }
      75%      { transform: rotate(-80deg); }
    }
    @keyframes hamsterTail {
      from, 25%, 50%, 75%, to { transform: rotate(30deg) translateZ(-1px); }
      12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(10deg) translateZ(-1px); }
    }
    @keyframes spoke {
      from { transform: rotate(0); }
      to { transform: rotate(-1turn); }
    }

    .customCheckBoxHolder {
      display: flex; flex-wrap: wrap; gap: 12px;
      justify-content: center; margin: 24px 0 40px;
    }
    .customCheckBoxInput { display: none; }
    .customCheckBoxWrapper { cursor: pointer; user-select: none; }
    .customCheckBox {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 10px 22px;
      background: ${dark ? 'rgba(255,255,255,0.05)' : 'var(--surface)'};
      border: 1.5px solid var(--border); border-radius: 99px;
      color: var(--ink-2); font-family: var(--font-body);
      font-size: 0.85rem; font-weight: 600; box-shadow: var(--shadow-sm);
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .customCheckBox:hover {
      background: ${dark ? 'rgba(255,255,255,0.08)' : '#eaeae6'};
      color: var(--ink); transform: translateY(-2px); box-shadow: var(--shadow-md);
    }
    .customCheckBoxInput:checked + .customCheckBoxWrapper .customCheckBox {
      background: var(--ink); border-color: var(--ink);
      color: ${dark ? '#111' : 'var(--surface)'}; box-shadow: var(--shadow-md); transform: scale(1.04);
    }
    .customCheckBoxInput:checked + .customCheckBoxWrapper .customCheckBox:hover {
      transform: translateY(-2px) scale(1.04);
    }
    .customCheckBox .inner { display: flex; align-items: center; gap: 6px; }

    .cart-btn-custom {
      height: 38px; padding: 0 18px; border: 2px solid #315cfd; border-radius: 99px;
      transition: all 0.3s; cursor: pointer; background: white; color: #0f0f0f;
      font-size: 0.9rem; font-weight: 600; display: flex; align-items: center;
      justify-content: center; gap: 6px;
    }
    .cart-btn-custom:hover { background: #315cfd; color: white; transform: scale(1.05); }

    .close-btn-custom {
      width: 36px; height: 36px; color: #fff; border-radius: 8px; padding: 0;
      font-weight: 700; background: linear-gradient(0deg, #004dff 0%, #004dff 100%);
      border: none; cursor: pointer; transition: all 0.3s ease;
      display: inline-flex; align-items: center; justify-content: center;
      box-shadow: inset 2px 2px 2px 0px rgba(255,255,255,.5),
       7px 7px 20px 0px rgba(0,0,0,.1), 4px 4px 5px 0px rgba(0,0,0,.1);
      outline: none; font-size: 1.1rem; flex-shrink: 0; text-decoration: none;
    }
    .close-btn-custom:hover {
      box-shadow: 4px 4px 6px 0 rgba(255,255,255,.5),
                  -4px -4px 6px 0 rgba(116, 125, 136, .5), 
                  inset -4px -4px 6px 0 rgba(255,255,255,.2),
                  inset 4px 4px 6px 0 rgba(0, 0, 0, .4);
    }

    .modal-sheet {
      top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 90%; max-width: 480px; max-height: 90vh; border-radius: 28px;
    }

    .nav-mobile-only { display: none; }
    .nav-desktop-only { display: inline-flex; }

    main { padding-bottom: 40px !important; }

    @media (min-width: 641px) {
      .panel-admin {
        max-width: 100% !important;
        width: 100% !important;
      }
    }

    @media (max-width: 640px) {
      .nav-desktop-only { display: none !important; }
      .nav-mobile-only  { display: flex !important; }

      .modal-sheet {
        top: auto !important; left: 0 !important; bottom: 0 !important;
        transform: none !important; width: 100% !important;
        max-width: 100% !important; max-height: 92vh !important;
        border-radius: 28px 28px 0 0 !important;
      }

      @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to   { transform: translateY(0);   opacity: 1; }
      }
      .modal-sheet { animation: slideUp 0.38s cubic-bezier(0.34,1.2,0.64,1) both !important; }

      .modal-sheet::before {
        content: ''; display: block; width: 40px; height: 4px;
        border-radius: 99px; background: var(--ink-3);
        margin: 10px auto 0; opacity: 0.4;
      }

      .panel { max-width: 100% !important; }

      .aquarium-hero { height: 360px !important; }
      .hero-text { left: 20px !important; bottom: 40px !important; }

      .products-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 12px !important;
      }

      .bottom-nav-wrap { padding: 8px 20px !important; gap: 20px !important; }
    }
  `}</style>
);