import React from 'react';

export default function PanelOperacional({ entities }) {
  return (
    <aside className="w-full md:w-96 bg-corp-panel p-4 flex flex-col z-30 h-full overflow-y-auto custom-scrollbar border-l border-corp-border">
      <h3 className="text-xs font-bold text-gray-500 tracking-widest border-b border-corp-border pb-2 mb-4">MÉTRICAS GLOBAIS</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-black border border-gray-800 p-3 text-center">
          <span className="text-[10px] text-gray-500 block">REDE IOT</span>
          <span className="text-2xl font-mono text-white">{entities.filter(e => e.tipo_icone !== 'agent').length}</span>
        </div>
        <div className="bg-black border border-gray-800 p-3 text-center">
          <span className="text-[10px] text-gray-500 block">AGENTES ATIVOS</span>
          <span className="text-2xl font-mono text-blue-400">{entities.filter(e => e.tipo_icone === 'agent').length}</span>
        </div>
      </div>
      
      <h3 className="text-xs font-bold text-red-500 tracking-widest border-b border-red-900 pb-2 mb-4">ANOMALIAS DETECTADAS</h3>
      <div className="space-y-3">
        {entities.filter(e => e.tipo_icone === 'critical').map(e => (
          <div key={e.id} className="p-2 border-l-2 border-red-600 bg-red-900/10">
            <span className="text-[10px] text-red-500 font-bold">[{e.nome}]</span>
            <p className="text-[10px] font-mono text-gray-400 mt-1">{e.info}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}