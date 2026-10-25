import React, { useRef } from 'react';

export default function MapArea({ activeTab, entities, getEntityColor }) {
  const scrollRef = useRef(null);
  const dragState = useRef({ isDragging: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

  const handleMouseDown = (e) => {
    const ele = scrollRef.current;
    if (!ele) return;
    dragState.current.isDragging = true;
    dragState.current.startX = e.pageX - ele.offsetLeft;
    dragState.current.startY = e.pageY - ele.offsetTop;
    dragState.current.scrollLeft = ele.scrollLeft;
    dragState.current.scrollTop = ele.scrollTop;
    ele.style.cursor = 'grabbing';
    ele.style.userSelect = 'none';
  };

  const handleMouseLeaveOrUp = () => {
    dragState.current.isDragging = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.removeProperty('user-select');
    }
  };

  const handleMouseMove = (e) => {
    if (!dragState.current.isDragging) return;
    e.preventDefault();
    const ele = scrollRef.current;
    const walkX = (e.pageX - ele.offsetLeft - dragState.current.startX) * 1.5; 
    const walkY = (e.pageY - ele.offsetTop - dragState.current.startY) * 1.5;
    ele.scrollLeft = dragState.current.scrollLeft - walkX;
    ele.scrollTop = dragState.current.scrollTop - walkY;
  };

  return (
    <section className="flex-1 relative bg-[#030303] border-r border-corp-border overflow-hidden">
      
      {/* Container que permite o Drag and Scroll */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className="absolute inset-0 overflow-auto custom-scrollbar cursor-grab z-10"
      >
        <div className="w-[2000px] h-[2000px] relative" 
            style={{
              backgroundImage: `
                linear-gradient(#1f1f1f 1px, transparent 1px),
                linear-gradient(90deg, #1f1f1f 1px, transparent 1px),
                linear-gradient(#0a0a0a 1px, transparent 1px),
                linear-gradient(90deg, #0a0a0a 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
            }}>
            
            {/* ELEMENTOS TÁTICOS DO MAPA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gray-800/50 rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] border border-gray-800/30 rounded-full pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-800/50 pointer-events-none"></div>
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-800/50 pointer-events-none"></div>

            <div className="absolute top-[10%] left-[10%] border border-gray-800/30 p-8 w-[400px] h-[300px] pointer-events-none flex items-center justify-center">
              <span className="text-gray-800 font-bold text-4xl tracking-widest opacity-30 select-none">SETOR ALFA</span>
            </div>
            <div className="absolute top-[60%] left-[60%] border border-gray-800/30 p-8 w-[600px] h-[400px] pointer-events-none flex items-center justify-center">
              <span className="text-gray-800 font-bold text-4xl tracking-widest opacity-30 select-none">ZONA INDUSTRIAL</span>
            </div>

            {/* Renderização de Entidades */}
            {entities.map(ent => (
              <div 
                key={ent.id} 
                onMouseDown={(e) => e.stopPropagation()}
                /* HITBOX AUMENTADA (w-10 h-10) centralizando o ponto interno */
                className="absolute group cursor-crosshair transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center" 
                style={{ 
                  top: `${ent.lat}%`, 
                  left: `${ent.lng}%`, 
                  zIndex: ent.tipo_icone === 'critical' ? 50 : 10,
                  transition: 'top 5s linear, left 5s linear' 
                }}
              >
                {/* O ponto visual real continua com 12px (w-3 h-3) */}
                <div className={`w-3 h-3 rounded-full border border-black ${getEntityColor(ent.tipo_icone)} flex items-center justify-center shadow-[0_0_8px_rgba(255,255,255,0.2)]`}></div>
                
                {/* Tooltip ajustado para nascer acima da nova hitbox */}
                <div className="absolute hidden group-hover:block bottom-10 left-1/2 -translate-x-1/2 w-48 bg-black border border-gray-600 p-2 z-[60] shadow-2xl pointer-events-none transition-none">
                  <p className="text-[10px] font-bold text-white mb-1 border-b border-gray-700 pb-1">{ent.nome}</p>
                  <p className="text-[10px] font-mono text-gray-400">{ent.info}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* OVERLAY PROMETHEUS - Tipografia Fluida */}
      {activeTab === 'preditivo' && (
        <div className="absolute inset-0 bg-red-900/10 z-20 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="absolute w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-red-600/5 rounded-full animate-ping"></div>
          {/* Fonte usando 'vw' garante que o texto encolha sem ultrapassar a tela */}
          <h2 className="text-[7vw] md:text-[5vw] font-bold text-red-500/20 tracking-[0.2em] md:tracking-[0.4em] text-center w-full px-4 select-none">
            PROMETHEUS
          </h2>
        </div>
      )}
    </section>
  );
}