import { useState } from "react";
import { Users, Briefcase, X, Check, CheckCircle, Clock, AlertCircle, Plus, ArrowRightCircle } from "lucide-react";

interface Technician {
  id: number;
  name: string;
  status: "Disponível" | "Ocupado";
  currentTask: string;
  avatar: string;
  completedToday: number;
  pending: number;
  tasks: string[];
}

export function TeamManagement() {
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  
  // Estados para controle interno do Modal
  const [modalTasks, setModalTasks] = useState<string[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");

  // Estados para a ação de MOVER
  const [movingTaskIndex, setMovingTaskIndex] = useState<number | null>(null); // Qual tarefa estou movendo?
  const [targetTechId, setTargetTechId] = useState<string>(""); // Para quem?

  const technicians: Technician[] = [
    { 
      id: 1, name: "João (Técnico)", status: "Ocupado", currentTask: "Formatando Dell G15", 
      avatar: "JD", completedToday: 3, pending: 2,
      tasks: ["Manutenção HP LaserJet", "Troca de SSD Dell"]
    },
    { 
      id: 2, name: "Ana (Técnica)", status: "Disponível", currentTask: "---", 
      avatar: "AL", completedToday: 5, pending: 0,
      tasks: []
    },
    { 
      id: 3, name: "Pedro Santos", status: "Ocupado", currentTask: "Trocando Tela iPhone 11", 
      avatar: "PS", completedToday: 1, pending: 4,
      tasks: ["Limpeza Interna PS5", "Troca de Teclado Lenovo", "Instalação Windows 11"]
    },
  ];

  const openModal = (tech: Technician) => {
    setSelectedTech(tech);
    setModalTasks(tech.tasks);
    setIsAddingTask(false);
    setMovingTaskIndex(null); // Reseta estado de mover
  };

  const handleAddTask = () => {
    if (newTaskText.trim() === "") return;
    setModalTasks([...modalTasks, newTaskText]);
    setNewTaskText("");
    setIsAddingTask(false);
  };

  // Função: Confirmar a transferência
  const confirmMoveTask = (indexToRemove: number) => {
    if (!targetTechId) {
        alert("Selecione um técnico para receber a tarefa!");
        return;
    }
    
    const taskName = modalTasks[indexToRemove];
    const targetTechName = technicians.find(t => t.id.toString() === targetTechId)?.name;

    // Remove da lista visual
    const newTasks = modalTasks.filter((_, index) => index !== indexToRemove);
    setModalTasks(newTasks);
    
    // Reseta estados
    setMovingTaskIndex(null);
    setTargetTechId("");

    alert(`Sucesso! "${taskName}" foi transferida para ${targetTechName}.`);
  };

  const handleSaveAll = () => {
    alert(`Alterações salvas para o técnico ${selectedTech?.name}!`);
    setSelectedTech(null);
  };

  return (
    <div className="p-8 ml-64 min-h-screen relative">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Users className="text-primary" /> Gestão de Equipe
        </h2>
        <p className="text-gray-500 mt-1">Visão detalhada da produtividade e alocação.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technicians.map((tech) => (
          <div key={tech.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
            
            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${tech.status === 'Disponível' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>

            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-600 border-2 border-white shadow-sm">
                    {tech.avatar}
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{tech.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${tech.status === 'Disponível' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {tech.status}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold mb-1 flex items-center gap-1 uppercase">
                        <Briefcase size={12}/> Fazendo Agora:
                    </p>
                    <p className="text-sm text-gray-800 font-medium truncate">
                        {tech.currentTask !== "---" ? tech.currentTask : <span className="text-gray-400 italic">Aguardando demanda...</span>}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50/50 border border-blue-100 p-2 rounded-lg text-center">
                        <p className="text-2xl font-bold text-gray-800">{tech.completedToday}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Feitas Hoje</p>
                    </div>
                    <div className="bg-orange-50/50 border border-orange-100 p-2 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-600">{tech.pending}</p>
                        <p className="text-[10px] text-orange-400 uppercase font-bold">Na Fila</p>
                    </div>
                </div>

                <button 
                    onClick={() => openModal(tech)}
                    className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-100 flex items-center justify-center gap-2"
                >
                    Ver Detalhes / Reatribuir
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL --- */}
      {selectedTech && (
        <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 transform transition-all scale-100">
                
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            Gerenciar Carga
                        </h3>
                        <p className="text-sm text-gray-500">Tarefas de {selectedTech.name}</p>
                    </div>
                    <button onClick={() => setSelectedTech(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                        {selectedTech.avatar}
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-gray-800">{selectedTech.name}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock size={14}/> {modalTasks.length} tarefas na fila dinâmica
                        </p>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fila de Tarefas:</p>
                        {!isAddingTask && (
                            <button 
                                onClick={() => setIsAddingTask(true)}
                                className="text-xs text-primary font-bold cursor-pointer hover:underline flex items-center gap-1"
                            >
                                <Plus size={14}/> Adicionar Manualmente
                            </button>
                        )}
                    </div>
                    
                    {isAddingTask && (
                        <div className="flex gap-2 mb-3 animate-fade-in">
                            <input 
                                type="text" 
                                autoFocus
                                className="flex-1 bg-gray-50 border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Digite a nova tarefa..."
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                            />
                            <button onClick={handleAddTask} className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">OK</button>
                            <button onClick={() => setIsAddingTask(false)} className="text-gray-400 hover:text-red-500"><X size={18}/></button>
                        </div>
                    )}

                    <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {modalTasks.length === 0 && !isAddingTask && (
                            <p className="text-sm text-gray-400 italic text-center py-4">Fila vazia.</p>
                        )}

                        {modalTasks.map((task, index) => (
                            <li key={index} className={`flex items-center justify-between text-sm p-3 border rounded-xl transition-all bg-white shadow-sm ${movingTaskIndex === index ? 'border-primary ring-1 ring-primary' : 'border-gray-100'}`}>
                                
                                {/* SE ESTIVER MOVENDO, MOSTRA O SELETOR */}
                                {movingTaskIndex === index ? (
                                    <div className="flex items-center gap-2 w-full animate-fade-in">
                                        <span className="text-gray-500 text-xs font-bold whitespace-nowrap">Para:</span>
                                        <select 
                                            className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-lg p-2 focus:outline-none"
                                            value={targetTechId}
                                            onChange={(e) => setTargetTechId(e.target.value)}
                                        >
                                            <option value="">Selecione...</option>
                                            {technicians
                                                .filter(t => t.id !== selectedTech.id) // Não mostrar o próprio técnico
                                                .map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                                            }
                                        </select>
                                        <button onClick={() => confirmMoveTask(index)} className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700">
                                            <Check size={14}/>
                                        </button>
                                        <button onClick={() => setMovingTaskIndex(null)} className="bg-gray-200 text-gray-600 p-2 rounded-lg hover:bg-gray-300">
                                            <X size={14}/>
                                        </button>
                                    </div>
                                ) : (
                                    // SE NÃO ESTIVER MOVENDO, MOSTRA A TAREFA NORMAL
                                    <>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                                <AlertCircle size={16}/>
                                            </div>
                                            <span className="text-gray-700 font-medium">{task}</span>
                                        </div>
                                        
                                        <button 
                                            onClick={() => setMovingTaskIndex(index)}
                                            className="text-gray-400 hover:text-primary hover:bg-blue-50 text-xs font-bold px-3 py-1 rounded-lg transition-all flex items-center gap-1"
                                        >
                                            Mover <ArrowRightCircle size={14}/>
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setSelectedTech(null)}
                        className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSaveAll}
                        className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-200"
                    >
                        <CheckCircle size={18}/> Salvar e Fechar
                    </button>
                </div>

            </div>
        </div>
      )}
    </div>
  );
}