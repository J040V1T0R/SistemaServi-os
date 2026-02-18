import { Clock, Activity, CheckCircle, TrendingUp, User } from "lucide-react";

export function Dashboard() {
  // Dados Mockados para Atividade Recente
  const recentActivities = [
    { id: 1, user: "João (Téc)", action: "Finalizou OS #1002", time: "Há 10 min" },
    { id: 2, user: "Ana (Téc)", action: "Iniciou OS #1005", time: "Há 35 min" },
    { id: 3, user: "Carlos (Ger)", action: "Aprovou Orçamento #998", time: "Há 1 hora" },
    { id: 4, user: "João (Téc)", action: "Pausou OS #1001", time: "Há 2 horas" },
  ];

  return (
    <div className="p-8 ml-64">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Operacional</h2>
        <p className="text-gray-500 mt-1">Visão geral do desempenho da assistência técnica.</p>
      </header>

      {/* Cards de Status */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatusCard icon={Clock} label="PENDENTES" value="3" color="text-orange-500" bg="bg-orange-50" />
        <StatusCard icon={Activity} label="EM EXECUÇÃO" value="2" color="text-blue-500" bg="bg-blue-50" />
        <StatusCard icon={CheckCircle} label="FINALIZADOS" value="12" color="text-green-500" bg="bg-green-50" />
        <StatusCard icon={TrendingUp} label="FATURAMENTO" value="R$ 450" color="text-purple-500" bg="bg-purple-50" />
      </div>

      {/* Gráfico e Lista */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* GRÁFICO VISUAL (CSS PURO) */}
        <div className="col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex flex-col">
          <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-6">
            <Activity size={18} className="text-primary"/> Volume de Chamados (Semana)
          </h3>
          
          <div className="flex-1 flex items-end justify-between px-4 gap-4">
             {/* Barras do Gráfico */}
             <BarDay day="Seg" height="h-32" count="8" />
             <BarDay day="Ter" height="h-44" count="12" isHighest />
             <BarDay day="Qua" height="h-24" count="6" />
             <BarDay day="Qui" height="h-36" count="10" />
             <BarDay day="Sex" height="h-40" count="11" />
             <BarDay day="Sáb" height="h-16" count="4" />
          </div>
        </div>

        {/* LISTA DE ATIVIDADES RECENTES */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 overflow-y-auto">
          <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-primary"/> Atividade Recente
          </h3>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-sm text-gray-800 font-bold">{activity.user}</p>
                  <p className="text-xs text-gray-500">{activity.action}</p>
                </div>
                <span className="ml-auto text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes Auxiliares
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

function BarDay({ day, height, count, isHighest }: any) {
  return (
    <div className="flex flex-col items-center gap-2 w-full group cursor-pointer">
       <div className="relative w-full bg-gray-100 rounded-t-lg overflow-hidden h-48 flex items-end">
          <div className={`w-full ${height} ${isHighest ? 'bg-primary' : 'bg-blue-300 group-hover:bg-primary'} rounded-t-lg transition-all duration-500 relative`}>
            {/* Tooltip simples */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
               {count} OSs
            </span>
          </div>
       </div>
       <span className="text-xs font-bold text-gray-400">{day}</span>
    </div>
  );
}