import React from "react";
import { Users, Plus, Trash2, AlertCircle, CheckCircle, Phone } from "lucide-react";

interface Technician {
  id: string;
  name: string;
  phone: string;
  specialty: string;
}

export function TechniciansManagement() {
  const [technicians, setTechnicians] = React.useState<Technician[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({
    pis: '',
    name: '',
    phone: '',
    specialty: '',
  });

  React.useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = () => {
    setLoading(true);
    setError(null);
    import('../api').then(({ getTechnicians }) => {
      getTechnicians()
        .then((data) => {
          setTechnicians(data || []);
          setError(null);
        })
        .catch((err: any) => {
          setError(err.message || 'Erro ao carregar técnicos');
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 Form state no submit:', JSON.stringify(form));
    if (!form.pis || !form.name || !form.phone || !form.specialty) {
      setStatusMsg('Preencha todos os campos');
      return;
    }
    // Forçar PIS como string e validar
    const pisString = String(form.pis).trim();
    console.log('✏️ PIS após String():', { pisString, length: pisString.length, type: typeof pisString });
    if (pisString.length !== 11 || !/^\d+$/.test(pisString)) {
      setStatusMsg('PIS deve conter exatamente 11 dígitos');
      return;
    }
    setStatusMsg(null);
    try {
      const { addTechnician } = await import('../api');
      const dataToSend = { 
        pis: pisString,
        name: String(form.name).trim(),
        phone: String(form.phone).trim(),
        specialty: String(form.specialty).trim()
      };
      console.log('📤 Enviando formulário:', dataToSend);
      await addTechnician(dataToSend);
      console.log('✅ Técnico adicionado com sucesso');
      setStatusMsg('Técnico adicionado com sucesso!');
      setForm({ pis: '', name: '', phone: '', specialty: '' });
      setIsAddingNew(false);
      loadTechnicians();
    } catch (err: any) {
      setStatusMsg('Erro: ' + err.message);
    }
  };

  const handleDeleteTechnician = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover este técnico?')) return;
    try {
      const { deleteTechnician } = await import('../api');
      await deleteTechnician(id);
      setStatusMsg('Técnico removido com sucesso!');
      loadTechnicians();
    } catch (err: any) {
      setStatusMsg('Erro: ' + err.message);
    }
  };

  return (
    <div className="p-8 ml-64 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Users className="text-primary" /> Gerenciamento de Técnicos
          </h2>
          <p className="text-gray-500 mt-1">Adicione, visualize e remova técnicos da equipe.</p>
        </div>
        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus size={20} /> Adicionar Técnico
        </button>
      </header>

      {statusMsg && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${statusMsg.includes('Erro') ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
          {statusMsg.includes('Erro') ? (
            <AlertCircle className="text-red-500" size={20} />
          ) : (
            <CheckCircle className="text-green-500" size={20} />
          )}
          <p className={statusMsg.includes('Erro') ? 'text-red-700' : 'text-green-700'}>{statusMsg}</p>
        </div>
      )}

      {isAddingNew && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Novo Técnico</h3>
          <form onSubmit={handleAddTechnician} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                name="pis"
                value={form.pis}
                onChange={handleChange}
                type="text"
                placeholder="PIS (11 dígitos)"
                maxLength={11}
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                placeholder="Nome completo"
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="text"
                placeholder="Telefone (00) 00000-0000"
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
              <input
                name="specialty"
                value={form.specialty}
                onChange={handleChange}
                type="text"
                placeholder="Especialidade (ex: Notebook)"
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Salvar Técnico
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setForm({ pis: '', name: '', phone: '', specialty: '' });
                  setStatusMsg(null);
                }}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-medium">Carregando técnicos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : technicians.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-medium">Nenhum técnico cadastrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <div key={tech.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{tech.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 font-mono">PIS: {tech.id}</p>
                </div>
                <button
                  onClick={() => handleDeleteTechnician(tech.id)}
                  className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{tech.phone}</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase">Especialidade</p>
                  <p className="text-sm text-gray-800 font-medium">{tech.specialty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
