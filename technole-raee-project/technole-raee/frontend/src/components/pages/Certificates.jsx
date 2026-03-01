/**
 * components/pages/Certificates.jsx
 */
import { Icon, Card, Button, PageHeader, Th, Td, Empty } from "../ui/index.jsx";
import { openCertificatePrint } from "../../utils/certGenerator.js";

export function Certificates({ clients, collections, certs, generateCert }) {
  const pending = collections.filter(c => !c.certified && c.devices.length > 0);

  const handleGenerate = async (col) => {
    const cert   = await generateCert(col.id);
    const client = clients.find(c => c.id === col.clientId);
    openCertificatePrint(col, client, cert.id, cert.issued);
  };

  const handleDownload = (cert) => {
    const col    = collections.find(c => c.id === cert.collectionId);
    const client = clients.find(c => c.id === col?.clientId);
    if (col && client) openCertificatePrint(col, client, cert.id, cert.issued);
  };

  return (
    <div className="anim-fade-up">
      <PageHeader
        title="Certificados"
        sub={`${certs.length} certificado${certs.length !== 1 ? "s" : ""} emitido${certs.length !== 1 ? "s" : ""}`}
      />

      {/* Pendientes */}
      {pending.length > 0 && (
        <div style={{ background: "rgba(245,158,11,.05)", border: "1px solid rgba(245,158,11,.14)", borderRadius: "var(--r-lg)", padding: "16px 18px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 13 }}>
            <Icon name="alert" size={14} color="var(--amber)" />
            <span style={{ fontWeight: 600, fontSize: 13, color: "var(--amber)" }}>
              {pending.length} recogida{pending.length > 1 ? "s" : ""} pendiente{pending.length > 1 ? "s" : ""} de certificar
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {pending.map(col => {
              const cl = clients.find(c => c.id === col.clientId);
              return (
                <div key={col.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "11px 14px", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13.5 }}>{cl?.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>{col.date} · {col.devices.length} dispositivos</div>
                  </div>
                  <Button sm onClick={() => handleGenerate(col)}>
                    <Icon name="file" size={13} /> Generar certificado
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Histórico */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "15px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Histórico de certificados</div>
          <span className="badge badge-violet">{certs.length} emitidos</span>
        </div>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr><Th>N.º Certificado</Th><Th>Cliente</Th><Th>Fecha emisión</Th><Th>Dispositivos</Th><Th></Th></tr>
            </thead>
            <tbody>
              {[...certs].reverse().map(cert => {
                const col = collections.find(c => c.id === cert.collectionId);
                const cl  = clients.find(c => c.id === col?.clientId);
                return (
                  <tr key={cert.id} className="table-row" style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--accent)", fontWeight: 500 }}>{cert.id}</span>
                    </td>
                    <Td>{cl?.name || "—"}</Td>
                    <Td mono>{cert.issued}</Td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className="badge badge-blue">{col?.devices.length ?? 0} disp.</span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <Button variant="ghost" sm onClick={() => handleDownload(cert)}>
                        <Icon name="dl" size={12} /> Descargar PDF
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {certs.length === 0 && (
                <tr><td colSpan={5}><Empty icon="file" text="Sin certificados emitidos." /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
