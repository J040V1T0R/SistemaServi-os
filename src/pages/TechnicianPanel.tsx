import { useState } from "react";
import { Wrench, Play, CheckCircle, Clock, User, AlertTriangle } from "lucide-react";

// Tipo de dados (Interface TS)
interface Order {
  id: string;
  client: string;
  equipment: string;
  issue: string;
  status: "Pendente" | "Em Andamento" | "Concluído";
}

export function TechnicianPanel() {
  // Mock de dados (Simulando o Banco de Dados)
  const [orders, setOrders] = useState<Order[]>([
    { id: "1001", client: "Maria Silva", equipment: "Dell Inspiron 15", issue: "Não liga, luz pisca laranja", status: "Pendente" },
    { id: "1002", client: "Escritório Contábil", equipment: "Epson L3150", issue: "Atolamento de papel constante", status: "Em Andamento" },
    { id: "1003", client: "Pedro Santos", equipment: "PC Gamer", issue: "Tela azul ao abrir jogos", status: "Pendente" },
  ]);

  // Função visual para mudar status
  const handleStatusChange = (id: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
    // AQUI PESSOA 3: fará o fetch('api/update-status', ...)
  };

  return (
    <div className="p-8 ml-64 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Wrench className="text-primary" /> Painel do Técnico
          </h2>
          <p className="text-gray-500 mt-1">Gerencie suas ordens de serviço ativas.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            
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

            {/* Ações (Botões) */}
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

              {order.status === "Concluído" && (
                <p className="w-full text-center text-sm text-green-600 font-bold py-2 bg-green-50 rounded-lg">
                  Serviço Finalizado
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente auxiliar de Badge
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