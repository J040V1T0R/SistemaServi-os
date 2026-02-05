import { LayoutDashboard, PlusCircle, Wrench, History, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: PlusCircle, label: "Nova Solicitação", path: "/nova-solicitacao" },
    { icon: Wrench, label: "Painel do Técnico", path: "/painel-tecnico" },
    { icon: History, label: "Histórico & Relatórios", path: "/historico" },
  ];

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-10">
      {/* Logo */}
      <div className="p-8">
        <h1 className="text-2xl font-bold text-primary">SistOS</h1>
        <p className="text-xs text-gray-400 tracking-widest mt-1">MANUTENÇÃO INTELIGENTE</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-primary text-white shadow-md shadow-blue-200" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-6 border-t border-gray-100">
        <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
            JD
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700">João Dev</p>
            <p className="text-[10px] text-gray-500">Matrícula: 2026.1</p>
          </div>
        </div>
      </div>
    </aside>
  );
}