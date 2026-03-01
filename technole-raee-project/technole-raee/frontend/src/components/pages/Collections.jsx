/**
 * components/pages/Collections.jsx
 */
import { useState } from "react";
import { Button, Icon, Card, Modal, Field, FormGrid, ModalActions, PageHeader, Empty } from "../ui/index.jsx";

const emptyForm = { clientId: "", date: "", address: "", technician: "", serviceType: "Recogida + Destrucción" };
const METHOD_LABELS = { borrado_logico: "Borrado lógico", trituracion: "Trituración física", otros: "Otros" };

let _devId = 20;
const nextDevId = () => ++_devId;

// ── Subcomponente: gestión de dispositivos ─────────────────
function DevicesModal({ collection, clients, onClose, onSave }) {
  const [devices, setDevices] = useState(collection.devices.map(d => ({ ...d })));
  const [form, setForm]       = useState({ brand: "", model: "", serial: "", method: "borrado_logico" });
  const F = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const client = clients.find(c => c.id === collection.clientId);

  const addDevice = () => {
    if (!form.brand || !form.model) return;
    setDevices(prev => [...prev, { ...form, id: nextDevId() }]);
    setForm({ brand: "", model: "", serial: "", method: "borrado_logico" });
  };

  return (
    <Modal title="Gestión de dispositivos" sub={`${client?.name} · ${collection.date}`} onClose={onClose} width={580}>
      {/* Add row */}
      <div style={{ background: "var(--raised)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 15, marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 10 }}>
          Añadir dispositivo
        </div>
        <FormGrid>
          <Field label="Marca"><input value={form.brand} onChange={F("brand")} placeholder="Dell, HP…" /></Field>
          <Field label="Modelo"><input value={form.model} onChange={F("model")} placeholder="Latitude 5520" /></Field>
          <Field label="N.º serie"><input value={form.serial} onChange={F("serial")} placeholder="SN-XXXX" /></Field>
          <Field label="Método">
            <select value={form.method} onChange={F("method")}>
              <option value="borrado_logico">Borrado lógico</option>
              <option value="trituracion">Trituración física</option>
              <option value="otros">Otros</option>
            </select>
          </Field>
        </FormGrid>
        <Button sm onClick={addDevice} disabled={!form.brand || !form.model} style={{ marginTop: 10 }}>
          <Icon name="plus" size={13} /> Añadir
        </Button>
      </div>

      {/* Device list */}
      {devices.length > 0 ? (
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r)", overflow: "hidden", maxHeight: 230, overflowY: "auto" }}>
          {devices.map((d, i) => (
            <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", borderBottom: i < devices.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{d.brand} {d.model}</span>
                {d.serial && <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--text-3)", marginLeft: 8 }}>{d.serial}</span>}
              </div>
              <span className="badge badge-blue" style={{ flexShrink: 0 }}>{METHOD_LABELS[d.method]}</span>
              <button onClick={() => setDevices(p => p.filter(x => x.id !== d.id))}
                style={{ background: "none", border: "none", color: "var(--text-3)", display: "flex", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}>
                <Icon name="trash" size={13} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ border: "1px dashed var(--border-md)", borderRadius: "var(--r)", padding: 22, textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>
          Sin dispositivos añadidos.
        </div>
      )}

      <ModalActions onCancel={onClose} onSave={() => { onSave(devices); onClose(); }}
        label={`Guardar (${devices.length} dispositivo${devices.length !== 1 ? "s" : ""})`} />
    </Modal>
  );
}

// ── Página principal ────────────────────────────────────────
export function Collections({ clients, collections, createCollection, updateCollection, deleteCollection, updateDevices }) {
  const [modal,    setModal]    = useState(null);
  const [devModal, setDevModal] = useState(null);
  const [form,     setForm]     = useState(emptyForm);
  const [busy,     setBusy]     = useState(false);
  const F = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const open  = col => { setForm(col ? { ...col } : emptyForm); setModal(col ?? "new"); };
  const close = () => setModal(null);

  const save = async () => {
    if (!form.clientId || !form.date) return;
    setBusy(true);
    try {
      const data = { ...form, clientId: Number(form.clientId) };
      if (modal === "new") await createCollection(data);
      else                 await updateCollection(form.id, data);
      close();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar esta recogida?")) return;
    await deleteCollection(id);
  };

  const saveDevices = async (collectionId, devices) => {
    await updateDevices(collectionId, devices);
    setDevModal(null);
  };

  const sorted = [...collections].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="anim-fade-up">
      <PageHeader
        title="Recogidas"
        sub={`${collections.length} recogida${collections.length !== 1 ? "s" : ""} registrada${collections.length !== 1 ? "s" : ""}`}
        action={<Button onClick={() => open(null)}><Icon name="plus" size={14} /> Nueva recogida</Button>}
      />

      {sorted.length === 0 ? (
        <Card><Empty icon="truck" text="Sin recogidas registradas." /></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {sorted.map(col => {
            const cl = clients.find(c => c.id === col.clientId);
            return (
              <div key={col.id}
                style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap", transition: "border-color .15s", position: "relative", zIndex: 1 }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-md)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "var(--text-3)" }}>#{String(col.id).padStart(3, "0")}</span>
                    <span className={`badge ${col.certified ? "badge-green" : "badge-amber"}`}>
                      {col.certified ? "Certificado" : "Pendiente"}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: "auto" }}>{col.serviceType}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{cl?.name || "Cliente desconocido"}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-2)", display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span>{col.address}</span>
                    <span style={{ color: "var(--text-3)" }}>·</span>
                    <span style={{ color: "var(--text-3)" }}>Téc. {col.technician}</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 9, flexShrink: 0 }}>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--text-3)" }}>{col.date}</span>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    <Button variant="ghost" sm onClick={() => setDevModal(col)}><Icon name="chip" size={12} /> {col.devices.length} disp.</Button>
                    <Button variant="ghost" sm onClick={() => open(col)}><Icon name="edit" size={12} /></Button>
                    <Button variant="danger" sm onClick={() => remove(col.id)}><Icon name="trash" size={12} /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Formulario recogida */}
      {modal && (
        <Modal title={modal === "new" ? "Nueva recogida" : "Editar recogida"} onClose={close}>
          <FormGrid>
            <Field label="Cliente" span2>
              <select value={form.clientId} onChange={F("clientId")}>
                <option value="">— Selecciona un cliente —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Tipo de servicio" span2>
              <select value={form.serviceType} onChange={F("serviceType")}>
                <option>Recogida + Destrucción</option>
                <option>Solo Recogida</option>
                <option>Destrucción en cliente</option>
                <option>Auditoría RAEE</option>
              </select>
            </Field>
            <Field label="Fecha"><input type="date" value={form.date} onChange={F("date")} /></Field>
            <Field label="Técnico responsable"><input value={form.technician} onChange={F("technician")} placeholder="Nombre técnico" /></Field>
            <Field label="Dirección" span2><input value={form.address} onChange={F("address")} placeholder="Calle, número, ciudad…" /></Field>
          </FormGrid>
          <ModalActions onCancel={close} onSave={save} disabled={!form.clientId || !form.date || busy}
            label={modal === "new" ? "Crear recogida" : "Guardar cambios"} />
        </Modal>
      )}

      {/* Modal dispositivos */}
      {devModal && (
        <DevicesModal
          collection={devModal}
          clients={clients}
          onClose={() => setDevModal(null)}
          onSave={(devices) => saveDevices(devModal.id, devices)}
        />
      )}
    </div>
  );
}
