import React from 'react';
import { X } from 'lucide-react';

export default function AddModal({ setShowAddModal, handleAddEntity, newEntity, setNewEntity }) {
  return (
    <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4">
      <div className="bg-corp-panel border border-corp-border p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-2">
          <h2 className="text-sm font-bold tracking-widest text-white">NOVA ENTIDADE DE CAMPO</h2>
          <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
        </div>
        
        <form onSubmit={handleAddEntity} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-500 block mb-1">IDENTIFICAÇÃO (NOME)</label>
            <input required maxLength={30} type="text" className="w-full bg-black border border-gray-700 text-xs font-mono p-2 text-white outline-none focus:border-blue-500" placeholder="Máx 30 caracteres" value={newEntity.nome} onChange={e => setNewEntity({...newEntity, nome: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 block mb-1">CLASSE TÁTICA</label>
              <select className="w-full bg-black border border-gray-700 text-xs font-mono p-2 text-white outline-none focus:border-blue-500" value={newEntity.tipo_icone} onChange={e => setNewEntity({...newEntity, tipo_icone: e.target.value})}>
                <option value="camera">CÂMERA</option>
                <option value="radar">RADAR</option>
                <option value="agent">AGENTE/VIATURA</option>
                <option value="critical">ALERTA CRÍTICO</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 block mb-1">EIXOS Y / X (0 a 100%)</label>
              <div className="flex gap-2">
                <input required type="number" step="0.1" min="0" max="100" className="w-full bg-black border border-gray-700 text-xs font-mono p-2 text-white text-center focus:border-blue-500" value={newEntity.lat} onChange={e => setNewEntity({...newEntity, lat: parseFloat(e.target.value)})} />
                <input required type="number" step="0.1" min="0" max="100" className="w-full bg-black border border-gray-700 text-xs font-mono p-2 text-white text-center focus:border-blue-500" value={newEntity.lng} onChange={e => setNewEntity({...newEntity, lng: parseFloat(e.target.value)})} />
              </div>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 block mb-1">STATUS ATUAL</label>
            <input required maxLength={40} type="text" className="w-full bg-black border border-gray-700 text-xs font-mono p-2 text-white outline-none focus:border-blue-500" placeholder="Ex: Operacional" value={newEntity.info} onChange={e => setNewEntity({...newEntity, info: e.target.value})} />
          </div>
          <button type="submit" className="w-full mt-4 bg-gray-800 hover:bg-gray-700 border border-gray-500 py-3 text-xs font-bold text-white tracking-widest transition-colors">CADASTRAR NO BANCO</button>
        </form>
      </div>
    </div>
  );
}