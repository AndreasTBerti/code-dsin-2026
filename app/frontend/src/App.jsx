import React, { useState, useEffect } from 'react';
import { ShieldAlert, Zap, Cpu, Car, Eye } from 'lucide-react';

// Importação dos Componentes
import Header from './components/Header';
import MapArea from './components/MapArea';
import PanelOperacional from './components/PanelOperacional';
import PanelPreditivo from './components/PanelPreditivo';
import Inventario from './components/Inventario';
import AddModal from './components/AddModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('operacional');
  const [entities, setEntities] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntity, setNewEntity] = useState({ nome: '', tipo_icone: 'camera', lat: 50, lng: 50, info: '' });

  const fetchEntities = async () => {
    try {
      const res = await fetch('/api/equipamentos');
      const data = await res.json();
      setEntities(data);
    } catch (err) {
      console.error("Falha de conexão com Prometheus:", err);
    }
  };

  useEffect(() => {
    fetchEntities();
    const interval = setInterval(fetchEntities, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddEntity = async (e) => {
    e.preventDefault();
    await fetch('/api/equipamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntity)
    });
    setShowAddModal(false);
    setNewEntity({ nome: '', tipo_icone: 'camera', lat: 50, lng: 50, info: '' });
    fetchEntities();
  };

  const handleDeleteEntity = async (id) => {
    await fetch(`/api/equipamentos/${id}`, { method: 'DELETE' });
    fetchEntities();
  };

  // Funções Utilitárias passadas por Props
  const renderIconList = (tipo, className) => {
    switch(tipo) {
      case 'camera': return <Eye className={className} />;
      case 'radar': return <Zap className={className} />;
      case 'agent': return <Car className={className} />;
      case 'critical': return <ShieldAlert className={className} />;
      default: return <Cpu className={className} />;
    }
  };

  const getEntityColor = (tipo) => {
    switch(tipo) {
      case 'camera': return 'bg-purple-600 border-purple-400';
      case 'radar': return 'bg-yellow-600 border-yellow-400';
      case 'agent': return 'bg-blue-500 border-blue-300'; // Azul mais vibrante
      case 'critical': return 'bg-red-600 border-red-400 animate-pulse-critical';
      default: return 'bg-gray-600 border-gray-400';
    }
  };

  return (
    <div className={`h-screen w-full flex flex-col font-sans relative ${activeTab === 'preditivo' ? 'bg-[#0f0202]' : 'bg-corp-bg'} transition-colors duration-1000 overflow-hidden`}>
      <div className="scanlines"></div>

      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Renderiza Mapa e Painéis apenas nas abas táticas */}
        {(activeTab === 'operacional' || activeTab === 'preditivo') && (
          <>
            <MapArea 
              activeTab={activeTab} 
              entities={entities} 
              getEntityColor={getEntityColor} 
            />
            {activeTab === 'operacional' ? <PanelOperacional entities={entities} /> : <PanelPreditivo />}
          </>
        )}

        {/* Renderiza Inventário caso seja a aba selecionada */}
        {activeTab === 'inventario' && (
          <Inventario 
            entities={entities} 
            setShowAddModal={setShowAddModal} 
            handleDeleteEntity={handleDeleteEntity}
            renderIconList={renderIconList}
          />
        )}
      </main>

      {/* Modal Sobreposto */}
      {showAddModal && (
        <AddModal 
          setShowAddModal={setShowAddModal} 
          handleAddEntity={handleAddEntity} 
          newEntity={newEntity} 
          setNewEntity={setNewEntity} 
        />
      )}
    </div>
  );
}