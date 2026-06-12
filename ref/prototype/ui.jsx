/* ─────────────────────────────────────────────────────────────
   고치다 — UI atoms (Premium Clean · Brand Blue · Pretendard)
   ───────────────────────────────────────────────────────────── */
const { useState } = React;

function Icon({ name, size = 22, color = 'currentColor', strokeWidth = 1.9, style = {} }) {
  const p = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    camera: <><path {...p} d="M3 8.5A2 2 0 0 1 5 6.5h2l1.2-1.8A1 1 0 0 1 9 4.2h6a1 1 0 0 1 .8.5L17 6.5h2a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle {...p} cx="12" cy="13" r="3.4"/></>,
    sparkle: <><path {...p} d="M12 3.5l1.8 4.7L18.5 10l-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.8z"/><path {...p} d="M18.5 3.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/></>,
    bolt: <path d="M12 2.5L5 13.2h5.2L9 21.5l8-11.2h-5.4z" fill={color} stroke="none"/>,
    shield: <><path {...p} d="M12 3l7 2.5v5.2c0 4.6-3 8-7 9.8-4-1.8-7-5.2-7-9.8V5.5z"/><path {...p} d="M9 12l2 2 4-4.2"/></>,
    check: <path {...p} d="M5 12.5l4.2 4.2L19 7"/>,
    checkCircle: <><circle {...p} cx="12" cy="12" r="9"/><path {...p} d="M8 12.2l2.6 2.6L16 9.2"/></>,
    chevronR: <path {...p} d="M9 5l7 7-7 7"/>,
    chevronL: <path {...p} d="M15 5l-7 7 7 7"/>,
    close: <path {...p} d="M6 6l12 12M18 6L6 18"/>,
    warning: <><path {...p} d="M12 4.5l8.5 14.7H3.5z"/><path {...p} d="M12 10v4"/><circle cx="12" cy="16.6" r="1.1" fill={color} stroke="none"/></>,
    pin: <><path {...p} d="M12 21c4-4 6.5-7 6.5-10.3A6.5 6.5 0 0 0 5.5 10.7C5.5 14 8 17 12 21z"/><circle {...p} cx="12" cy="10.5" r="2.4"/></>,
    user: <><circle {...p} cx="12" cy="8.5" r="3.6"/><path {...p} d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/></>,
    plus: <path {...p} d="M12 5.5v13M5.5 12h13"/>,
    star: <path d="M12 3.5l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.5 6.9 19.2l1-5.7-4.1-4 5.7-.8z" fill={color} stroke="none"/>,
    arrowR: <path {...p} d="M5 12h14M13 6l6 6-6 6"/>,
    arrowUpR: <path {...p} d="M7 17L17 7M8 7h9v9"/>,
    info: <><circle {...p} cx="12" cy="12" r="9"/><path {...p} d="M12 11v5"/><circle cx="12" cy="7.8" r="1" fill={color} stroke="none"/></>,
    image: <><rect {...p} x="3.5" y="4.5" width="17" height="15" rx="3"/><circle {...p} cx="8.5" cy="9.5" r="1.6"/><path {...p} d="M4 17l4.5-4 3 2.6L15 11l5 5"/></>,
    clock: <><circle {...p} cx="12" cy="12" r="8.5"/><path {...p} d="M12 7.5V12l3 1.8"/></>,
    chat: <path {...p} d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5z"/>,
    wrench: <path {...p} d="M15.5 7a3.5 3.5 0 0 1-4.6 4.3L5.5 16.7a1.8 1.8 0 0 0 2.5 2.5l5.4-5.4A3.5 3.5 0 0 0 18 9.2l-2.2 2.2-2-2L16 7.2A3.5 3.5 0 0 0 15.5 7z"/>,
    home: <path {...p} d="M4 11.2L12 4.5l8 6.7M6 9.6V19h4.2v-5.2h3.6V19H18V9.6"/>,
    homeFill: <path d="M12 3.6L3.4 10.9c-.3.3-.1.8.3.8H6V19a1 1 0 0 0 1 1h3v-5.4h4V20h3a1 1 0 0 0 1-1v-7.3h2.3c.4 0 .6-.5.3-.8z" fill={color} stroke="none"/>,
    doc: <><path {...p} d="M7 3.5h6.5L18 8v12.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path {...p} d="M13 3.5V8h4M9 12.5h6M9 16h4"/></>,
    docFill: <><path d="M7 2.8h6.2L18.2 8v12.2a1.6 1.6 0 0 1-1.6 1.6H7a1.6 1.6 0 0 1-1.6-1.6V4.4A1.6 1.6 0 0 1 7 2.8z" fill={color} stroke="none"/><path d="M13 2.8V8h4.8M9.2 12.4h5.6M9.2 16h3.6" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></>,
    chatFill: <path d="M5 4.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4.2 3.1A.6.6 0 0 1 5 19.1V16.5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" fill={color} stroke="none"/>,
    person: <><circle {...p} cx="12" cy="8" r="3.8"/><path {...p} d="M5 20c0-3.7 3-6.2 7-6.2s7 2.5 7 6.2"/></>,
    personFill: <><circle cx="12" cy="8" r="4" fill={color} stroke="none"/><path d="M4.5 20.5c0-4 3.4-6.6 7.5-6.6s7.5 2.6 7.5 6.6z" fill={color} stroke="none"/></>,
    bell: <><path {...p} d="M6 9a6 6 0 0 1 12 0c0 5 1.6 6.5 1.6 6.5H4.4S6 14 6 9z"/><path {...p} d="M10 19a2 2 0 0 0 4 0"/></>,
    receipt: <><path {...p} d="M6 3.5h12v17l-2.2-1.4-2 1.4-1.8-1.4-1.8 1.4-2-1.4L6 20.5z"/><path {...p} d="M9 8h6M9 11.5h6M9 15h4"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">{paths[name] || null}</svg>;
}

/* Eyebrow — simple brand-color label */
function Eyebrow({ children, color = 'var(--primary)' }) {
  return <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 0.2, color }}>{children}</div>;
}

/* Button */
function Button({ title, variant = 'primary', size = 'md', onPress, disabled, isLoading, leftIcon, rightIcon, full = true, style = {} }) {
  const variants = {
    primary:   { background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-primary)' },
    secondary: { background: 'var(--surface-soft)', color: 'var(--text-primary)' },
    outline:   { background: 'var(--surface)', color: 'var(--text-primary)', border: '1.5px solid var(--border-strong)' },
    ghost:     { background: 'transparent', color: 'var(--text-primary)' },
    dark:      { background: 'var(--black)', color: '#fff', boxShadow: 'var(--shadow-medium)' },
  };
  const sizes = { md: { height: 56, padding: '0 24px', fontSize: 16 }, sm: { height: 44, padding: '0 18px', fontSize: 14 } };
  const off = disabled || isLoading;
  const v = variants[variant];
  return (
    <button className="pressable" disabled={off} onClick={off ? undefined : onPress}
      style={{ ...v, ...sizes[size], width: full ? '100%' : 'auto', borderRadius: 'var(--r-pill)', border: v.border || 'none',
        fontWeight: 700, fontFamily: 'inherit', letterSpacing: -0.2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
        opacity: off ? 0.42 : 1, cursor: off ? 'default' : 'pointer', ...style }}>
      {isLoading
        ? <span style={{ width: 20, height: 20, border: `2.5px solid ${variant === 'primary' || variant === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.18)'}`, borderTopColor: variant === 'primary' || variant === 'dark' ? '#fff' : 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        : <>{leftIcon}{title}{rightIcon}</>}
    </button>
  );
}

/* Card — white, soft floating shadow */
function Card({ children, onPress, radius = 'var(--r-xxl)', pad = 'var(--xl)', border = false, style = {} }) {
  const base = {
    background: 'var(--surface)', borderRadius: radius, padding: pad,
    border: border ? '1px solid var(--border)' : 'none', boxShadow: 'var(--shadow-soft)', ...style,
  };
  if (onPress) return <div className="pressable" onClick={onPress} style={base}>{children}</div>;
  return <div style={base}>{children}</div>;
}

/* Chip — soft idle → blue fill selected (no color transition; throttle-safe) */
function Chip({ label, selected, onPress }) {
  return (
    <button className="pressable" onClick={onPress}
      style={{ height: 42, padding: '0 18px', borderRadius: 'var(--r-pill)', border: 'none',
        fontFamily: 'inherit', fontSize: 14, fontWeight: 600, letterSpacing: -0.1,
        background: selected ? 'var(--primary)' : 'var(--surface-soft)',
        color: selected ? '#fff' : 'var(--text-secondary)',
        boxShadow: selected ? 'var(--shadow-primary)' : 'none', transition: 'transform 0.12s ease' }}>{label}</button>
  );
}

/* Badge — light tint + color text */
function Badge({ label, variant = 'neutral', icon, dot }) {
  const map = {
    primary: ['var(--primary-light)', 'var(--primary)'],
    success: ['var(--success-light)', 'var(--success)'],
    warning: ['var(--warning-light)', '#C77F12'],
    danger:  ['var(--danger-light)', 'var(--danger)'],
    neutral: ['var(--surface-soft)', 'var(--text-secondary)'],
  };
  const [bg, fg] = map[variant];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: bg, color: fg,
      borderRadius: 'var(--r-pill)', padding: '5px 11px', fontSize: 12, fontWeight: 700, letterSpacing: -0.1, whiteSpace: 'nowrap' }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: fg }} />}
      {icon && <Icon name={icon} size={13} color={fg} strokeWidth={2.2} />}
      {label}
    </span>
  );
}

/* StepIndicator */
function StepIndicator({ current, total, label }) {
  const pct = Math.max(0, Math.min(1, current / total)) * 100;
  return (
    <div>
      <div style={{ height: 4, borderRadius: 'var(--r-pill)', background: 'var(--divider)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--primary)', borderRadius: 'var(--r-pill)', transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        <span className="t-small text-primary" style={{ fontWeight: 700 }}>{label || `단계 ${current}`}</span>
        <span className="t-small text-tertiary" style={{ whiteSpace: 'nowrap' }}>{current} / {total}</span>
      </div>
    </div>
  );
}

function Skeleton({ width = '100%', height = 14, radius = 8, style = {} }) {
  return <div className="skel" style={{ width, height, borderRadius: radius, ...style }} />;
}

function SectionHeader({ title, subtitle, size = 'md' }) {
  return (
    <div style={{ marginBottom: 'var(--m)' }}>
      <div className={size === 'md' ? 't-h2 text-primary' : 't-h3 text-primary'}>{title}</div>
      {subtitle && <div className="t-caption text-secondary" style={{ marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

/* AppHeader */
function AppHeader({ title, onBack, showBack = true, right }) {
  return (
    <div style={{ paddingTop: 54, paddingBottom: 12, paddingLeft: 12, paddingRight: 12, display: 'flex', alignItems: 'center', gap: 4,
      background: 'var(--background)', position: 'relative', zIndex: 5, minHeight: 96 }}>
      {showBack ? (
        <button className="pressable" onClick={onBack} aria-label="back" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="chevronL" size={24} color="var(--text-primary)" strokeWidth={2.2} />
        </button>
      ) : <div style={{ width: 40, flexShrink: 0 }} />}
      <div className="t-h3 text-primary" style={{ flex: 1, textAlign: 'center' }}>{title}</div>
      <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

function FloatingFooter({ children }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '16px 24px 30px',
      background: 'linear-gradient(to top, var(--background) 66%, rgba(245,245,247,0))', zIndex: 20 }}>{children}</div>
  );
}

/* TabBar — iOS bottom navigation (4 tabs) */
const TAB_DEFS = [
  { id: 'home', label: '홈', icon: 'home', iconFill: 'homeFill' },
  { id: 'requests', label: '요청', icon: 'doc', iconFill: 'docFill' },
  { id: 'chats', label: '채팅', icon: 'chat', iconFill: 'chatFill' },
  { id: 'profile', label: '내 정보', icon: 'person', iconFill: 'personFill' },
];

function TabBar({ active, onSelect, onCamera, badges = {} }) {
  const renderTab = (tab) => {
    const on = active === tab.id;
    const color = on ? 'var(--primary)' : '#8A8A8F';
    return (
      <button key={tab.id} className="pressable" onClick={() => onSelect(tab.id)}
        style={{ flex: 1, background: 'transparent', border: 'none', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 4, cursor: 'pointer', padding: '4px 0', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <Icon name={on ? tab.iconFill : tab.icon} size={25} color={color} strokeWidth={1.9} />
          {badges[tab.id] > 0 && (
            <span style={{ position: 'absolute', top: -3, right: -6, minWidth: 16, height: 16, padding: '0 4px',
              borderRadius: 8, background: 'var(--danger)', color: '#fff', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #fff' }}>{badges[tab.id]}</span>
          )}
        </div>
        <span style={{ fontSize: 11, fontWeight: on ? 700 : 500, color, letterSpacing: -0.2 }}>{tab.label}</span>
      </button>
    );
  };
  const left = TAB_DEFS.slice(0, 2);
  const right = TAB_DEFS.slice(2);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40,
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(18px) saturate(180%)', WebkitBackdropFilter: 'blur(18px) saturate(180%)',
      borderTop: '1px solid var(--border)', paddingTop: 8, paddingBottom: 26,
      display: 'flex', alignItems: 'flex-end' }}>
      {left.map(renderTab)}
      {/* center camera FAB — core service: start by photo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button className="pressable" onClick={onCamera} aria-label="사진으로 바로 시작"
          style={{ position: 'relative', top: -20, width: 60, height: 60, borderRadius: '50%',
            border: '4px solid var(--surface)', background: 'linear-gradient(145deg, #6E7BFF 0%, var(--primary) 60%, #4654D9 100%)',
            boxShadow: '0 8px 18px rgba(91,108,255,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="camera" size={27} color="#fff" />
        </button>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', letterSpacing: -0.2, marginTop: -10 }}>촬영</span>
      </div>
      {right.map(renderTab)}
    </div>
  );
}

Object.assign(window, { Icon, Eyebrow, Button, Card, Chip, Badge, StepIndicator, Skeleton, SectionHeader, AppHeader, FloatingFooter, TabBar, TAB_DEFS });
