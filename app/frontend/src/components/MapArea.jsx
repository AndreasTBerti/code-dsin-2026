import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Espaço da cidade ficção em CRS.Simple (plano, sem coordenadas geográficas)
// Marcadores distribuídos numa área de 400x400 unidades centradas em [0,0]
const MAP_RANGE = 200;

const pctToLatLng = (lat_pct, lng_pct) => [
  MAP_RANGE - (lat_pct / 100) * (MAP_RANGE * 2),
  -MAP_RANGE + (lng_pct / 100) * (MAP_RANGE * 2),
];

// ─── ÍCONES SVG POR TIPO ──────────────────────────────────────────────────────
const ICON_DEFS = {
  camera: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.6)',
    pulse: false,
    shape: 'circle',
  },
  radar: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    color: '#eab308',
    glow: 'rgba(234,179,8,0.6)',
    pulse: false,
    shape: 'diamond',
  },
  agent: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.7)',
    pulse: false,
    shape: 'square',
  },
  critical: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.9)',
    pulse: true,
    shape: 'circle',
  },
};

function getBorderRadius(shape) {
  if (shape === 'circle') return '50%';
  if (shape === 'square') return '4px';
  if (shape === 'diamond') return '3px';
  return '50%';
}

function makeIcon(tipo) {
  const def = ICON_DEFS[tipo] || ICON_DEFS['camera'];
  const size = 28;
  const ringSize = size + 14;
  const borderRadius = getBorderRadius(def.shape);

  const ringHtml = def.pulse
    ? `<div style="
        position:absolute;
        width:${ringSize}px;
        height:${ringSize}px;
        border:2px solid ${def.color};
        border-radius:50%;
        left:50%;top:50%;
        transform:translate(-50%,-50%);
        animation:prometheus-ring 1.4s ease-out infinite;
        pointer-events:none;
      "></div>`
    : '';

  const pulseAnim = def.pulse
    ? `animation:prometheus-pulse 1.4s ease-in-out infinite;`
    : '';

  const html = `
    <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
      ${ringHtml}
      <div style="
        width:${size}px;height:${size}px;
        background:rgba(0,0,0,0.88);
        border:2px solid ${def.color};
        border-radius:${borderRadius};
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 0 10px ${def.glow},0 0 22px ${def.glow}55,inset 0 0 6px ${def.glow}22;
        ${pulseAnim}
      ">
        <div style="width:${Math.round(size * 0.55)}px;height:${Math.round(size * 0.55)}px;color:${def.color};">
          ${def.svg}
        </div>
      </div>
    </div>`;

  return L.divIcon({
    html,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    tooltipAnchor: [0, -(size / 2 + 4)],
  });
}

// ─── CSS CUSTOMIZADO DO LEAFLET ───────────────────────────────────────────────
const MAP_CSS = `
  .leaflet-container { background:#080a0c !important; font-family:'Inter',sans-serif; }
  .leaflet-control-zoom { border:1px solid #2c2c2c !important; background:transparent !important; border-radius:0 !important; }
  .leaflet-control-zoom a { background:#0d0d0d !important; color:#555 !important; border-bottom:1px solid #2c2c2c !important; transition:all 0.2s; border-radius:0 !important; }
  .leaflet-control-zoom a:hover { background:#1a1a1a !important; color:#ef4444 !important; }
  .leaflet-control-attribution { background:rgba(0,0,0,0.55) !important; color:#2a2a2a !important; font-size:9px !important; }
  .leaflet-control-attribution a { color:#3a3a3a !important; }
  .leaflet-popup-content-wrapper { background:rgba(6,6,6,0.97) !important; border:1px solid #2c2c2c !important; border-radius:0 !important; color:#dcdcdc !important; box-shadow:0 0 20px rgba(0,0,0,0.85) !important; }
  .leaflet-popup-tip-container { margin-top:-1px; }
  .leaflet-popup-tip { background:#1f1f1f !important; }
  .leaflet-popup-close-button { color:#555 !important; }
  .leaflet-popup-close-button:hover { color:#ef4444 !important; }
  .prometheus-tooltip {
    background:rgba(4,4,4,0.95) !important;
    border:1px solid #2a2a2a !important;
    border-radius:0 !important;
    padding:5px 10px !important;
    color:#ccc !important;
    font-size:11px !important;
    font-family:'Courier Prime',monospace !important;
    box-shadow:0 0 14px rgba(0,0,0,0.95) !important;
    white-space:nowrap !important;
  }
  .leaflet-tooltip-top.prometheus-tooltip::before { border-top-color:#2a2a2a !important; }
  @keyframes prometheus-pulse {
    0%,100% { box-shadow:0 0 10px rgba(239,68,68,0.85),0 0 20px rgba(239,68,68,0.35); transform:scale(1); }
    50%      { box-shadow:0 0 22px rgba(239,68,68,1),0 0 42px rgba(239,68,68,0.55); transform:scale(1.13); }
  }
  @keyframes prometheus-ring {
    0%   { transform:translate(-50%,-50%) scale(0.65); opacity:0.9; }
    100% { transform:translate(-50%,-50%) scale(1.9); opacity:0; }
  }
`;

// ─── ANIMAÇÃO SUAVE DE MOVIMENTO ──────────────────────────────────────────────
function animateMarker(marker, from, to, duration) {
  const startTime = performance.now();
  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    // cubic ease-in-out
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    marker.setLatLng([
      from.lat + (to.lat - from.lat) * ease,
      from.lng + (to.lng - from.lng) * ease,
    ]);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
export default function MapArea({ activeTab, entities, getEntityColor }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const styleInjected = useRef(false);

  // Injeta CSS customizado uma única vez
  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const style = document.createElement('style');
    style.textContent = MAP_CSS;
    document.head.appendChild(style);
  }, []);

  // Inicializa o mapa Leaflet
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
      minZoom: 0,
      maxZoom: 6,
      crs: L.CRS.Simple,
    });

    // Enquadra o mapa para mostrar toda a área dos markers (±MAP_RANGE)
    map.fitBounds([
      [-MAP_RANGE, -MAP_RANGE],
      [ MAP_RANGE,  MAP_RANGE],
    ], { padding: [20, 20] });

    // ── MAPA PROCEDURAL: cidade ficcão sem dados reais ──────────────────────
    // RNG determinístico por seed (Mulberry32)
    function mulberry32(seed) {
      return function () {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }

    // Paleta industrial escura
    const C = {
      bg:        '#080a0c',   // fundo urbano
      block:     '#0d1014',   // quarteirão (levemente mais claro)
      blockAlt:  '#0a0c0f',   // quarteirão alternativo
      water:     '#060d14',   // canais/rios
      park:      '#080e0a',   // parques
      roadMajor: '#1c2028',   // avenidas principais
      roadMid:   '#141820',   // ruas secundárias
      roadMinor: '#0f1318',   // becos / vielas
      railLine:  '#12161e',   // trilhos
      railDash:  '#1a2030',   // traço do trilho
      grid:      '#0c1016',   // linhas de grid
    };

    const ProceduralCity = L.GridLayer.extend({
      createTile(coords) {
        const tile = document.createElement('canvas');
        const size = this.getTileSize();
        tile.width  = size.x;
        tile.height = size.y;
        const ctx = tile.getContext('2d');
        const { x, y, z } = coords;
        const seed = (x * 374761393 + y * 1000003 + z * 2654435761) >>> 0;
        const rng  = mulberry32(seed);
        const W = size.x, H = size.y;

        // ── 1. Fundo base ──────────────────────────────────────────────────
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, W, H);

        // ── 2. Parques / áreas verdes (raros) ─────────────────────────────
        const nParks = Math.floor(rng() * 2);
        for (let i = 0; i < nParks; i++) {
          const px = rng() * W, py = rng() * H;
          const pw = 30 + rng() * 60,  ph = 20 + rng() * 50;
          ctx.fillStyle = C.park;
          ctx.fillRect(px - pw/2, py - ph/2, pw, ph);
        }

        // ── 3. Canais / rios (muito raros) ────────────────────────────────
        if (rng() < 0.08) {
          const vert = rng() < 0.5;
          const pos  = rng() * (vert ? W : H);
          const w    = 4 + rng() * 10;
          ctx.fillStyle = C.water;
          if (vert) ctx.fillRect(pos - w/2, 0, w, H);
          else      ctx.fillRect(0, pos - w/2, W, w);
        }

        // ── 4. Grid de quarteirões (malha urbana base) ────────────────────
        // Cada tile tem de 2 a 5 subdivisões por eixo
        const cols = 2 + Math.floor(rng() * 4);
        const rows = 2 + Math.floor(rng() * 4);
        // Gera divisores irregulares (não uniformes, como cidade real)
        function irregDividers(n, total, r) {
          const divs = [0];
          const base = total / n;
          for (let i = 1; i < n; i++) divs.push(divs[i-1] + base * (0.6 + r() * 0.8));
          divs.push(total);
          return divs;
        }
        const xDivs = irregDividers(cols, W, rng);
        const yDivs = irregDividers(rows, H, rng);

        // Preenche quarteirões
        for (let ci = 0; ci < cols; ci++) {
          for (let ri = 0; ri < rows; ri++) {
            const bx = xDivs[ci], bw = xDivs[ci+1] - xDivs[ci];
            const by = yDivs[ri], bh = yDivs[ri+1] - yDivs[ri];
            const roadW = 3 + rng() * 4;
            ctx.fillStyle = rng() < 0.3 ? C.blockAlt : C.block;
            ctx.fillRect(bx + roadW, by + roadW, bw - roadW*2, bh - roadW*2);

            // Detalhes internos do quarteirão: subdivisões de lotes
            if (bw > 40 && bh > 40 && rng() < 0.6) {
              const nSubdivs = 1 + Math.floor(rng() * 3);
              for (let s = 0; s < nSubdivs; s++) {
                if (rng() < 0.5) {
                  // linha vertical interna
                  const lx = bx + roadW + rng() * (bw - roadW*2);
                  ctx.fillStyle = C.roadMinor;
                  ctx.fillRect(lx, by + roadW, 1, bh - roadW*2);
                } else {
                  // linha horizontal interna
                  const ly = by + roadW + rng() * (bh - roadW*2);
                  ctx.fillStyle = C.roadMinor;
                  ctx.fillRect(bx + roadW, ly, bw - roadW*2, 1);
                }
              }
            }
          }
        }

        // ── 5. Ruas secundárias (divisores de quarteirões) ────────────────
        ctx.fillStyle = C.roadMid;
        for (let ci = 1; ci < cols; ci++) {
          const rw = 2 + rng() * 3;
          ctx.fillRect(xDivs[ci] - rw/2, 0, rw, H);
        }
        for (let ri = 1; ri < rows; ri++) {
          const rw = 2 + rng() * 3;
          ctx.fillRect(0, yDivs[ri] - rw/2, W, rw);
        }

        // ── 6. Avenidas principais (1-2 por tile) ─────────────────────────
        const nMajor = 1 + Math.floor(rng() * 2);
        for (let m = 0; m < nMajor; m++) {
          const vert = rng() < 0.5;
          const pos  = 0.2 * (vert ? W : H) + rng() * 0.6 * (vert ? W : H);
          const w    = 6 + rng() * 6;
          ctx.fillStyle = C.roadMajor;
          if (vert) ctx.fillRect(pos - w/2, 0, w, H);
          else      ctx.fillRect(0, pos - w/2, W, w);
          // Linha central da avenida (marcação)
          ctx.fillStyle = C.roadMid;
          const lw = 1;
          if (vert) ctx.fillRect(pos - lw/2, 0, lw, H);
          else      ctx.fillRect(0, pos - lw/2, W, lw);
        }

        // ── 7. Linha férrea (rara) ────────────────────────────────────────
        if (rng() < 0.07) {
          const vert = rng() < 0.5;
          const pos  = rng() * (vert ? W : H);
          ctx.strokeStyle = C.railLine;
          ctx.lineWidth = 3;
          ctx.beginPath();
          if (vert) { ctx.moveTo(pos, 0); ctx.lineTo(pos, H); }
          else      { ctx.moveTo(0, pos); ctx.lineTo(W, pos); }
          ctx.stroke();
          // Traços das dormentes
          ctx.strokeStyle = C.railDash;
          ctx.lineWidth = 5;
          ctx.setLineDash([4, 8]);
          ctx.beginPath();
          if (vert) { ctx.moveTo(pos, 0); ctx.lineTo(pos, H); }
          else      { ctx.moveTo(0, pos); ctx.lineTo(W, pos); }
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // ── 8. Grid tático sutil (overlay de vigilância) ──────────────────
        if (z >= 3) {
          ctx.strokeStyle = C.grid;
          ctx.lineWidth = 0.3;
          ctx.globalAlpha = 0.4;
          const step = W / 8;
          for (let gx = 0; gx <= W; gx += step) {
            ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
          }
          for (let gy = 0; gy <= H; gy += step) {
            ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }

        return tile;
      },
    });

    new ProceduralCity({ tileSize: 256, minZoom: 0, maxZoom: 6 }).addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // Sincroniza marcadores com as entidades
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentIds = new Set(entities.map((e) => e.id));

    // Remove markers obsoletos
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentIds.has(Number(id))) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    entities.forEach((ent) => {
      const [lat, lng] = pctToLatLng(ent.lat, ent.lng);
      const def = ICON_DEFS[ent.tipo_icone] || ICON_DEFS['camera'];

      if (markersRef.current[ent.id]) {
        // Marker existe — anima suavemente para nova posição
        const marker = markersRef.current[ent.id];
        const cur = marker.getLatLng();
        const dlat = Math.abs(cur.lat - lat);
        const dlng = Math.abs(cur.lng - lng);
        if (dlat > 0.00005 || dlng > 0.00005) {
          animateMarker(marker, cur, { lat, lng }, 4500);
        }
      } else {
        // Cria novo marker
        const marker = L.marker([lat, lng], {
          icon: makeIcon(ent.tipo_icone),
          zIndexOffset: ent.tipo_icone === 'critical' ? 1000 : 0,
        });

        marker.bindTooltip(
          `<span style="color:${def.color};font-weight:bold;letter-spacing:0.04em">${ent.nome}</span><br/>` +
          `<span style="color:#666;font-size:10px">${ent.info}</span>`,
          { direction: 'top', permanent: false, className: 'prometheus-tooltip', offset: [0, -14] }
        );

        marker.bindPopup(
          `<div style="min-width:190px;padding:2px 0">
            <p style="color:${def.color};font-weight:700;font-size:11px;margin:0 0 5px;letter-spacing:0.06em;text-transform:uppercase">${ent.nome}</p>
            <p style="color:#777;font-size:10px;margin:0 0 8px;font-family:monospace">${ent.info}</p>
            <hr style="border:none;border-top:1px solid #1f1f1f;margin:0 0 6px"/>
            <p style="color:#3a3a3a;font-size:9px;margin:0;font-family:monospace">ID: ${ent.id} &nbsp;|&nbsp; TIPO: ${ent.tipo_icone.toUpperCase()}</p>
            <p style="color:#3a3a3a;font-size:9px;margin:3px 0 0;font-family:monospace">COORD: ${lat.toFixed(5)}, ${lng.toFixed(5)}</p>
          </div>`,
          { maxWidth: 250 }
        );

        marker.addTo(map);
        markersRef.current[ent.id] = marker;
      }
    });
  }, [entities]);

  return (
    <section className="flex-1 relative bg-[#030303] border-r border-corp-border overflow-hidden">
      {/* Mapa Leaflet */}
      <div ref={mapContainerRef} className="absolute inset-0 z-10" />

      {/* Vignette industrial */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,0.6) 100%),
                       linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 9%, transparent 91%, rgba(0,0,0,0.45) 100%)`,
        }}
      />

      {/* Barra de status tática (canto superior esquerdo) */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none flex flex-col gap-1">
        <div style={{ background: 'rgba(0,0,0,0.78)', color: '#ef4444', border: '1px solid rgba(80,20,20,0.5)' }}
          className="text-[10px] font-mono tracking-widest px-2 py-1">
          ▸ PROMETHEUS CITY — GRID TÁTICO
        </div>
        <div style={{ background: 'rgba(0,0,0,0.65)', color: '#3a3a3a' }}
          className="text-[9px] font-mono px-2 py-0.5">
          {entities.length} UNIDADES · TELEMETRIA LIVE
        </div>
      </div>

      {/* Legenda (canto inferior direito) */}
      <div
        className="absolute bottom-6 right-4 z-30 pointer-events-none p-2 flex flex-col gap-1.5"
        style={{ background: 'rgba(0,0,0,0.82)', border: '1px solid #1a1a1a' }}
      >
        {Object.entries(ICON_DEFS).map(([tipo, def]) => (
          <div key={tipo} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: def.color, boxShadow: `0 0 5px ${def.glow}` }}
            />
            <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: '#4a4a4a' }}>
              {tipo}
            </span>
          </div>
        ))}
      </div>

      {/* OVERLAY PROMETHEUS — aba preditivo */}
      {activeTab === 'preditivo' && (
        <div className="absolute inset-0 bg-red-900/10 z-40 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="absolute w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-red-600/5 rounded-full animate-ping" />
          <h2 className="text-[7vw] md:text-[5vw] font-bold text-red-500/20 tracking-[0.2em] md:tracking-[0.4em] text-center w-full px-4 select-none">
            PROMETHEUS
          </h2>
        </div>
      )}
    </section>
  );
}