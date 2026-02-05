import { AlertCircle, User, Cpu } from "lucide-react";

export function NewRequest() {
  return (
    <div className="p-8 ml-64 min-h-screen flex flex-col items-center justify-center">
      
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
           <PlusIcon /> Abertura de Chamado
        </h2>
        <p className="text-gray-500 mb-6">Preencha os dados abaixo para iniciar uma nova manutenção.</p>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* CPF */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 block flex items-center gap-1">
                <User size={14}/> CPF do Cliente
              </label>
              <input 
                type="text" 
                placeholder="000.000.000-00" 
                className="w-full bg-gray-800 text-white rounded-lg p-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Série */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 block flex items-center gap-1">
                <Cpu size={14}/> Nº de Série
              </label>
              <input 
                type="text" 
                placeholder="SN-12345678" 
                className="w-full bg-gray-800 text-white rounded-lg p-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Tipo Equipamento */}
          <div className="mb-6">
             <label className="text-xs font-bold text-gray-500 mb-2 block">Tipo de Equipamento</label>
             <select className="w-full bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                <option>Selecione o tipo...</option>
                <option>Notebook</option>
                <option>Desktop</option>
                <option>Impressora</option>
             </select>
          </div>

          {/* Problema */}
          <div className="mb-8">
            <label className="text-xs font-bold text-gray-500 mb-2 block flex items-center gap-1">
              <AlertCircle size={14}/> Problema Relatado
            </label>
            <textarea 
              rows={4}
              placeholder="Descreva detalhadamente o problema que o cliente relatou..."
              className="w-full bg-gray-800 text-white rounded-lg p-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>

          <button className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200">
            Gerar Ordem de Serviço
          </button>

        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
    )
}