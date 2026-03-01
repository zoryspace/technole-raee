"""
models/schemas.py — Modelos Pydantic
Validan entrada y tipan las respuestas de la API.
"""

from pydantic import BaseModel
from typing   import Optional, List
from datetime import date as Date

# ── Clients ───────────────────────────────────────────────
class ClientBase(BaseModel):
    name:    str
    contact: Optional[str] = None
    email:   Optional[str] = None
    phone:   Optional[str] = None
    nif:     Optional[str] = None

class ClientCreate(ClientBase): pass
class ClientUpdate(ClientBase): pass

class Client(ClientBase):
    id: int
    class Config: from_attributes = True

# ── Devices ───────────────────────────────────────────────
class DeviceBase(BaseModel):
    brand:  str
    model:  str
    serial: Optional[str] = None
    method: str  # borrado_logico | trituracion | otros

class Device(DeviceBase):
    id: int
    collection_id: int
    class Config: from_attributes = True

# ── Collections ───────────────────────────────────────────
class CollectionBase(BaseModel):
    client_id:    int
    date:         Date
    address:      Optional[str] = None
    technician:   Optional[str] = None
    service_type: Optional[str] = None

class CollectionCreate(CollectionBase): pass
class CollectionUpdate(CollectionBase): pass

class Collection(CollectionBase):
    id:        int
    certified: bool = False
    cert_id:   Optional[str] = None
    devices:   List[Device] = []
    class Config: from_attributes = True

class DevicesUpdate(BaseModel):
    devices: List[DeviceBase]

# ── Certificates ──────────────────────────────────────────
class Certificate(BaseModel):
    id:            str
    collection_id: int
    issued:        Date
    class Config: from_attributes = True

class CertificateCreate(BaseModel):
    collection_id: int

# ── Auth ──────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email:    str
    password: str

class TokenResponse(BaseModel):
    token: str
    user:  dict
