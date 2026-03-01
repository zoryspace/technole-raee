/**
 * components/pages/Clients.jsx
 */
import { useState } from "react";
import { Button, Icon, Card, Modal, Field, FormGrid, ModalActions, PageHeader, Th, Td, Empty } from "../ui/index.jsx";

const emptyForm = { name: "", contact: "", email: "", phone: "", nif: "" };

export function Clients({ clients, createClient, updateClient, deleteClient }) {
  const [modal, setModal]   = useState(null); // null | "new" | clientObject
  const [form,  setForm]    = useState(emptyForm);
  const [query, setQuery]   = useState("");
  const [busy,  setBusy]    = useState(false);

  const F = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const open  = (client) => { setForm(client ? { ...client } : emptyForm); setModal(client ?? "new"); };
  const close = () => setModal(null);

  const save = async () => {
    if (!form.name) return;
    setBusy(true);
    try {
      if (modal === "new") await createClient(form);
      else                 await updateClient(form.id, form);
      close();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    await deleteClient(id);
  };

  const filtered = clients.filter(c =>
    [c.name, c.email, c.nif].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="anim-fade-up">
      <PageHeader
        title="Clientes"
        sub={`${clients.length} empresa${clients.length !== 1 ? "s" : ""} registrada${clients.length !== 1 ? "s" : ""}`}
        action={
          <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
            <input placeholder="Buscar…" value={query} onChange={e => setQuery(e.target.value)} style={{ width: 190, height: 34 }} />
            <Button onClick={() => open(null)}><Icon name="plus" size={14} /> Nuevo cliente</Button>
          </div>
        }
      />

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr><Th>Empresa</Th><Th>Contacto</Th><Th>Email</Th><Th>Teléfono</Th><Th>NIF</Th><Th></Th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="table-row" style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 500 }}>{c.name}</td>
                  <Td muted>{c.contact}</Td>
                  <Td>{c.email}</Td>
                  <Td mono>{c.phone}</Td>
                  <Td mono>{c.nif}</Td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
                      <Button variant="ghost" sm onClick={() => open(c)}><Icon name="edit" size={12} /></Button>
                      <Button variant="danger" sm onClick={() => remove(c.id)}><Icon name="trash" size={12} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6}><Empty icon="users" text="Sin resultados." /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <Modal title={modal === "new" ? "Nuevo cliente" : "Editar cliente"} sub="Datos de la empresa" onClose={close}>
          <FormGrid>
            <Field label="Nombre empresa" span2><input value={form.name} onChange={F("name")} placeholder="Empresa S.L." /></Field>
            <Field label="Persona de contacto"><input value={form.contact} onChange={F("contact")} placeholder="Nombre apellidos" /></Field>
            <Field label="NIF / CIF"><input value={form.nif} onChange={F("nif")} placeholder="B12345678" /></Field>
            <Field label="Email"><input value={form.email} onChange={F("email")} placeholder="email@empresa.com" /></Field>
            <Field label="Teléfono"><input value={form.phone} onChange={F("phone")} placeholder="+34 600 000 000" /></Field>
          </FormGrid>
          <ModalActions onCancel={close} onSave={save} disabled={!form.name || busy}
            label={modal === "new" ? "Crear cliente" : "Guardar cambios"} />
        </Modal>
      )}
    </div>
  );
}
