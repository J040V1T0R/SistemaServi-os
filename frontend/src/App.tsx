import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { NewRequest } from "./pages/NewRequest";
import { TechnicianPanel } from "./pages/TechnicianPanel";
import { Reports } from "./pages/Reports";
import { TechniciansManagement } from "./pages/TechniciansManagement";

function App() {
  return (
    <BrowserRouter>
      <div className="flex bg-[#F8FAFC] min-h-screen font-sans">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/nova-solicitacao" element={<NewRequest />} />
            <Route path="/painel-tecnico" element={<TechnicianPanel />} />
            <Route path="/historico" element={<Reports />} />
            <Route path="/tecnicos" element={<TechniciansManagement />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;