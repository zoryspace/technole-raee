/**
 * components/layout/Sidebar.jsx
 */
import { Icon } from "../ui/index.jsx";

const navItems = [
  { id: "dashboard",    label: "Dashboard",    icon: "grid"  },
  { id: "clients",      label: "Clientes",     icon: "users" },
  { id: "collections",  label: "Recogidas",    icon: "truck" },
  { id: "certificates", label: "Certificados", icon: "file"  },
];

export function Sidebar({ active, setActive, user, onLogout, onClose }) {
  return (
    <aside style={{
      width: "var(--sidebar-w)", flexShrink: 0,
      background: "var(--surface)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0, overflowY: "auto", zIndex: 1,
    }}>
      {/* Brand */}
      <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 31, height: 31, borderRadius: 8, background: "linear-gradient(135deg,var(--accent),#00a06e)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px var(--accent-glow)", flexShrink: 0 }}>
              <Icon name="shield" size={14} color="#07080d" />
            </div>
            <div>
              <div style={{ fontFamily: "Fraunces", fontWeight: 400, fontSize: 14.5, letterSpacing: "-.3px", lineHeight: 1.2 }}>TECHNØLÉ</div>
              <div style={{ fontSize: 9.5, color: "var(--text-3)", letterSpacing: ".8px", textTransform: "uppercase" }}>RAEE MVP</div>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer" }}>
              <Icon name="x" size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 10px" }}>
        <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-3)", padding: "8px 8px 5px" }}>
          Navegación
        </div>
        {navItems.map(item => {
          const on = active === item.id;
          return (
            <button key={item.id}
              onClick={() => { setActive(item.id); onClose?.(); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 9,
                padding: "8px 10px", borderRadius: "var(--r-sm)", marginBottom: 1,
                background: on ? "rgba(0,200,150,.08)" : "transparent",
                border: on ? "1px solid rgba(0,200,150,.12)" : "1px solid transparent",
                color: on ? "var(--accent)" : "var(--text-2)",
                fontWeight: on ? 600 : 400, fontSize: 13.5, textAlign: "left", transition: "all .15s",
              }}
              onMouseEnter={e => { if (!on) { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.color = "var(--text-1)"; }}}
              onMouseLeave={e => { if (!on) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-2)"; }}}>
              <Icon name={item.icon} size={14} />
              {item.label}
              {on && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "var(--accent)" }} />}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,var(--accent),#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#07080d", flexShrink: 0 }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)" }}>Administrador</div>
          </div>
        </div>
        <button onClick={onLogout}
          style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: "var(--text-3)", fontSize: 12, padding: "4px 0", transition: "color .15s", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text-1)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}>
          <Icon name="logout" size={13} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
