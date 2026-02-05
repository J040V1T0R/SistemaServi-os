import { Clock, Activity, CheckCircle, TrendingUp } from "lucide-react";

export function Dashboard() {
  return (
    <div className="p-8 ml-64">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Bem-vinda, Maria</h2>
        <p className="text-gray-500 mt-1">Aqui está o resumo operacional de hoje.</p>
      </header>

      {/* Cards de Status */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatusCard icon={Clock} label="PENDENTES" value="3" color="text-orange-500" bg="bg-orange-50" />
        <StatusCard icon={Activity} label="EM EXECUÇÃO" value="1" color="text-blue-500" bg="bg-blue-50" />
        <StatusCard icon={CheckCircle} label="FINALIZADOS" value="12" color="text-green-500" bg="bg-green-50" />
        <StatusCard icon={TrendingUp} label="FATURAMENTO" value="R$ 450" color="text-purple-500" bg="bg-purple-50" />
      </div>

      {/* Gráfico / Lista Recente */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-64">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Activity size={18} className="text-primary"/> Status da Operação
          </h3>
          <div className="flex items-center justify-center h-full text-gray-300 text-sm">
            [Gráfico de barras simulado aqui]
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-64">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary"/> Atividade Recente
          </h3>
          <p className="mt-10 text-center text-sm text-gray-400 italic">Nenhuma atividade registrada.</p>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para o Card
function StatusCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 ${bg} ${color} rounded-full flex items-center justify-center mb-4`}>
        <Icon size={20} />
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}