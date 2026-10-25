import React from 'react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className={`flex-none p-4 border-b z-40 flex flex-col md:flex-row md:items-center justify-between transition-colors duration-500 ${activeTab === 'preditivo' ? 'border-red-900 bg-[#1a0505]' : 'border-corp-border bg-corp-panel'}`}>
      <div className="mb-4 md:mb-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.3em] text-white">TERMINAL F.O.G.O.</h1>
        <p className="text-xs font-mono text-gray-500 mt-1">
          SESSÃO: ADMIN_77 | STATUS: {activeTab === 'preditivo' ? <span className="text-red-500 font-bold">ANOMALIA PREDITA</span> : <span className="text-green-500">OPERAÇÃO NORMAL</span>}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 md:gap-4">
        <button onClick={() => setActiveTab('operacional')} className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold border-2 transition-all shadow-lg ${activeTab === 'operacional' ? 'bg-gray-800 border-gray-500 text-white' : 'bg-black border-gray-800 text-gray-500'}`}>MAPA TÁTICO</button>
        <button onClick={() => setActiveTab('inventario')} className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold border-2 transition-all shadow-lg ${activeTab === 'inventario' ? 'bg-blue-900 border-blue-500 text-white' : 'bg-black border-gray-800 text-gray-500'}`}>INVENTÁRIO</button>
        <button onClick={() => setActiveTab('preditivo')} className={`w-full md:w-auto px-4 py-2 text-xs font-bold border-2 transition-all shadow-lg ${activeTab === 'preditivo' ? 'bg-red-900 border-red-500 text-white' : 'bg-black border-red-900 text-red-700 hover:bg-red-900/30'}`}>VISÃO PROMETHEUS</button>
      </div>
    </header>
  );
}