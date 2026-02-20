import React from "react";
import { AlertCircle, User, Cpu, Briefcase, Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function NewRequest() {
  const { usersList } = useAuth();
  const [form, setForm] = React.useState({
    clientCpf: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serialNumber: '',
    equipType: '',
    brand: '',
    model: '',
    technicianId: '',
    problemDescription: '',
  });
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setSubmitting(true);
    try {
      const { createOrder } = await import('../api');
      const result = await createOrder(form);
      setStatusMsg('Ordem criada com sucesso! ID: ' + result.id);
      setForm({
        clientCpf: '',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        serialNumber: '',
        equipType: '',
        brand: '',
        model: '',
        technicianId: '',
        problemDescription: '',
      });
    } catch (err: any) {
      setStatusMsg('Erro: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          {statusMsg && (
            <div className="mb-4 text-center text-sm font-bold text-green-600">
              {statusMsg}
            </div>
          )}
          <p className="text-xs text-gray-500 mb-6">
            Informe o CPF para usar um cliente existente. Para cadastrar novo cliente, preencha nome, telefone e email.
          </p>
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* CPF */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider">
                <User size={14}/> CPF do Cliente
              </label>
              <input 
                name="clientCpf"
                value={form.clientCpf}
                onChange={handleChange}
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
                name="serialNumber"
                value={form.serialNumber}
                onChange={handleChange}
                type="text" 
                placeholder="SN-12345678" 
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
            </div>

            {/* Nome */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider">
                <User size={14}/> Nome do Cliente
              </label>
              <input
                name="clientName"
                value={form.clientName}
                onChange={handleChange}
                type="text"
                placeholder="Nome completo"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Telefone */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider">
                <User size={14}/> Telefone
              </label>
              <input
                name="clientPhone"
                value={form.clientPhone}
                onChange={handleChange}
                type="text"
                placeholder="(00) 00000-0000"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider">
                <User size={14}/> Email
              </label>
              <input
                name="clientEmail"
                value={form.clientEmail}
                onChange={handleChange}
                type="email"
                placeholder="email@exemplo.com"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Tipo Equipamento */}
            <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Tipo de Equipamento</label>
                <select
                  name="equipType"
                  value={form.equipType}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all appearance-none"
                >
                    <option value="">Selecione o tipo...</option>
                    <option>Notebook</option>
                    <option>Desktop</option>
                    <option>Impressora</option>
                </select>
            </div>

            {/* Marca */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider">
                <Cpu size={14}/> Marca
              </label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                type="text"
                placeholder="Marca do equipamento"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Atribuir Técnico */}
            <div>
                <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider">
                    <Briefcase size={14}/> Técnico Responsável
                </label>
                <select
                  name="technicianId"
                  value={form.technicianId}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all appearance-none"
                >
                    <option value="">Selecione um técnico...</option>
                    {usersList
                        .filter(u => u.role === 'TECH')
                        .map(tech => (
                            <option key={tech.id} value={tech.id}>{tech.name}</option>
                        ))
                    }
                </select>
            </div>

            {/* Modelo */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider">
                <Cpu size={14}/> Modelo
              </label>
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                type="text"
                placeholder="Modelo do equipamento"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Problema */}
          <div className="mb-8">
            <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider">
              <AlertCircle size={14}/> Problema Relatado
            </label>
            <textarea 
              name="problemDescription"
              value={form.problemDescription}
              onChange={handleChange}
              rows={4}
              placeholder="Descreva detalhadamente o problema..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
            ></textarea>
          </div>

          {/* BOTÃO PADRONIZADO (PRIMARY) */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            <Plus size={20} strokeWidth={3} /> {submitting ? 'Enviando...' : 'Gerar Ordem de Serviço'}
          </button>
        </form>
      </div>
    </div>
  );
}