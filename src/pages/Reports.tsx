import { History, Search, Download, FileText, DollarSign } from "lucide-react";

export function Reports() {
  return (
    <div className="p-8 ml-64 min-h-screen">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <History className="text-primary" /> Histórico & Relatórios
          </h2>
          <p className="text-gray-500 mt-1">Consulte ordens finalizadas e gere relatórios.</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm">
            <Download size={16}/> Exportar Excel
        </button>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <FileText size={24}/>
            </div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Total Ordens</p>
                <p className="text-2xl font-bold text-gray-800">142</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <DollarSign size={24}/>
            </div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Faturamento Mês</p>
                <p className="text-2xl font-bold text-gray-800">R$ 12.450</p>
            </div>
         </div>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Barra de Busca */}
        <div className="p-4 border-b border-gray-100 flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar por cliente, CPF ou nº de série..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none">
                <option>Todos os Meses</option>
                <option>Janeiro</option>
                <option>Fevereiro</option>
            </select>
        </div>

        {/* Tabela */}
        <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Equipamento</th>
                    <th className="px-6 py-4">Data Final</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
                {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-600">#20{item}2</td>
                        <td className="px-6 py-4 text-gray-800">João da Silva</td>
                        <td className="px-6 py-4 text-gray-600">Notebook Dell G15</td>
                        <td className="px-6 py-4 text-gray-500">12/02/2026</td>
                        <td className="px-6 py-4 font-bold text-gray-800">R$ 350,00</td>
                        <td className="px-6 py-4">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                                Concluído
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
