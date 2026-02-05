import React, { useState, useEffect } from 'react';
import { mastersAPI, transactionsAPI } from '../service/api';
import { 
    Database, Save, Package, Search, 
    History, ChevronRight, Warehouse, 
    Calendar, Scale, Boxes, AlertTriangle, 
    CheckCircle2, Info
} from 'lucide-react';

export const DepotOpeningStock = () => {
    const [depots, setDepots] = useState([]);
    const [products, setProducts] = useState([]);
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        depot_id: '',
        date: new Date().toISOString().split('T')[0],
        product_id: '',
        total_kgs: '',
        total_bags: ''
    });

    useEffect(() => {
        mastersAPI.accounts.getAll({ account_group: 'Depot' }).then(res => setDepots(res.data.data || res.data));
        mastersAPI.products.getAll().then(res => setProducts(res.data.data || res.data));
        // Replace with your actual initialization history API
        transactionsAPI.depotReceived.getAll().then(res => setHistory(res.data.data || res.data));
    }, []);

    const handleInitialize = async () => {
        if (!formData.depot_id || !formData.product_id) {
            return alert("Please select both Depot and Product.");
        }
        try {
            setLoading(true);
            await transactionsAPI.depotReceived.create({ ...formData, type: 'OPENING' });
            alert("Depot Stock Initialized Successfully");
            setFormData({ ...formData, product_id: '', total_kgs: '', total_bags: '' });
        } catch (err) {
            alert("Initialization failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            
            {/* 1. INITIALIZATION LOG SIDEBAR */}
            <div className="w-80 flex flex-col bg-white border-r border-slate-200 shadow-xl z-20">
                <div className="p-6 bg-indigo-900 text-white">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-indigo-500 rounded-lg shadow-lg">
                            <Database size={18} />
                        </div>
                        <h2 className="font-black text-sm uppercase tracking-tighter">Initial Logs</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-indigo-300" size={14} />
                        <input 
                            className="w-full pl-9 pr-4 py-2 bg-indigo-800 border-none rounded-xl text-[10px] text-white placeholder-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none" 
                            placeholder="Search Depot..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar">
                    {history.map(item => (
                        <div key={item.id} className="p-4 border-b border-slate-200 hover:bg-white cursor-pointer group transition-all">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-indigo-600 uppercase">INIT-{item.id}</span>
                                <span className="text-[9px] font-mono text-slate-400">{item.date}</span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-700 truncate">SKU: {item.product_id}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-[9px] font-black text-emerald-600 uppercase">Set: {item.total_kgs} KG</span>
                                <CheckCircle2 size={12} className="text-emerald-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. MAIN WORKSPACE */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                            <Database size={24}/>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Opening Stock Setup</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Info size={12} className="text-indigo-400" /> Master Ledger Synchronization
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleInitialize}
                        disabled={loading}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        <Save size={18}/> {loading ? 'SYNCING...' : 'INITIALIZE LEDGER'}
                    </button>
                </header>

                <main className="p-10 flex flex-col items-center">
                    <div className="max-w-4xl w-full space-y-8">
                        
                        {/* WARNING BANNER */}
                        <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-start gap-4">
                            <div className="h-10 w-10 bg-amber-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Critical Operation</h4>
                                <p className="text-[11px] text-amber-700 leading-tight font-medium mt-1">
                                    This action will set the **permanent opening balance** for the selected depot. Ensure physical stock counts match the input values exactly.
                                </p>
                            </div>
                        </div>

                        {/* DATA ENTRY GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                                <div className="flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-[0.2em]">
                                    <Warehouse size={16} /> Location & Timeline
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Depot</label>
                                        <select 
                                            className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all appearance-none"
                                            value={formData.depot_id}
                                            onChange={e => setFormData({...formData, depot_id: e.target.value})}
                                        >
                                            <option>-- Select Depot --</option>
                                            {depots.map(d => <option key={d.id} value={d.id}>{d.account_name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Baseline Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-4 text-slate-300" size={18} />
                                            <input 
                                                type="date"
                                                className="w-full pl-12 bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all" 
                                                value={formData.date} 
                                                onChange={e => setFormData({...formData, date: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl space-y-8 border border-slate-800">
                                <div className="flex items-center gap-2 text-indigo-300 font-black text-[10px] uppercase tracking-[0.2em]">
                                    <Package size={16} /> Inventory Metrics
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Finished Good / SKU</label>
                                        <select 
                                            className="w-full bg-white/5 border-b-2 border-white/10 p-4 text-sm font-black text-white outline-none focus:border-indigo-400 transition-all appearance-none"
                                            value={formData.product_id}
                                            onChange={e => setFormData({...formData, product_id: e.target.value})}
                                        >
                                            <option className="bg-slate-900">Select Product...</option>
                                            {products.map(p => <option className="bg-slate-900" key={p.id} value={p.id}>{p.product_name}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase">
                                                <Scale size={14} /> Kgs
                                            </div>
                                            <input 
                                                className="w-full bg-white/5 border-b-2 border-white/20 p-2 text-2xl font-black text-white outline-none focus:border-white transition-all font-mono" 
                                                placeholder="0.00"
                                                type="number"
                                                value={formData.total_kgs}
                                                onChange={e => setFormData({...formData, total_kgs: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase">
                                                <Boxes size={14} /> Bags
                                            </div>
                                            <input 
                                                className="w-full bg-white/5 border-b-2 border-white/20 p-2 text-2xl font-black text-white outline-none focus:border-white transition-all font-mono" 
                                                placeholder="0"
                                                type="number"
                                                value={formData.total_bags}
                                                onChange={e => setFormData({...formData, total_bags: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};