import React, { useState, useEffect } from 'react';
import { mastersAPI, transactionsAPI } from '../service/api';
import { 
    Save, FileText, ShoppingBag, Percent, 
    Warehouse, Users, Link, Calculator, 
    ArrowRightCircle, History, Search, ChevronRight,
    Truck, BadgePercent
} from 'lucide-react';

const DepotSalesInvoice = () => {
    const [depots, setDepots] = useState([]);
    const [parties, setParties] = useState([]);
    const [orders, setOrders] = useState([]);
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({ 
        invoice_no: '', 
        date: new Date().toISOString().split('T')[0], 
        depot_id: '', 
        party_id: '', 
        assessable_value: 0, 
        charity: 0, 
        gst: 0, 
        final_value: 0, 
        Details: [] 
    });

    useEffect(() => {
        mastersAPI.accounts.getAll({ account_group: 'Depot' }).then(res => setDepots(res.data.data || res.data));
        mastersAPI.accounts.getAll().then(res => setParties(res.data.data || res.data));
        transactionsAPI.orders.getAll({ status: 'OPEN' }).then(res => setOrders(res.data.data || res.data));
        // Mocking history fetch - replace with your actual API
        transactionsAPI.invoices.getAll({ type: 'Depot' }).then(res => setHistory(res.data.data || res.data));
    }, []);

    const handleSave = async () => {
        try {
            await transactionsAPI.invoices.create({ ...formData, invoice_type: 'Depot' });
            alert("Depot Invoice Generated");
            // Clear or Refresh logic here
        } catch (err) {
            alert("Save failed");
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            
            {/* 1. DEPOT REGISTRY SIDEBAR */}
            <div className="w-80 flex flex-col bg-white border-r border-slate-200 shadow-xl z-20">
                <div className="p-6 bg-slate-900 text-white">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-amber-500 rounded-lg shadow-lg shadow-amber-500/20">
                            <Warehouse size={18} className="text-slate-900" />
                        </div>
                        <h2 className="font-black text-sm uppercase tracking-tighter text-amber-500">Depot Ledger</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                        <input 
                            className="w-full pl-9 pr-4 py-2 bg-slate-800 border-none rounded-xl text-[10px] text-slate-200 placeholder-slate-500 outline-none" 
                            placeholder="Search Depot Invoices..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    {history.map(inv => (
                        <div key={inv.id} className="p-4 border-b border-slate-200 hover:bg-white cursor-pointer group transition-all">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-amber-600 uppercase">DEP-{inv.invoice_no}</span>
                                <span className="text-[9px] font-mono text-slate-400">{inv.date}</span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-700 truncate">{inv.Party?.account_name}</p>
                            <div className="flex justify-between items-end mt-2">
                                <span className="text-[10px] font-mono font-black text-slate-900 italic">₹{inv.final_value}</span>
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-amber-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. MAIN WORKSPACE */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                            <ShoppingBag size={24}/>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Depot Sales Entry</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <BadgePercent size={12} className="text-amber-400" /> Secondary Distribution Channel
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSave}
                        className="bg-slate-900 text-amber-500 px-8 py-3 rounded-2xl font-black text-xs shadow-xl hover:bg-black active:scale-95 transition-all flex items-center gap-3"
                    >
                        <Save size={18}/> POST DEPOT INVOICE
                    </button>
                </header>

                <div className="p-10 space-y-8">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                        
                        {/* PRIMARY FORM */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                                <div className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-[0.2em]">
                                    <Warehouse size={16} /> Source & Destination
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Dispatching Depot</label>
                                        <div className="relative">
                                            <Warehouse className="absolute left-4 top-4 text-slate-300" size={18} />
                                            <select 
                                                className="w-full pl-12 bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-amber-100 transition-all appearance-none"
                                                onChange={e => setFormData({...formData, depot_id: e.target.value})}
                                            >
                                                <option>Select Source Depot</option>
                                                {depots.map(d => <option key={d.id} value={d.id}>{d.account_name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Receiving Party</label>
                                        <div className="relative">
                                            <Users className="absolute left-4 top-4 text-slate-300" size={18} />
                                            <select 
                                                className="w-full pl-12 bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-amber-100 transition-all appearance-none"
                                                onChange={e => setFormData({...formData, party_id: e.target.value})}
                                            >
                                                <option>Select Destination Party</option>
                                                {parties.map(p => <option key={p.id} value={p.id}>{p.account_name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-500 rounded-[2.5rem] p-8 shadow-xl shadow-amber-500/10 border-2 border-amber-400/50">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-900 p-2 rounded-lg"><Link size={18} className="text-amber-500"/></div>
                                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Order Synchronization</h4>
                                    </div>
                                    <span className="bg-white/30 text-slate-900 px-3 py-1 rounded-full text-[9px] font-black">ACTIVE ORDERS</span>
                                </div>
                                <select className="w-full bg-white border-none p-4 rounded-2xl font-bold text-slate-700 shadow-inner outline-none focus:ring-4 focus:ring-white/20">
                                    <option>Pull Items from Open Order Confirmation...</option>
                                    {orders.map(o => <option key={o.id} value={o.id}>{o.order_no} | {o.Party?.account_name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* VALUES PANEL */}
                        <div className="space-y-6">
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col border border-slate-800">
                                <div className="absolute top-0 right-0 p-4 opacity-5"><Calculator size={120} /></div>
                                <h3 className="font-black text-amber-400 text-[10px] uppercase tracking-[0.3em] mb-10 border-b border-white/5 pb-4">Value Breakdown</h3>
                                
                                <div className="space-y-6 relative z-10">
                                    <ValueRow label="Assessable Value" value={formData.assessable_value} />
                                    <ValueRow label="Taxation (GST)" value={formData.gst} color="text-amber-400" />
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Freight / Transport Charges</label>
                                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                            <Truck size={16} className="text-slate-500" />
                                            <input type="number" className="bg-transparent border-none text-xl font-black w-full outline-none font-mono" placeholder="0.00" />
                                        </div>
                                    </div>

                                    <div className="pt-8 mt-4 border-t border-white/10 text-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Net Payable Amount</span>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-4xl font-black text-white font-mono tracking-tighter">₹ {formData.final_value}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex items-center gap-4 shadow-sm">
                                <div className="h-10 w-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                                    <History size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase">Auto-Settle</h4>
                                    <p className="text-[11px] text-slate-500 font-medium">Invoice will automatically post to Depot Ledger upon generation.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ValueRow = ({ label, value, color = "text-white" }) => (
    <div className="flex justify-between items-center text-xs font-bold">
        <span className="text-slate-500 font-black uppercase tracking-tighter">{label}</span>
        <span className={`${color} font-mono italic`}>₹ {value}</span>
    </div>
);

export default DepotSalesInvoice;