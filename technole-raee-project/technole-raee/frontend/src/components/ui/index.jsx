/**
 * components/ui/index.jsx
 * ─────────────────────────────────────────────────────────
 * Librería de componentes UI primitivos reutilizables.
 * Ninguno tiene lógica de negocio — solo presentación.
 * ─────────────────────────────────────────────────────────
 */

// ── Icons ──────────────────────────────────────────────────
const iconPaths = {
  grid:   <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  users:  <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  truck:  <><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
  file:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="11" x2="15" y2="11"/></>,
  plus:   <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  edit:   <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  trash:  <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
  x:      <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  dl:     <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  chip:   <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></>,
  menu:   <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  alert:  <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
};

export const Icon = ({ name, size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {iconPaths[name]}
  </svg>
);

// ── Button ─────────────────────────────────────────────────
export const Button = ({ children, variant = "primary", sm, onClick, disabled, style: s = {} }) => {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 6, borderRadius: "var(--r-sm)", fontWeight: 500,
    fontSize: sm ? 12 : 13.5, whiteSpace: "nowrap",
    padding: sm ? "5px 10px" : "9px 16px",
    transition: "all .15s", outline: "none", border: "none",
  };
  const variants = {
    primary: { background: "var(--accent)", color: "#07080d", boxShadow: "0 0 16px -4px var(--accent-glow)" },
    ghost:   { background: "rgba(255,255,255,.04)", color: "var(--text-2)", border: "1px solid var(--border)" },
    danger:  { background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(244,63,94,.15)" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...base, ...variants[variant], opacity: disabled ? .4 : 1, cursor: disabled ? "not-allowed" : "pointer", ...s }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.opacity = ".8"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}>
      {children}
    </button>
  );
};

// ── Card ───────────────────────────────────────────────────
export const Card = ({ children, style: s }) => (
  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", position: "relative", zIndex: 1, ...s }}>
    {children}
  </div>
);

// ── Modal ──────────────────────────────────────────────────
export const Modal = ({ title, sub, onClose, children, width = 520 }) => (
  <div onClick={e => e.target === e.currentTarget && onClose()}
    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
    <div className="anim-scale-in" style={{ background: "var(--card)", border: "1px solid var(--border-md)", borderRadius: "var(--r-lg)", width: "100%", maxWidth: width, maxHeight: "88vh", overflow: "auto", boxShadow: "var(--shadow-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 24px 16px", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
          {sub && <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{sub}</div>}
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-3)", display: "flex", padding: 3 }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text-1)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}>
          <Icon name="x" size={17} />
        </button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

// ── Form helpers ───────────────────────────────────────────
export const Label = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", letterSpacing: ".6px", textTransform: "uppercase", marginBottom: 5 }}>
    {children}
  </div>
);

export const Field = ({ label, children, span2 }) => (
  <div style={{ gridColumn: span2 ? "span 2" : "span 1" }}>
    {label && <Label>{label}</Label>}
    {children}
  </div>
);

export const FormGrid = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "13px 14px" }}>{children}</div>
);

export const ModalActions = ({ onCancel, onSave, disabled, label = "Guardar" }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
    <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
    <Button onClick={onSave} disabled={disabled}>{label}</Button>
  </div>
);

// ── Table helpers ──────────────────────────────────────────
export const Th = ({ children }) => (
  <th style={{ textAlign: "left", padding: "9px 16px", fontWeight: 500, fontSize: 11, letterSpacing: ".5px", textTransform: "uppercase", color: "var(--text-3)", whiteSpace: "nowrap", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
    {children}
  </th>
);

export const Td = ({ children, mono, muted }) => (
  <td style={{ padding: "12px 16px", color: muted ? "var(--text-2)" : "var(--text-1)", fontFamily: mono ? "JetBrains Mono" : "inherit", fontSize: mono ? 12 : 13.5 }}>
    {children}
  </td>
);

// ── Page header ────────────────────────────────────────────
export const PageHeader = ({ title, sub, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26, flexWrap: "wrap", gap: 12 }}>
    <div>
      <h2 style={{ fontFamily: "Fraunces", fontWeight: 300, fontSize: 25, letterSpacing: "-.6px", lineHeight: 1.2 }}>{title}</h2>
      {sub && <p style={{ color: "var(--text-3)", fontSize: 12.5, marginTop: 2 }}>{sub}</p>}
    </div>
    {action}
  </div>
);

// ── Empty state ────────────────────────────────────────────
export const Empty = ({ icon, text }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "52px 24px", color: "var(--text-3)", gap: 10 }}>
    <div style={{ opacity: .3 }}><Icon name={icon} size={28} /></div>
    <span style={{ fontSize: 13 }}>{text}</span>
  </div>
);

// ── Spinner ────────────────────────────────────────────────
export const Spinner = ({ size = 14, color = "#07080d" }) => (
  <span style={{ width: size, height: size, border: `2px solid ${color}`, borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />
);
