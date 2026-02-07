import { LayoutDashboard, PlusCircle, Wrench, History, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // <--- Importe o hook

export function Sidebar() {
  const location = useLocation();
  const { user, switchUser, usersList } = useAuth(); // <--- Use o hook

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: PlusCircle, label: "Nova Solicitação", path: "/nova-solicitacao" },
    { icon: Wrench, label: "Minhas Tarefas", path: "/painel-tecnico" }, // Mudou nome
    { icon: History, label: "Relatórios", path: "/historico" },
  ];

  // Item extra só para o Gerente
  if (user.role === "MANAGER") {
    menuItems.splice(2, 0, { icon: Users, label: "Gestão de Equipe", path: "/equipe" });
  }

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-10">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-primary">SistOS</h1>
        <p className="text-xs text-gray-400 tracking-widest mt-1">
            {user.role === 'MANAGER' ? "MODO GERENTE" : "MODO TÉCNICO"}
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}>
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Seletor de Usuário (Simulador) */}
      <div className="p-6 border-t border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Simular Usuário:</p>
        <select 
            value={user.id} 
            onChange={(e) => switchUser(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm mb-4"
        >
            {usersList.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>

        <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
            {user.avatar}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700">{user.name}</p>
            <p className="text-[10px] text-gray-500">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}