"""
routers/clients.py
"""
from fastapi     import APIRouter, Depends, HTTPException
from typing      import List
from models.schemas import Client, ClientCreate, ClientUpdate
from db.database    import get_db
from middleware.auth import require_auth

router = APIRouter()

@router.get("/", response_model=List[Client])
async def get_clients(db=Depends(get_db), _=Depends(require_auth)):
    rows = await db.fetch("SELECT * FROM clients ORDER BY name")
    return [dict(r) for r in rows]

@router.post("/", response_model=Client, status_code=201)
async def create_client(body: ClientCreate, db=Depends(get_db), _=Depends(require_auth)):
    row = await db.fetchrow(
        "INSERT INTO clients (name,contact,email,phone,nif) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        body.name, body.contact, body.email, body.phone, body.nif
    )
    return dict(row)

@router.put("/{client_id}", response_model=Client)
async def update_client(client_id: int, body: ClientUpdate, db=Depends(get_db), _=Depends(require_auth)):
    row = await db.fetchrow(
        "UPDATE clients SET name=$1,contact=$2,email=$3,phone=$4,nif=$5 WHERE id=$6 RETURNING *",
        body.name, body.contact, body.email, body.phone, body.nif, client_id
    )
    if not row: raise HTTPException(404, "Client not found")
    return dict(row)

@router.delete("/{client_id}", status_code=204)
async def delete_client(client_id: int, db=Depends(get_db), _=Depends(require_auth)):
    await db.execute("DELETE FROM clients WHERE id=$1", client_id)
