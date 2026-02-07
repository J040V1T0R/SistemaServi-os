import { useState } from "react";
import { Wrench, Play, CheckCircle, Clock, User, AlertTriangle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext"; // <--- 1. Importamos o contexto

// Tipo de dados (Interface TS)
interface Order {
  id: string;
  client: string;
  equipment: string;
  issue: string;
  status: "Pendente" | "Em Andamento" | "Concluído";
  techId: string; // <--- 2. Adicionado campo para saber de quem é a tarefa
}

export function TechnicianPanel() {
  const { user } = useAuth(); // <--- 3. Pegamos o usuário logado

  // Mock de dados atualizado com donos das tarefas
  // ID "2" = João, ID "3" = Ana (conforme definimos no AuthContext)
  const [orders, setOrders] = useState<Order[]>([
    { id: "1001", client: "Maria Silva", equipment: "Dell Inspiron 15", issue: "Não liga, luz pisca laranja", status: "Pendente", techId: "2" },
    { id: "1002", client: "Escritório Contábil", equipment: "Epson L3150", issue: "Atolamento de papel constante", status: "Em Andamento", techId: "2" },
    { id: "1003", client: "Pedro Santos", equipment: "PC Gamer", issue: "Tela azul ao abrir jogos", status: "Pendente", techId: "3" },
    { id: "1004", client: "Padaria Central", equipment: "Monitor LG", issue: "Sem sinal", status: "Concluído", techId: "3" },
  ]);

  // 4. Lógica de Filtragem:
  // Se for MANAGER, vê tudo. Se for TECH, só vê as suas (onde techId bate com user.id)
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
            {/* Título dinâmico baseado no cargo */}
            {user.role === "MANAGER" ? "Visão Geral (Todos os Técnicos)" : "Minhas Tarefas"}
          </h2>
          <p className="text-gray-500 mt-1">
            {user.role === "MANAGER" 
              ? "Gerencie as ordens de toda a equipe." 
              : `Olá, ${user.name}. Você tem ${filteredOrders.filter(o => o.status !== 'Concluído').length} ordens ativas.`}
          </p>
        </div>
      </header>

      {filteredOrders.length === 0 ? (
         <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
             <p className="text-gray-400">Nenhuma tarefa encontrada para este perfil.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative">
              
              {/* Se for Gerente, mostramos uma etiqueta dizendo de quem é a tarefa */}
              {user.role === "MANAGER" && (
                 <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-gray-100 px-2 py-1 rounded text-gray-500">
                    Técnico ID: {order.techId}
                 </span>
              )}

              {/* Cabeçalho do Card */}
              <div className="flex justify-between items-start mb-4">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                  #{order.id}
                </span>
                <BadgeStatus status={order.status} />
              </div>

              {/* Informações Principais */}
              <h3 className="text-lg font-bold text-gray-800 mb-1">{order.equipment}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <User size={14} /> {order.client}
              </div>

              {/* Box do Problema */}
              <div className="bg-orange-50 p-4 rounded-xl mb-6 border border-orange-100">
                <p className="text-xs font-bold text-orange-600 mb-1 flex items-center gap-1">
                  <AlertTriangle size={12}/> PROBLEMA RELATADO
                </p>
                <p className="text-sm text-gray-700 italic">"{order.issue}"</p>
              </div>

              {/* Ações (Botões) - Só aparecem se não estiver concluído */}
              {order.status !== "Concluído" && (
                <div className="border-t border-gray-100 pt-4 flex gap-3">
                  {order.status === "Pendente" && (
                    <button 
                      onClick={() => handleStatusChange(order.id, "Em Andamento")}
                      className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Play size={16} /> Iniciar Serviço
                    </button>
                  )}

                  {order.status === "Em Andamento" && (
                    <div className="w-full space-y-3">
                      <textarea 
                        placeholder="Descreva a solução técnica..." 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={2}
                      />
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          placeholder="Valor (R$)" 
                          className="w-1/3 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button 
                          onClick={() => handleStatusChange(order.id, "Concluído")}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                          <CheckCircle size={16} /> Finalizar e Faturar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mensagem se já estiver concluído */}
              {order.status === "Concluído" && (
                <div className="border-t border-gray-100 pt-4">
                    <p className="w-full text-center text-sm text-green-600 font-bold py-2 bg-green-50 rounded-lg">
                    Serviço Finalizado
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

// Componente auxiliar de Badge (Permanece igual)
function BadgeStatus({ status }: { status: string }) {
  const styles = {
    "Pendente": "bg-yellow-100 text-yellow-700",
    "Em Andamento": "bg-blue-100 text-blue-700",
    "Concluído": "bg-green-100 text-green-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${styles[status as keyof typeof styles]}`}>
      <Clock size={12} /> {status}
    </span>
  );
}