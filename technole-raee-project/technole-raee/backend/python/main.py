"""
main.py — Backend FastAPI (alternativa a Node.js)
─────────────────────────────────────────────────────────
Para desarrollo: uvicorn main:app --reload --port 3001
Docs interactivas: http://localhost:3001/docs
─────────────────────────────────────────────────────────
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import clients, collections, certificates, auth

app = FastAPI(
    title="TECHNØLÉ RAEE API",
    description="Sistema de gestión de residuos electrónicos",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://tu-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Rutas ──────────────────────────────────────────────────
app.include_router(auth.router,         prefix="/api/auth",         tags=["Auth"])
app.include_router(clients.router,      prefix="/api/clients",      tags=["Clients"])
app.include_router(collections.router,  prefix="/api/collections",  tags=["Collections"])
app.include_router(certificates.router, prefix="/api/certificates", tags=["Certificates"])

@app.get("/health")
def health():
    from datetime import datetime
    return {"status": "ok", "ts": datetime.utcnow().isoformat()}
