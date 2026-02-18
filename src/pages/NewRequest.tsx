import { AlertCircle, User, Cpu, Briefcase, Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function NewRequest() {
  const { usersList } = useAuth();

  return (
    <div className="p-8 ml-64 min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
      
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
           <div className="bg-primary/10 p-2 rounded-lg text-primary">
             <Plus size={24} />
           </div>
           Abertura de Chamado
        </h2>
        <p className="text-gray-500 mb-8 ml-12">Preencha os dados abaixo para iniciar uma nova manutenção.</p>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* CPF */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider">
                <User size={14}/> CPF do Cliente
              </label>
              <input 
                type="text" 
                placeholder="000.000.000-00" 
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
            </div>

            {/* Série */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider">
                <Cpu size={14}/> Nº de Série
              </label>
              <input 
                type="text" 
                placeholder="SN-12345678" 
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Tipo Equipamento */}
            <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Tipo de Equipamento</label>
                <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all appearance-none">
                    <option>Selecione o tipo...</option>
                    <option>Notebook</option>
                    <option>Desktop</option>
                    <option>Impressora</option>
                </select>
            </div>

            {/* Atribuir Técnico */}
            <div>
                <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider">
                    <Briefcase size={14}/> Técnico Responsável
                </label>
                <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all appearance-none">
                    <option value="">Selecione um técnico...</option>
                    {usersList
                        .filter(u => u.role === 'TECH')
                        .map(tech => (
                            <option key={tech.id} value={tech.id}>{tech.name}</option>
                        ))
                    }
                </select>
            </div>
          </div>

          {/* Problema */}
          <div className="mb-8">
            <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider">
              <AlertCircle size={14}/> Problema Relatado
            </label>
            <textarea 
              rows={4}
              placeholder="Descreva detalhadamente o problema..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
            ></textarea>
          </div>

          {/* BOTÃO PADRONIZADO (PRIMARY) */}
          <button className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
            <Plus size={20} strokeWidth={3} /> Gerar Ordem de Serviço
          </button>

        </div>
      </div>
    </div>
  );
}