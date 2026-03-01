/**
 * components/pages/Dashboard.jsx
 */
import { Icon, Card, PageHeader, Th, Td, Empty } from "../ui/index.jsx";

function StatCard({ label, value, sub, icon, color, delay }) {
  return (
    <div className="anim-fade-up" style={{ animationDelay: delay, background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14, position: "relative", overflow: "hidden", zIndex: 1 }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${color}14 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 34, height: 34, borderRadius: "var(--r-sm)", background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${color}1a` }}>
          <Icon name={icon} size={16} color={color} />
        </div>
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 26, fontWeight: 500, letterSpacing: "-1px" }}>{value}</span>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 1 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--text-3)" }}>{sub}</div>}
      </div>
    </div>
  );
}

export function Dashboard({ clients, collections, certs }) {
  const devices = collections.flatMap(c => c.devices).length;
  const pending = collections.filter(c => !c.certified).length;
  const recent  = [...collections].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="anim-fade-up">
      <PageHeader title="Panel principal" sub="Resumen del sistema de gestión RAEE" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 26 }}>
        <StatCard label="Clientes"     value={clients.length}     sub="Registrados"                              icon="users"  color="var(--accent)" delay=".05s" />
        <StatCard label="Recogidas"    value={collections.length} sub={`${pending} pendiente${pending !== 1 ? "s" : ""}`} icon="truck"  color="var(--blue)"   delay=".1s"  />
        <StatCard label="Dispositivos" value={devices}            sub="Gestionados"                              icon="chip"   color="var(--amber)"  delay=".15s" />
        <StatCard label="Certificados" value={certs.length}       sub="Emitidos"                                 icon="file"   color="var(--violet)" delay=".2s"  />
      </div>

      <Card>
        <div style={{ padding: "17px 20px 0", marginBottom: 2 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Actividad reciente</div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 1 }}>Últimas recogidas registradas</div>
        </div>
        {recent.length === 0 ? (
          <Empty icon="truck" text="Sin actividad registrada." />
        ) : (
          <div style={{ overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr><Th>Fecha</Th><Th>Cliente</Th><Th>Técnico</Th><Th>Disp.</Th><Th>Estado</Th></tr>
              </thead>
              <tbody>
                {recent.map(c => {
                  const cl = clients.find(x => x.id === c.clientId);
                  return (
                    <tr key={c.id} className="table-row" style={{ borderTop: "1px solid var(--border)" }}>
                      <Td mono>{c.date}</Td>
                      <td style={{ padding: "12px 16px", fontWeight: 500 }}>{cl?.name || "—"}</td>
                      <Td muted>{c.technician}</Td>
                      <td style={{ padding: "12px 16px", fontFamily: "JetBrains Mono", fontSize: 12 }}>{c.devices.length}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span className={`badge ${c.certified ? "badge-green" : "badge-amber"}`}>
                          {c.certified ? "Certificado" : "Pendiente"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
