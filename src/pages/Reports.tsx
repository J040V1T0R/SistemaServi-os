import { History, Search, FileText, DollarSign, Clock, CheckCircle, PlayCircle } from "lucide-react";

export function Reports() {
  // Lista Completa de Dados (Simulando o Banco)
  // Isso atende seu pedido de mostrar Pendentes, Em andamento e Concluídos
  const allOrders = [
    { id: "1001", client: "Maria Silva", equip: "Dell Inspiron 15", date: "16/02/2026", value: "-", status: "Pendente" },
    { id: "1002", client: "João Souza", equip: "Epson L3150", date: "15/02/2026", value: "-", status: "Em Andamento" },
    { id: "1003", client: "Pedro Santos", equip: "PC Gamer Ryzen", date: "14/02/2026", value: "R$ 450,00", status: "Concluído" },
    { id: "1004", client: "Padaria Central", equip: "Monitor LG Ultrawide", date: "12/02/2026", value: "R$ 180,00", status: "Concluído" },
    { id: "1005", client: "Advocacia Lima", equip: "Macbook Air M1", date: "16/02/2026", value: "-", status: "Pendente" },
  ];

  return (
    <div className="p-8 ml-64 min-h-screen">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <History className="text-primary" /> Relatório Geral
          </h2>
          <p className="text-gray-500 mt-1">Visão unificada de todas as ordens de serviço do sistema.</p>
        </div>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center">
                <FileText size={24}/>
            </div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Total Registros</p>
                <p className="text-2xl font-bold text-gray-800">{allOrders.length}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <DollarSign size={24}/>
            </div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Faturamento (Concluídos)</p>
                <p className="text-2xl font-bold text-gray-800">R$ 630,00</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
                <Clock size={24}/>
            </div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Pendentes na Fila</p>
                <p className="text-2xl font-bold text-gray-800">
                    {allOrders.filter(o => o.status === 'Pendente').length}
                </p>
            </div>
         </div>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Barra de Busca */}
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Filtrar por nome, equipamento ou ID..." 
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none cursor-pointer hover:border-primary">
                <option>Todos os Status</option>
                <option>Pendentes</option>
                <option>Em Andamento</option>
                <option>Concluídos</option>
            </select>
        </div>

        {/* Tabela */}
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                    <th className="px-6 py-4">ID OS</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Equipamento</th>
                    <th className="px-6 py-4">Data Entrada</th>
                    <th className="px-6 py-4">Valor Final</th>
                    <th className="px-6 py-4">Situação Atual</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
                {allOrders.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4 font-bold text-gray-600 group-hover:text-primary">#{item.id}</td>
                        <td className="px-6 py-4 text-gray-800 font-medium">{item.client}</td>
                        <td className="px-6 py-4 text-gray-600">{item.equip}</td>
                        <td className="px-6 py-4 text-gray-500">{item.date}</td>
                        <td className="px-6 py-4 font-bold text-gray-800">{item.value}</td>
                        <td className="px-6 py-4">
                            <BadgeStatus status={item.status} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente de Badge para a Tabela
function BadgeStatus({ status }: { status: string }) {
    let style = "";
    let icon = null;

    if (status === "Pendente") {
        style = "bg-yellow-100 text-yellow-800 border border-yellow-200";
        icon = <Clock size={12} />;
    } else if (status === "Em Andamento") {
        style = "bg-blue-100 text-blue-800 border border-blue-200";
        icon = <PlayCircle size={12} />;
    } else {
        style = "bg-green-100 text-green-800 border border-green-200";
        icon = <CheckCircle size={12} />;
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${style}`}>
            {icon} {status}
        </span>
    );
}