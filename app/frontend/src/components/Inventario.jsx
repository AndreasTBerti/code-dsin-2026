import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function Inventario({ entities, setShowAddModal, handleDeleteEntity, renderIconList }) {
  return (
    <section className="flex-1 bg-corp-panel flex flex-col z-30 h-full overflow-hidden">
      <div className="flex-none p-4 md:p-8 pb-4 border-b border-corp-border bg-corp-panel z-10 shadow-md flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-widest">INVENTÁRIO DA CIDADE</h2>
          <p className="text-xs font-mono text-gray-500">Total listado: {entities.length} entidades.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-500 px-4 py-2 text-xs font-bold text-white transition-colors">
          <Plus size={14} /> ADICIONAR
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {entities.map(ent => (
            <div key={ent.id} className="bg-black border border-corp-border p-4 flex flex-col hover:border-gray-500 transition-colors">
              <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                  {renderIconList(ent.tipo_icone, "w-4 h-4 text-gray-400")}
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{ent.tipo_icone}</span>
                </div>
                <button onClick={() => handleDeleteEntity(ent.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
              <h3 className="text-xs font-bold text-blue-400 mb-1 truncate">{ent.nome}</h3>
              <p className="text-[10px] font-mono text-gray-400 mb-3 flex-1 truncate">{ent.info}</p>
              <div className="bg-gray-900 p-2 text-[10px] font-mono text-gray-500 flex justify-between">
                <span>EIXO Y: {ent.lat.toFixed(2)}%</span>
                <span>EIXO X: {ent.lng.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}