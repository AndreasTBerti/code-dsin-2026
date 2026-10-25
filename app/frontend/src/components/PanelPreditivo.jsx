import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PanelPreditivo() {
  return (
    <aside className="w-full md:w-96 bg-[#0f0202] border-l-2 border-red-900 p-4 flex flex-col overflow-y-auto h-full custom-scrollbar z-30">
      <h3 className="text-xs font-bold text-red-500 tracking-widest border-b border-red-900 pb-2 mb-4">PROJEÇÃO DE COLAPSO</h3>
      <p className="text-[11px] font-mono text-gray-400 mb-4">A rede neural detecta 92% de chance de interrupção viária massiva no quadrante central nas próximas 2 horas.</p>
      
      <div className="bg-black border border-red-900/40 p-2 mb-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[{ time: '14h', risk: 20 }, { time: '15h', risk: 35 }, { time: '16h', risk: 65 }, { time: '17h', risk: 92 }, { time: '18h', risk: 70 }]}>
            <XAxis dataKey="time" stroke="#555" fontSize={10} />
            <YAxis stroke="#555" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#8b0000', fontSize: '10px' }} />
            <Line type="monotone" dataKey="risk" stroke="#ff1a1a" strokeWidth={2} dot={{ r: 3, fill: '#ff1a1a' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-auto border border-red-900 p-3 bg-black">
        <h4 className="text-[10px] font-bold text-red-500 mb-2">DIRETRIZ DE CONTENÇÃO</h4>
        <p className="text-[10px] font-mono text-gray-400 mb-3">{">"} Realocar todas as viaturas disponíveis para o quadrante Alpha.<br/>{">"} Ativar protocolo de evasão semafórica.</p>
        <button className="w-full py-2 bg-red-900/30 border border-red-700 text-white text-[10px] font-bold tracking-widest hover:bg-red-800 transition-colors">AUTORIZAR PROMETHEUS</button>
      </div>
    </aside>
  );
}