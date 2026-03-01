/**
 * components/layout/Topbar.jsx
 */
import { Icon } from "../ui/index.jsx";

const sectionLabels = {
  dashboard:    "Dashboard",
  clients:      "Clientes",
  collections:  "Recogidas",
  certificates: "Certificados",
};

export function Topbar({ section, onMenuClick, isMobile }) {
  return (
    <header style={{
      height: 50, display: "flex", alignItems: "center",
      padding: "0 22px", borderBottom: "1px solid var(--border)",
      background: "rgba(13,16,23,.85)", backdropFilter: "blur(14px)",
      position: "sticky", top: 0, zIndex: 50, gap: 10,
    }}>
      {isMobile && (
        <button onClick={onMenuClick}
          style={{ background: "none", border: "none", color: "var(--text-2)", display: "flex", cursor: "pointer" }}>
          <Icon name="menu" size={19} />
        </button>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-3)", fontSize: 13 }}>
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, opacity: .4 }}>~/</span>
        <span style={{ color: "var(--text-2)" }}>{sectionLabels[section]}</span>
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "var(--accent-dim)", border: "1px solid rgba(0,200,150,.1)", borderRadius: 99, padding: "3px 10px 3px 7px" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 6px var(--accent)", animation: "pulse 2.4s ease-in-out infinite" }} />
        <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 500 }}>Sistema activo</span>
      </div>
    </header>
  );
}
