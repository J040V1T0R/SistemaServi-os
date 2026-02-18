import { useState } from "react";
import { Wrench, Play, CheckCircle, Clock, User, AlertTriangle, DollarSign } from "lucide-react"; // Adicionei DollarSign
import { useAuth } from "../contexts/AuthContext";

interface Order {
  id: string;
  client: string;
  equipment: string;
  issue: string;
  status: "Pendente" | "Em Andamento" | "Concluído";
  techId: string;
}

export function TechnicianPanel() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([
    { id: "1001", client: "Maria Silva", equipment: "Dell Inspiron 15", issue: "Não liga, luz pisca laranja", status: "Pendente", techId: "2" },
    { id: "1002", client: "Escritório Contábil", equipment: "Epson L3150", issue: "Atolamento de papel constante", status: "Em Andamento", techId: "2" },
    { id: "1003", client: "Pedro Santos", equipment: "PC Gamer", issue: "Tela azul ao abrir jogos", status: "Pendente", techId: "3" },
    { id: "1004", client: "Padaria Central", equipment: "Monitor LG", issue: "Sem sinal", status: "Concluído", techId: "3" },
  ]);

  const filteredOrders = user.role === "MANAGER" 
    ? orders 
    : orders.filter(order => order.techId === user.id);

  const handleStatusChange = (id: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  return (
    <div className="p-8 ml-64 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Wrench className="text-primary" /> 
            {user.role === "MANAGER" ? "Visão Geral (Todos os Técnicos)" : "Minhas Tarefas"}
          </h2>
          <p className="text-gray-500 mt-1">
            {user.role === "MANAGER" 
              ? "Gerencie as ordens de toda a equipe." 
              : `Olá, ${user.name}. Gerencie suas ordens de serviço ativas.`}
          </p>
        </div>
      </header>

      {filteredOrders.length === 0 ? (
         <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
             <p className="text-gray-400 font-medium">Nenhuma tarefa encontrada.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative group">
              
              {user.role === "MANAGER" && (
                 <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-gray-100 px-2 py-1 rounded text-gray-500">
                    Técnico ID: {order.techId}
                 </span>
              )}

              {/* Header do Card */}
              <div className="flex justify-between items-start mb-4">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                  #{order.id}
                </span>
                <BadgeStatus status={order.status} />
              </div>

              {/* Título e Cliente */}
              <h3 className="text-lg font-bold text-gray-800 mb-1">{order.equipment}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 font-medium">
                <User size={14} /> {order.client}
              </div>

              {/* Problema */}
              <div className="bg-orange-50 p-4 rounded-xl mb-6 border border-orange-100">
                <p className="text-xs font-bold text-orange-600 mb-1 flex items-center gap-1">
                  <AlertTriangle size={12}/> PROBLEMA RELATADO
                </p>
                <p className="text-sm text-gray-700 italic">"{order.issue}"</p>
              </div>

              {/* Ações */}
              {order.status !== "Concluído" && (
                <div className="border-t border-gray-100 pt-4 flex gap-3">
                  
                  {/* BOTÃO 1: INICIAR (PADRÃO AZUL) */}
                  {order.status === "Pendente" && (
                    <button 
                      onClick={() => handleStatusChange(order.id, "Em Andamento")}
                      className="w-full bg-primary text-white hover:bg-blue-700 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Play size={16} fill="currentColor" /> Iniciar Serviço
                    </button>
                  )}

                  {/* FORMULÁRIO DE FINALIZAÇÃO */}
                  {order.status === "Em Andamento" && (
                    <div className="w-full space-y-3 animate-fade-in">
                      <textarea 
                        placeholder="Descreva a solução técnica realizada..." 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                        rows={2}
                      />
                      <div className="flex gap-3">
                        <div className="relative w-1/3">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 text-sm">R$</span>
                            </div>
                            <input 
                              type="text" 
                              placeholder="0,00" 
                              className="w-full pl-8 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                            />
                        </div>
                        
                        {/* BOTÃO 2: FINALIZAR (PADRÃO VERDE) */}
                        <button 
                          onClick={() => handleStatusChange(order.id, "Concluído")}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                          <CheckCircle size={16} /> Finalizar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Status Finalizado */}
              {order.status === "Concluído" && (
                <div className="border-t border-gray-100 pt-4">
                    <p className="w-full text-center text-sm text-green-700 font-bold py-2 bg-green-50 rounded-xl border border-green-100 flex items-center justify-center gap-2">
                        <CheckCircle size={16}/> Serviço Finalizado
                    </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BadgeStatus({ status }: { status: string }) {
  const styles = {
    "Pendente": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Em Andamento": "bg-blue-100 text-blue-800 border-blue-200",
    "Concluído": "bg-green-100 text-green-800 border-green-200",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wide font-bold flex items-center gap-1 border ${styles[status as keyof typeof styles]}`}>
      <Clock size={12} /> {status}
    </span>
  );
}