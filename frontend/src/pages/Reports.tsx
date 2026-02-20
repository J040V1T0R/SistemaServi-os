import React from "react";
import { History, Search, FileText, DollarSign, Clock, CheckCircle, PlayCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Reports() {
    const { usersList } = useAuth();
    const [allOrders, setAllOrders] = React.useState<any[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('');
    const [editingOrder, setEditingOrder] = React.useState<any | null>(null);
    const [savingEdit, setSavingEdit] = React.useState(false);
    const [editForm, setEditForm] = React.useState({
        status: '',
        value: '',
        solution: '',
        startDate: '',
        endDate: '',
        technicianId: '',
        problemDescription: '',
    });

    React.useEffect(() => {
        import('../api').then(({ getOrders }) => {
            getOrders().then(setAllOrders).catch(console.error);
        });
    }, []);

    // retains legacy structure while loading
    const orders = allOrders.length ? allOrders : [];

    const normalizeStatus = (status: string) => {
        if (!status) return '';
        if (status === 'Concluida') return 'Concluído';
        return status;
    };

    const formatDateInput = (value: any) => {
        if (!value) return '';
        const text = String(value);
        return text.length >= 10 ? text.slice(0, 10) : text;
    };

    const formatValueInput = (value: any) => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'number') return String(value);
        return String(value).replace(/[R$\s]/g, '').replace(',', '.');
    };

    const filteredOrders = orders.filter((item) => {
        const status = normalizeStatus(String(item.status || ''));
        const statusMatches = !statusFilter || status === statusFilter;
        if (!statusMatches) return false;

        if (!searchTerm.trim()) return true;
        const term = searchTerm.trim().toLowerCase();
        const idText = String(item.id ?? '').toLowerCase();
        const nameText = String(item.client ?? '').toLowerCase();
        const dateText = String(item.date ?? item.requestDate ?? '').toLowerCase();
        const equipText = String(item.equip ?? '').toLowerCase();

        return idText.includes(term) || nameText.includes(term) || dateText.includes(term) || equipText.includes(term);
    });

    const totalBilling = React.useMemo(() => {
        return orders
            .filter(o => normalizeStatus(o.status) === 'Concluído')
            .reduce((sum, o) => {
                const valueStr = String(o.value || '0').replace(/[R$\s]/g, '').replace(',', '.');
                const num = parseFloat(valueStr) || 0;
                return sum + num;
            }, 0)
            .toFixed(2);
    }, [orders]);

    const openEdit = (order: any) => {
        setEditingOrder(order);
        setEditForm({
            status: normalizeStatus(String(order.status || '')),
            value: formatValueInput(order.value),
            solution: String(order.solution || ''),
            startDate: formatDateInput(order.startDate || order.data_inicio),
            endDate: formatDateInput(order.endDate || order.data_fim),
            technicianId: String(order.technicianId || order.pis_tecnico || ''),
            problemDescription: String(order.problemDescription || order.problema || ''),
        });
    };

    const closeEdit = () => {
        setEditingOrder(null);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const saveEdit = async () => {
        if (!editingOrder) return;
        setSavingEdit(true);
        try {
            const { updateOrder, getOrders } = await import('../api');
            await updateOrder(editingOrder.id, {
                status: editForm.status || null,
                value: editForm.value || null,
                solution: editForm.solution || null,
                startDate: editForm.startDate || null,
                endDate: editForm.endDate || null,
                technicianId: editForm.technicianId || null,
                problemDescription: editForm.problemDescription || null,
            });
            const updated = await getOrders();
            setAllOrders(updated || []);
            closeEdit();
        } catch (err) {
            console.error(err);
        } finally {
            setSavingEdit(false);
        }
    };

    return (
        <div className="p-8 ml-64 min-h-screen">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <History className="text-primary" /> Relatório Geral
                    </h2>
                    <p className="text-gray-500 mt-1">Visão unificada de todas as ordens de serviço do sistema.</p>
                </div>
            </header>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center">
                                <FileText size={24}/>
                        </div>
                        <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Total Registros</p>
                                <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                        </div>
                 </div>
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                <DollarSign size={24}/>
                        </div>
                        <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Faturamento (Concluídos)</p>
                                <p className="text-2xl font-bold text-gray-800">R$ {totalBilling.replace('.', ',')}</p>
                        </div>
                 </div>
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
                                <Clock size={24}/>
                        </div>
                        <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Pendentes na Fila</p>
                                <p className="text-2xl font-bold text-gray-800">
                                        {orders.filter(o => normalizeStatus(o.status) === 'Pendente').length}
                                </p>
                        </div>
                 </div>
            </div>

            {/* Tabela de Dados */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
                {/* Barra de Busca */}
                <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
                        <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                        type="text" 
                                        placeholder="Filtrar por nome, data, equipamento ou ID..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                        </div>
                        <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none cursor-pointer hover:border-primary"
                        >
                                <option value="">Todos os Status</option>
                                <option value="Pendente">Pendente</option>
                                <option value="Em Andamento">Em Andamento</option>
                                <option value="Concluído">Concluído</option>
                        </select>
                </div>

                {/* Tabela */}
                <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                                <tr>
                                        <th className="px-6 py-4">ID OS</th>
                                        <th className="px-6 py-4">Cliente</th>
                                        <th className="px-6 py-4">Equipamento</th>
                                        <th className="px-6 py-4">Data Entrada</th>
                                        <th className="px-6 py-4">Valor Final</th>
                                        <th className="px-6 py-4">Situação Atual</th>
                                        <th className="px-6 py-4">Ações</th>
                                </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredOrders.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-6 py-4 font-bold text-gray-600 group-hover:text-primary">#{item.id}</td>
                                                <td className="px-6 py-4 text-gray-800 font-medium">{item.client}</td>
                                                <td className="px-6 py-4 text-gray-600">{item.equip}</td>
                                                <td className="px-6 py-4 text-gray-500">{item.date}</td>
                                                <td className="px-6 py-4 font-bold text-gray-800">{item.value}</td>
                                                <td className="px-6 py-4">
                                                        <BadgeStatus status={normalizeStatus(String(item.status || ''))} />
                                                </td>
                                                <td className="px-6 py-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEdit(item)}
                                                            className="bg-primary text-white font-bold text-xs px-3 py-1 rounded-md hover:bg-blue-700"
                                                        >
                                                            Editar
                                                        </button>
                                                </td>
                                        </tr>
                                ))}
                        </tbody>
                </table>
            </div>

            {editingOrder && (
                <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Editar OS #{editingOrder.id}</h3>
                            <button
                                type="button"
                                onClick={closeEdit}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                Fechar
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Status</label>
                                <select
                                    name="status"
                                    value={editForm.status}
                                    onChange={handleEditChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white appearance-none"
                                >
                                    <option value="">Sem mudança</option>
                                    <option value="Pendente">Pendente</option>
                                    <option value="Em Andamento">Em Andamento</option>
                                    <option value="Concluído">Concluído</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Valor</label>
                                <input
                                    name="value"
                                    value={editForm.value}
                                    onChange={handleEditChange}
                                    type="text"
                                    placeholder="Ex: 150.00"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Data Início</label>
                                <input
                                    name="startDate"
                                    value={editForm.startDate}
                                    onChange={handleEditChange}
                                    type="date"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Data Fim</label>
                                <input
                                    name="endDate"
                                    value={editForm.endDate}
                                    onChange={handleEditChange}
                                    type="date"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Técnico Responsável</label>
                                <select
                                    name="technicianId"
                                    value={editForm.technicianId}
                                    onChange={handleEditChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white appearance-none"
                                >
                                    <option value="">Sem mudança</option>
                                    {usersList
                                        .filter(u => u.role === 'TECH')
                                        .map(tech => (
                                            <option key={tech.id} value={tech.id}>{tech.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Problema</label>
                            <textarea
                                name="problemDescription"
                                value={editForm.problemDescription}
                                onChange={handleEditChange}
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Solução</label>
                            <textarea
                                name="solution"
                                value={editForm.solution}
                                onChange={handleEditChange}
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={closeEdit}
                                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={saveEdit}
                                disabled={savingEdit}
                                className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
                            >
                                {savingEdit ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Componente de Badge para a Tabela
function BadgeStatus({ status }: { status: string }) {
        let style = "";
        let icon = null;

        if (status === "Pendente") {
                style = "bg-yellow-100 text-yellow-800 border border-yellow-200";
                icon = <Clock size={12} />;
        } else if (status === "Em Andamento") {
                style = "bg-blue-100 text-blue-800 border border-blue-200";
                icon = <PlayCircle size={12} />;
        } else {
                style = "bg-green-100 text-green-800 border border-green-200";
                icon = <CheckCircle size={12} />;
        }

        return (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${style}`}>
                        {icon} {status}
                </span>
        );
}