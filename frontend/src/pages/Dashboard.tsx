import React from "react";
import { Clock, Activity, CheckCircle, TrendingUp } from "lucide-react";

function normalizeStatus(status: string) {
  const normalized = String(status || "").trim().toLowerCase();
  if (normalized === "concluida" || normalized === "concluido" || normalized === "concluído") {
    return "Concluído";
  }
  if (normalized === "em andamento") {
    return "Em Andamento";
  }
  if (normalized === "pendente") {
    return "Pendente";
  }
  return status;
}

function formatRelativeTime(value: any) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";

  const diffMs = Date.now() - date.getTime();
  if (diffMs <= 0) return "Agora";

  const diffMin = Math.floor(diffMs / (1000 * 60));
  if (diffMin <= 1) return "Agora";
  if (diffMin < 60) return `Há ${diffMin} min`;

  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Há ${diffH} h`;

  const diffDays = Math.floor(diffH / 24);
  return `Há ${diffDays} dias`;
}

export function Dashboard() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [billing, setBilling] = React.useState<any>({ total: '0.00', formatted: 'R$ 0,00' });

  React.useEffect(() => {
    import('../api').then(({ getOrders, getBilling }) => {
      getOrders().then(setOrders).catch(console.error);
      getBilling().then(setBilling).catch(console.error);
    });
  }, []);

  const recentActivities = React.useMemo(() => {
    const activities = orders.map((order) => {
      const normalized = normalizeStatus(order.status);
      const timestamp =
        order.endDate ||
        order.data_fim ||
        order.startDate ||
        order.data_inicio ||
        order.requestDate ||
        order.data_solicitacao ||
        order.date;

      let action = `OS #${order.id} criada`;
      if (normalized === "Concluído") action = `OS #${order.id} finalizada`;
      else if (normalized === "Em Andamento") action = `OS #${order.id} iniciada`;

      const parsed = new Date(timestamp);
      const date = Number.isNaN(parsed.getTime()) ? null : parsed;

      return {
        id: order.id,
        action,
        time: formatRelativeTime(timestamp),
        date,
      };
    });

    activities.sort((a, b) => {
      const aTime = a.date?.getTime();
      const bTime = b.date?.getTime();
      if (typeof aTime !== "number" && typeof bTime !== "number") return 0;
      if (typeof aTime !== "number") return 1;
      if (typeof bTime !== "number") return -1;
      return bTime - aTime;
    });

    return activities.slice(0, 8).map(({ id, action, time }) => ({ id, action, time }));
  }, [orders]);

  return (
    <div className="p-8 ml-64">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Operacional</h2>
        <p className="text-gray-500 mt-1">Visão geral do desempenho da assistência técnica.</p>
      </header>

      {/* Cards de Status */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatusCard icon={Clock} label="PENDENTES" value={orders.filter(o => normalizeStatus(o.status) === 'Pendente').length.toString()} color="text-orange-500" bg="bg-orange-50" />
        <StatusCard icon={Activity} label="EM EXECUÇÃO" value={orders.filter(o => normalizeStatus(o.status) === 'Em Andamento').length.toString()} color="text-blue-500" bg="bg-blue-50" />
        <StatusCard icon={CheckCircle} label="FINALIZADOS" value={orders.filter(o => normalizeStatus(o.status) === 'Concluído').length.toString()} color="text-green-500" bg="bg-green-50" />
        <StatusCard icon={TrendingUp} label="FATURAMENTO" value={billing.formatted} color="text-purple-500" bg="bg-purple-50" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[20rem]">
          <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-primary"/> Atividade Recente
          </h3>

          {recentActivities.length === 0 ? (
            <p className="text-sm text-gray-500">Sem atividades recentes para exibir.</p>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <p className="text-sm text-gray-800">{activity.action}</p>
                  <span className="ml-auto text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          )}
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