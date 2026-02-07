import { useState } from "react";
import { Users, Briefcase, X, ArrowRight, AlertCircle } from "lucide-react";

// Tipo para o Técnico
interface Technician {
  id: number;
  name: string;
  status: string;
  currentTask: string;
  avatar: string;
  completedToday: number;
  pending: number;
}

export function TeamManagement() {
  // Estado para controlar qual técnico está sendo "editado" no modal
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);

  const technicians: Technician[] = [
    { 
      id: 1, name: "João (Técnico)", status: "Ocupado", currentTask: "Formatando Dell G15", 
      avatar: "JD", completedToday: 3, pending: 2 
    },
    { 
      id: 2, name: "Ana (Técnica)", status: "Disponível", currentTask: "---", 
      avatar: "AL", completedToday: 5, pending: 0 
    },
    { 
      id: 3, name: "Pedro Santos", status: "Ocupado", currentTask: "Trocando Tela iPhone 11", 
      avatar: "PS", completedToday: 1, pending: 4 
    },
  ];

  const handleReassign = () => {
    alert(`Tarefas de ${selectedTech?.name} reatribuídas com sucesso!`);
    setSelectedTech(null); // Fecha o modal
  };

  return (
    <div className="p-8 ml-64 min-h-screen relative">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Users className="text-primary" /> Gestão de Equipe
        </h2>
        <p className="text-gray-500 mt-1">Visão geral da produtividade e alocação dos técnicos.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technicians.map((tech) => (
          <div key={tech.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
            
            {/* Status Indicator */}
            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${tech.status === 'Disponível' ? 'bg-green-500' : 'bg-red-500'}`}></div>

            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
                    {tech.avatar}
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{tech.name}</h3>
                    <p className={`text-xs font-bold ${tech.status === 'Disponível' ? 'text-green-600' : 'text-red-500'}`}>
                        {tech.status.toUpperCase()}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500 font-bold mb-1 flex items-center gap-1">
                        <Briefcase size={12}/> TAREFA ATUAL
                    </p>
                    <p className="text-sm text-gray-800 font-medium truncate">{tech.currentTask}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-100 p-2 rounded-lg text-center">
                        <p className="text-2xl font-bold text-gray-800">{tech.completedToday}</p>
                        <p className="text-[10px] text-gray-400 uppercase">Feitas Hoje</p>
                    </div>
                    <div className="border border-gray-100 p-2 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-500">{tech.pending}</p>
                        <p className="text-[10px] text-gray-400 uppercase">Fila</p>
                    </div>
                </div>

                {/* BOTÃO AGORA FUNCIONA: Abre o Modal */}
                <button 
                    onClick={() => setSelectedTech(tech)}
                    className="w-full py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Ver Detalhes / Reatribuir
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL (JANELA FLUTUANTE) --- */}
      {selectedTech && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fade-in">
                
                {/* Cabeçalho do Modal */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        Gerenciar Técnico
                    </h3>
                    <button onClick={() => setSelectedTech(null)} className="text-gray-400 hover:text-red-500">
                        <X size={24} />
                    </button>
                </div>

                {/* Info do Técnico */}
                <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                        {selectedTech.avatar}
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">{selectedTech.name}</p>
                        <p className="text-sm text-gray-500">{selectedTech.pending} tarefas na fila</p>
                    </div>
                </div>

                {/* Lista de Tarefas Simulada */}
                <div className="mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Próximas Tarefas na Fila:</p>
                    <ul className="space-y-2">
                        <li className="flex items-center justify-between text-sm p-2 border border-gray-100 rounded-lg">
                            <span>Manutenção HP LaserJet</span>
                            <button className="text-primary hover:underline text-xs font-bold">Mover</button>
                        </li>
                        <li className="flex items-center justify-between text-sm p-2 border border-gray-100 rounded-lg">
                            <span>Troca de SSD Dell</span>
                            <button className="text-primary hover:underline text-xs font-bold">Mover</button>
                        </li>
                    </ul>
                </div>

                {/* Ações */}
                <div className="flex gap-3">
                    <button 
                        onClick={() => setSelectedTech(null)}
                        className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleReassign}
                        className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                        <ArrowRight size={18}/> Reatribuir Carga
                    </button>
                </div>

            </div>
        </div>
      )}
    </div>
  );
}