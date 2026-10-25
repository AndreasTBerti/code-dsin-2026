import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
import threading
import time
import random
from contextlib import asynccontextmanager

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database", "prometheus.db")

class EquipamentoCreate(BaseModel):
    nome: str
    tipo_icone: str
    lat: float
    lng: float
    info: str

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- LÓGICA DE TELEMETRIA (MOVIMENTO) ---
def simulador_telemetria():
    """Simula a movimentação em tempo real das unidades de patrulha."""
    while True:
        time.sleep(5)
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("SELECT id, lat, lng FROM equipamento WHERE tipo_icone = 'agent'")
            agentes = cursor.fetchall()
            
            for agente in agentes:
                nova_lat = agente['lat'] + random.uniform(-1.5, 1.5)
                nova_lng = agente['lng'] + random.uniform(-1.5, 1.5)
                
                nova_lat = max(2, min(98, nova_lat))
                nova_lng = max(2, min(98, nova_lng))
                
                cursor.execute(
                    "UPDATE equipamento SET lat = ?, lng = ? WHERE id = ?", 
                    (round(nova_lat, 2), round(nova_lng, 2), agente['id'])
                )
            
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[ERRO DE TELEMETRIA]: {e}")

# --- INICIALIZAÇÃO SEGURA DA THREAD ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Roda assim que o servidor ligar
    threading.Thread(target=simulador_telemetria, daemon=True).start()
    print("=========================================")
    print("[PROMETHEUS] Telemetria de campo ativada via Lifespan.")
    print("=========================================")
    yield
    # (Opcional) Código para quando o servidor desligar iria aqui

app = FastAPI(title="Prometheus API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROTAS DA API CRUD ---
@app.get("/api/equipamentos")
def listar_equipamentos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM equipamento")
    linhas = cursor.fetchall()
    conn.close()
    return [dict(linha) for linha in linhas]

@app.post("/api/equipamentos")
def criar_equipamento(eq: EquipamentoCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO equipamento (nome, tipo_icone, lat, lng, info) VALUES (?, ?, ?, ?, ?)",
        (eq.nome, eq.tipo_icone, eq.lat, eq.lng, eq.info)
    )
    conn.commit()
    conn.close()
    return {"status": "sucesso"}

@app.delete("/api/equipamentos/{item_id}")
def deletar_equipamento(item_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM equipamento WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return {"status": "deletado"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)