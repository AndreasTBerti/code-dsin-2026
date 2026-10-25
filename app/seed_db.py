import sqlite3
import os
import random

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, "database")
DB_PATH = os.path.join(DB_DIR, "prometheus.db")

os.makedirs(DB_DIR, exist_ok=True)

def gerar_banco():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH) 
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE equipamento (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            nome TEXT, tipo_icone TEXT, lat REAL, lng REAL, info TEXT
        )
    ''')

    tipos = ['camera', 'radar', 'agent', 'critical']
    status_op = ['Operacional - Visão Noturna ON', 'Operacional', 'Em Patrulha', 'Autoatendimento Ativo']
    status_crit = ['SINAL PERDIDO - ERRO 404', 'FALHA MECÂNICA', 'VANDALISMO DETECTADO', 'INTERVENÇÃO NECESSÁRIA']
    
    dados = []
    # Coordenadas X e Y de 2 a 98% para espalhar bem no mapa tático
    for i in range(1, 86):
        tipo = random.choice(tipos)
        lat = round(random.uniform(2, 98), 2)
        lng = round(random.uniform(2, 98), 2)
        
        if tipo == 'camera':
            nome = f"Câmera CFTV-0{i}"
            info = random.choice(status_op[:2])
        elif tipo == 'radar':
            nome = f"Radar Sistêmico RAD-{i}"
            info = "Operacional (Lim: 60 km/h)"
        elif tipo == 'agent':
            nome = f"Unidade {random.choice(['GCM', 'PM'])}-{i}"
            info = random.choice(status_op[2:])
        else:
            nome = f"Anomalia TOTEM-{i}"
            info = random.choice(status_crit)
            
        dados.append((nome, tipo, lat, lng, info))

    cursor.executemany('INSERT INTO equipamento (nome, tipo_icone, lat, lng, info) VALUES (?, ?, ?, ?, ?)', dados)
    conn.commit()
    conn.close()
    print(f"[SUCESSO] Banco Planta Baixa gerado em {DB_PATH}")

if __name__ == "__main__":
    gerar_banco()