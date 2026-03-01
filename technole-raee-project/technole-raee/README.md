# TECHNØLÉ · RAEE Management System

MVP de gestión de recogida y destrucción de residuos electrónicos.

---

## Estructura del proyecto

```
technole-raee/
├── frontend/          → React app (Vite)
│   └── src/
│       ├── api/       → Capa de acceso a datos (mock hoy, real mañana)
│       ├── components/
│       │   ├── ui/    → Primitivos reutilizables (Button, Modal, Badge…)
│       │   ├── layout/→ Sidebar, Topbar
│       │   └── pages/ → Dashboard, Clients, Collections, Certificates
│       ├── hooks/     → Estado global y lógica compartida
│       ├── styles/    → CSS global
│       └── utils/     → Generador de certificados PDF
└── backend/
    ├── node/          → Opción A: Express + Node.js
    └── python/        → Opción B: FastAPI + Python
```

---

## Cómo levantar el frontend (modo demo)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Login demo: `admin@technole.es` / `admin123`

---

## Cómo conectar un backend real

El **único archivo que cambia** cuando conectas un backend real es:

```
frontend/src/api/client.js
```

Hoy devuelve datos en memoria. Cuando tengas un servidor real:

```js
// Antes (mock):
export const getClients = async () => mockDb.clients;

// Después (real):
export const getClients = async () => {
  const res = await fetch(`${API_URL}/clients`, { headers: authHeaders() });
  return res.json();
};
```

Ningún componente ni página cambia. La arquitectura está diseñada para este intercambio.

---

## Opción A — Backend Node.js + Express

```bash
cd backend/node
npm install
# Configura .env con tu cadena de conexión a PostgreSQL
npm run dev
# → API en http://localhost:3001
```

Variables de entorno necesarias:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/technole
JWT_SECRET=tu_secreto_aqui
PORT=3001
```

---

## Opción B — Backend Python + FastAPI

```bash
cd backend/python
pip install -r requirements.txt
# Configura .env con tu cadena de conexión
uvicorn main:app --reload --port 3001
# → API en http://localhost:3001
# → Docs en http://localhost:3001/docs
```

Variables de entorno necesarias:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/technole
SECRET_KEY=tu_secreto_aqui
```

---

## Base de datos (PostgreSQL recomendado)

El esquema SQL está en `backend/node/db/schema.sql`.
Compatible con PostgreSQL 14+ y también con SQLite para desarrollo local.


## Despliegue local de Node (Docker)

Para levantar un entorno **desplegable en este equipo** (API + PostgreSQL) sin instalar PostgreSQL local:

```bash
cd backend/node
cp .env.example .env
# (opcional) ajusta JWT_SECRET y FRONTEND_URL
docker compose up --build -d
```

Servicios:
- API: `http://localhost:3001`
- Health: `http://localhost:3001/health`
- PostgreSQL: `localhost:5432`

Parar servicios:

```bash
cd backend/node
docker compose down
```

El esquema SQL se aplica automáticamente al iniciar PostgreSQL, montando `db/schema.sql` en `docker-entrypoint-initdb.d`.


### Errores comunes (Windows)

Si ves `ERR_UNSUPPORTED_DIR_IMPORT` apuntando a `middleware/auth.js`, normalmente hay un conflicto local con una carpeta antigua llamada `auth.js`.

Solución:

```powershell
cd backend\node
# elimina artefactos locales antiguos (si existen)
rmdir .\middleware\auth.js -Recurse -Force
rmdir .\middleware\validate.js -Recurse -Force

# reinstala dependencias
npm install
npm start
```

> Nota: en esta versión, los imports de middlewares usan archivos explícitos `*.middleware.js` para evitar este conflicto.

---

## Roadmap sugerido para producción

1. **Auth real** → JWT en el backend, interceptor en `api/client.js`
2. **Base de datos** → Aplicar `schema.sql` con las migraciones
3. **PDF real** → Sustituir `utils/certGenerator.js` por `puppeteer` o `pdfkit` en el backend
4. **Deploy** → Frontend en Vercel/Netlify, Backend en Railway/Render/VPS
