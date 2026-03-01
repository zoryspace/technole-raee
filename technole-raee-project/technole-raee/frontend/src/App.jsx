/**
 * App.jsx — Punto de entrada de la aplicación
 * ─────────────────────────────────────────────────────────
 * Responsabilidades:
 *   1. Gestionar el estado de autenticación
 *   2. Cargar los datos globales (useAppData)
 *   3. Orquestar el layout (Sidebar + Topbar + páginas)
 *
 * No contiene lógica de negocio ni llamadas directas a la API.
 * ─────────────────────────────────────────────────────────
 */

import { useState, useEffect } from "react";
import "./styles/globals.css";

import { authApi } from "./api/client.js";
import { useAppData } from "./hooks/useAppData.js";

import { Sidebar } from "./components/layout/Sidebar.jsx";
import { Topbar }  from "./components/layout/Topbar.jsx";
import { Button, Icon, Spinner } from "./components/ui/index.jsx";

import { Dashboard }    from "./components/pages/Dashboard.jsx";
import { Clients }      from "./components/pages/Clients.jsx";
import { Collections }  from "./components/pages/Collections.jsx";
import { Certificates } from "./components/pages/Certificates.jsx";

// ── Login page ─────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("admin@technole.es");
  const [pass,  setPass]  = useState("admin123");
  const [err,   setErr]   = useState("");
  const [busy,  setBusy]  = useState(false);

  const submit = async () => {
    setBusy(true);
    setErr("");
    try {
      const user = await authApi.login(email, pass);
      onLogin(user);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(0,200,150,.08) 0%, transparent 65%), var(--bg)", position: "relative", zIndex: 1 }}>
      <div className="anim-fade-up" style={{ width: "100%", maxWidth: 360 }}>
        <div style={{ textAlign: "center", marginBottom: 34 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: 13, background: "linear-gradient(135deg,var(--accent) 0%,#00a06e 100%)", marginBottom: 18, boxShadow: "0 8px 28px var(--accent-glow)" }}>
            <Icon name="shield" size={23} color="#07080d" />
          </div>
          <h1 style={{ fontFamily: "Fraunces", fontWeight: 300, fontSize: 30, letterSpacing: "-1px", marginBottom: 5 }}>TECHNØLÉ</h1>
          <p style={{ color: "var(--text-3)", fontSize: 12.5 }}>Gestión de Residuos Electrónicos · RAEE</p>
        </div>

        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 26, boxShadow: "var(--shadow-lg)" }}>
          <div style={{ marginBottom: 13 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", letterSpacing: ".6px", textTransform: "uppercase", marginBottom: 5 }}>Correo</div>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} autoFocus />
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", letterSpacing: ".6px", textTransform: "uppercase", marginBottom: 5 }}>Contraseña</div>
            <input type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          {err && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--red-dim)", border: "1px solid rgba(244,63,94,.15)", borderRadius: "var(--r-sm)", padding: "8px 12px", marginBottom: 14, color: "var(--red)", fontSize: 12.5 }}>
              <Icon name="alert" size={14} /> {err}
            </div>
          )}
          <Button onClick={submit} disabled={busy} style={{ width: "100%" }}>
            {busy ? <><Spinner /> Verificando…</> : "Acceder al panel"}
          </Button>
        </div>

        <p style={{ textAlign: "center", color: "var(--text-3)", fontSize: 11, marginTop: 14, letterSpacing: ".3px" }}>
          admin@technole.es · admin123
        </p>
      </div>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────
export default function App() {
  const [user,        setUser]        = useState(null);
  const [section,     setSection]     = useState("dashboard");
  const [mobileMenu,  setMobileMenu]  = useState(false);
  const [isMobile,    setIsMobile]    = useState(window.innerWidth < 768);

  const data = useAppData();

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // Pantalla de login
  if (!user) return <LoginPage onLogin={setUser} />;

  // Pantalla de carga
  if (data.loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)", gap: 12 }}>
      <Spinner size={18} color="var(--accent)" /> Cargando datos…
    </div>
  );

  // Error de carga
  if (data.error) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--red)", gap: 10 }}>
      <Icon name="alert" size={28} />
      <p>Error al cargar: {data.error}</p>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar desktop */}
      {!isMobile && (
        <Sidebar active={section} setActive={setSection} user={user} onLogout={() => { authApi.logout(); setUser(null); }} />
      )}

      {/* Sidebar mobile overlay */}
      {isMobile && mobileMenu && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)" }} onClick={() => setMobileMenu(false)} />
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: 230 }} className="anim-fade-up">
            <Sidebar active={section} setActive={s => { setSection(s); setMobileMenu(false); }} user={user} onLogout={() => { authApi.logout(); setUser(null); }} onClose={() => setMobileMenu(false)} />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar section={section} isMobile={isMobile} onMenuClick={() => setMobileMenu(true)} />

        <main style={{ flex: 1, padding: "26px 22px", maxWidth: 1080, width: "100%", position: "relative", zIndex: 1 }}>
          {section === "dashboard"    && <Dashboard    clients={data.clients} collections={data.collections} certs={data.certs} />}
          {section === "clients"      && <Clients      clients={data.clients} createClient={data.createClient} updateClient={data.updateClient} deleteClient={data.deleteClient} />}
          {section === "collections"  && <Collections  clients={data.clients} collections={data.collections} createCollection={data.createCollection} updateCollection={data.updateCollection} deleteCollection={data.deleteCollection} updateDevices={data.updateDevices} />}
          {section === "certificates" && <Certificates clients={data.clients} collections={data.collections} certs={data.certs} generateCert={data.generateCert} />}
        </main>
      </div>
    </div>
  );
}
