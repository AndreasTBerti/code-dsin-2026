# 🛡️ Prometheus - Sistema Tático de Monitoramento e Telemetria (DSIN 2026)

O **Prometheus** é uma plataforma de monitoramento tático georreferenciado e telemetria operacional em tempo real voltada para segurança pública e gestão de cidades inteligentes. O sistema permite visualizar, gerenciar e prever anomalias em ativos de campo (câmeras CFTV, radares de tráfego, viaturas policiais em patrulha e totens de autoatendimento/anomalias críticas).

---

## 📋 Sumário
- [Visão Geral](#-visão-geral)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Arquitetura e Tecnologias](#-arquitetura-e-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Como Executar o Projeto](#-como-executar-o-projeto)
  - [1. Clonar e Acessar o Diretório](#1-clonar-e-acessar-o-diretório)
  - [2. Configurar o Backend (FastAPI + Python)](#2-configurar-o-backend-fastapi--python)
  - [3. Popular o Banco de Dados (Seed Inicial)](#3-popular-o-banco-de-dados-seed-inicial)
  - [4. Iniciar o Servidor Backend](#4-iniciar-o-servidor-backend)
  - [5. Configurar e Iniciar o Frontend (React + Vite)](#5-configurar-e-iniciar-o-frontend-react--vite)
- [Endpoints da API REST](#-endpoints-da-api-rest)
- [Licença](#-licença)

---

## 🎯 Visão Geral

O sistema simula um Centro Integrado de Operações (COI), integrando:
- **Planta Baixa Tática & Mapa Georreferenciado:** Localização precisa e monitoramento visual das unidades.
- **Telemetria Autônoma de Campo:** Thread de segundo plano no backend que simula a movimentação constante de viaturas policiais e guardas em patrulha.
- **Métricas e Análise Preditiva:** Acompanhamento preditivo de anomalias com níveis de criticidade e telemetria em tempo real.
- **Gestão de Inventário de Equipamentos:** Cadastro, exclusão e visualização de status detalhado dos dispositivos e agentes.

---

## 🚀 Funcionalidades Principais

1. **Visão Tática / Operacional:**
   - Mapa de calor e distribuição geográfica dos equipamentos.
   - Atualização contínua a cada 5 segundos com *polling* inteligente.
   - Indicadores de integridade de sinal e status das câmeras, radares e patrulhas.

2. **Visão Preditiva:**
   - Gráficos analíticos de incidentes e anomalias sistêmicas.
   - Identificação imediata de pontos de atenção com sinal de alerta visual (*pulse critical*).

3. **Inventário & Gestão de Ativos (CRUD):**
   - Tabela de equipamentos com filtros por categoria.
   - Inserção de novos equipamentos via modal interativo (nome, tipo, coordenadas e status).
   - Exclusão com atualização imediata da base.

4. **Simulação Dinâmica de Telemetria:**
   - Loop em background (*FastAPI Lifespan Thread*) que recalcula periodicamente as posições geográficas das unidades móveis (`tipo_icone = 'agent'`).

---

## 🛠️ Arquitetura e Tecnologias

### Backend
- **Linguagem:** Python 3.10+
- **Framework Web:** [FastAPI](https://fastapi.tiangolo.com/) (API REST assíncrona de alto desempenho)
- **Servidor ASGI:** [Uvicorn](https://www.uvicorn.org/)
- **Validação & Tipagem:** [Pydantic v2](https://docs.pydantic.dev/)
- **Banco de Dados:** SQLite3 (embutido, leve e com zero dependência externa)

### Frontend
- **Framework/Biblioteca:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS 3](https://tailwindcss.com/) com paleta corporativa militar/cyberpunk e scanlines
- **Mapas:** [Leaflet](https://leafletjs.com/) e [React-Leaflet](https://react-leaflet.js.org/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Visualização de Dados:** [Recharts](https://recharts.org/)

---

## 📁 Estrutura do Projeto

```text
code-dsin-2026/
├── requirements.txt            # Dependências Python do backend
├── app/
│   ├── main.py                 # Ponto de entrada FastAPI, rotas e thread de telemetria
│   ├── seed_db.py              # Script de inicialização e geração de dados no SQLite
│   ├── database/
│   │   └── prometheus.db       # Banco de dados SQLite gerado localmente
│   └── frontend/               # Aplicação SPA em React + Vite
│       ├── package.json        # Dependências e scripts npm
│       ├── vite.config.js      # Configuração do Vite e proxy reverso para /api
│       ├── tailwind.config.js  # Configuração de temas e cores
│       ├── src/
│       │   ├── App.jsx         # Componente raiz, estados globais e navegação
│       │   ├── components/
│       │   │   ├── Header.jsx           # Barra superior e alternador de abas
│       │   │   ├── MapArea.jsx          # Área de mapa/planta baixa tática
│       │   │   ├── PanelOperacional.jsx # Métricas e estatísticas operacionais
│       │   │   ├── PanelPreditivo.jsx   # Análise preditiva e anomalias
│       │   │   ├── Inventario.jsx       # Tabela completa de ativos
│       │   │   └── AddModal.jsx         # Modal de cadastro de novos ativos
│       │   └── index.css       # Estilos globais e animações
└── README.md
```

---

## 💻 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em seu ambiente:
- **Python 3.10** ou superior: [Download Python](https://www.python.org/)
- **Node.js 18** ou superior com **npm**: [Download Node.js](https://nodejs.org/)
- **Git**: [Download Git](https://git-scm.com/)

---

## ⚡ Como Executar o Projeto

Siga os passos abaixo no **Prompt de Comando (CMD)** ou **PowerShell** no Windows:

### 1. Clonar e Acessar o Diretório
```powershell
cd code-dsin-2026
```

---

### 2. Configurar o Backend (FastAPI + Python)

Crie e ative um ambiente virtual para isolar as bibliotecas:

```powershell
# Criar o ambiente virtual (caso ainda não exista)
python -m venv .venv

# Ativar no Windows (PowerShell)
.\.venv\Scripts\Activate.ps1

# (Caso use Prompt de Comando CMD tradicional: .venv\Scripts\activate.bat)
```

Instale as dependências listadas no `requirements.txt`:
```powershell
pip install -r requirements.txt
```

---

### 3. Popular o Banco de Dados (Seed Inicial)

Execute o script `seed_db.py` para criar a tabela de equipamentos e gerar os registros iniciais (radares, viaturas, câmeras e anomalias):

```powershell
python app/seed_db.py
```
> Mensagem esperada: `[SUCESSO] Banco Planta Baixa gerado em ...\database\prometheus.db`

---

### 4. Iniciar o Servidor Backend

Navegue até o diretório `app` ou inicie o servidor indicando o módulo:

```powershell
# A partir do diretório raiz code-dsin-2026:
cd app
uvicorn main:app --reload --port 8000
```

O servidor backend estará disponível em:
- **API URL:** `http://localhost:8000`
- **Swagger UI (Documentação Interativa):** `http://localhost:8000/docs`
- **Redoc UI:** `http://localhost:8000/redoc`

---

### 5. Configurar e Iniciar o Frontend (React + Vite)

Abra um **novo terminal**, navegue até o diretório `app/frontend` e inicialize o servidor de desenvolvimento:

```powershell
# Navegar até a pasta do frontend
cd code-dsin-2026/app/frontend

# Instalar os pacotes npm
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando no endereço:
- **Painel Tático:** [http://localhost:5173](http://localhost:5173)

> **Nota:** As requisições iniciadas com `/api` feitas pelo frontend são redirecionadas automaticamente pelo proxy do Vite para `http://localhost:8000`.

---

## 📡 Endpoints da API REST

A API disponibiliza os seguintes endpoints para gerenciamento de equipamentos:

| Método | Endpoint | Descrição | Corpo da Requisição (Payload) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/equipamentos` | Lista todos os equipamentos cadastrados no banco | *Nenhum* |
| `POST` | `/api/equipamentos` | Cadastra um novo equipamento ou unidade | `{"nome": string, "tipo_icone": string, "lat": float, "lng": float, "info": string}` |
| `DELETE` | `/api/equipamentos/{item_id}` | Remove um equipamento por ID | *Nenhum* |

### Tipos de Ícones Suportados:
- `camera`: Câmeras CFTV
- `radar`: Radares de monitoramento viário
- `agent`: Viaturas operacionais / Agentes de patrulha (GCM / PM)
- `critical`: Totens em anomalia ou alertas de intervenção

---

## 👥 Autoria e Licença

Desenvolvido para o projeto e desafio **DSIN 2026**.
Distribuído sob licença livre e open-source para fins educacionais e de demonstração.
