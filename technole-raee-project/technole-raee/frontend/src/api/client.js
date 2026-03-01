/**
 * api/client.js
 * ─────────────────────────────────────────────────────────
 * Capa de acceso a datos. Hoy usa una "base de datos" en memoria.
 * Para conectar un backend real, solo hay que cambiar cada función
 * para que llame a fetch('/api/...') en lugar de operar sobre mockDb.
 *
 * Todos los métodos son async para que el intercambio sea transparente:
 * los componentes no saben si los datos vienen de memoria o de una API.
 * ─────────────────────────────────────────────────────────
 */

// ── URL base del backend real (cuando exista) ──────────────
const API_URL = import.meta.env.VITE_API_URL || null;

// ── Base de datos en memoria ────────────────────────────────
let _idCounters = { client: 4, collection: 4, device: 10, cert: 2 };
const nextId = (k) => ++_idCounters[k];

const mockDb = {
  clients: [
    { id: 1, name: "TechCorp S.L.",       contact: "Ana García",  email: "ana@techcorp.es",    phone: "+34 612 345 678", nif: "B12345678" },
    { id: 2, name: "Oficinas Meridian",    contact: "Carlos Ruiz", email: "cruiz@meridian.com", phone: "+34 699 876 543", nif: "B87654321" },
    { id: 3, name: "Clínica Salud Total",  contact: "Dr. Martínez",email: "admin@saludtotal.es",phone: "+34 955 123 456", nif: "B11223344" },
  ],
  collections: [
    {
      id: 1, clientId: 1, date: "2025-01-15",
      address: "Calle Mayor 10, Madrid",
      technician: "Pedro Alonso", serviceType: "Recogida + Destrucción",
      devices: [
        { id: 1, brand: "Dell",   model: "Latitude 5520", serial: "SN-001-ABC", method: "borrado_logico" },
        { id: 2, brand: "HP",     model: "EliteBook 840", serial: "SN-002-XYZ", method: "trituracion"    },
      ],
      certified: true, certId: "RAEE-2025-001",
    },
    {
      id: 2, clientId: 2, date: "2025-02-03",
      address: "Avda. Libertad 55, Sevilla",
      technician: "Laura Vega", serviceType: "Solo Recogida",
      devices: [
        { id: 3, brand: "Lenovo", model: "ThinkPad X1", serial: "SN-003-DEF", method: "borrado_logico" },
      ],
      certified: false, certId: null,
    },
    {
      id: 3, clientId: 3, date: "2025-03-10",
      address: "Paseo de Gracia 22, Barcelona",
      technician: "Marta Soler", serviceType: "Destrucción en cliente",
      devices: [], certified: false, certId: null,
    },
  ],
  certificates: [
    { id: "RAEE-2025-001", collectionId: 1, issued: "2025-01-15" },
  ],
};

// ── Helpers ─────────────────────────────────────────────────
const delay = (ms = 120) => new Promise(r => setTimeout(r, ms));

const newCertId = () => {
  const year = new Date().getFullYear();
  const n    = mockDb.certificates.length + 1;
  return `RAEE-${year}-${String(n).padStart(3, "0")}`;
};

// ─────────────────────────────────────────────────────────────
// CLIENTS
// ─────────────────────────────────────────────────────────────
export const clientsApi = {
  /** GET /api/clients */
  getAll: async () => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/clients`, { headers: authHeaders() });
      return res.json();
    }
    await delay();
    return [...mockDb.clients];
  },

  /** POST /api/clients */
  create: async (data) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/clients`, {
        method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    }
    await delay();
    const record = { ...data, id: nextId("client") };
    mockDb.clients.push(record);
    return record;
  },

  /** PUT /api/clients/:id */
  update: async (id, data) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/clients/${id}`, {
        method: "PUT", headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    }
    await delay();
    const i = mockDb.clients.findIndex(c => c.id === id);
    if (i === -1) throw new Error("Client not found");
    mockDb.clients[i] = { ...data, id };
    return mockDb.clients[i];
  },

  /** DELETE /api/clients/:id */
  delete: async (id) => {
    if (API_URL) {
      await fetch(`${API_URL}/clients/${id}`, { method: "DELETE", headers: authHeaders() });
      return;
    }
    await delay();
    mockDb.clients = mockDb.clients.filter(c => c.id !== id);
  },
};

// ─────────────────────────────────────────────────────────────
// COLLECTIONS
// ─────────────────────────────────────────────────────────────
export const collectionsApi = {
  getAll: async () => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/collections`, { headers: authHeaders() });
      return res.json();
    }
    await delay();
    return mockDb.collections.map(c => ({ ...c, devices: [...c.devices] }));
  },

  create: async (data) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/collections`, {
        method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    }
    await delay();
    const record = { ...data, id: nextId("collection"), devices: [], certified: false, certId: null };
    mockDb.collections.push(record);
    return record;
  },

  update: async (id, data) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/collections/${id}`, {
        method: "PUT", headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    }
    await delay();
    const i = mockDb.collections.findIndex(c => c.id === id);
    if (i === -1) throw new Error("Collection not found");
    mockDb.collections[i] = { ...mockDb.collections[i], ...data, id };
    return mockDb.collections[i];
  },

  delete: async (id) => {
    if (API_URL) {
      await fetch(`${API_URL}/collections/${id}`, { method: "DELETE", headers: authHeaders() });
      return;
    }
    await delay();
    mockDb.collections = mockDb.collections.filter(c => c.id !== id);
  },

  /** PUT /api/collections/:id/devices */
  updateDevices: async (collectionId, devices) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/collections/${collectionId}/devices`, {
        method: "PUT", headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ devices }),
      });
      return res.json();
    }
    await delay();
    const col = mockDb.collections.find(c => c.id === collectionId);
    if (!col) throw new Error("Collection not found");
    col.devices = devices;
    return col;
  },
};

// ─────────────────────────────────────────────────────────────
// CERTIFICATES
// ─────────────────────────────────────────────────────────────
export const certificatesApi = {
  getAll: async () => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/certificates`, { headers: authHeaders() });
      return res.json();
    }
    await delay();
    return [...mockDb.certificates];
  },

  /** POST /api/certificates — genera y marca la recogida como certificada */
  generate: async (collectionId) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/certificates`, {
        method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ collectionId }),
      });
      return res.json();
    }
    await delay();
    const certId  = newCertId();
    const issued  = new Date().toISOString().slice(0, 10);
    const cert    = { id: certId, collectionId, issued };
    mockDb.certificates.push(cert);
    const col = mockDb.collections.find(c => c.id === collectionId);
    if (col) { col.certified = true; col.certId = certId; }
    return cert;
  },
};

// ─────────────────────────────────────────────────────────────
// AUTH (placeholder para backend real)
// ─────────────────────────────────────────────────────────────
export const authApi = {
  login: async (email, password) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Credenciales incorrectas");
      const data = await res.json();
      localStorage.setItem("token", data.token);
      return data.user;
    }
    await delay(600);
    if (email === "admin@technole.es" && password === "admin123") {
      return { id: 1, name: "Admin", role: "admin" };
    }
    throw new Error("Credenciales incorrectas");
  },

  logout: async () => {
    localStorage.removeItem("token");
  },
};

// ── Adjunta el token JWT a las peticiones reales ─────────────
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
