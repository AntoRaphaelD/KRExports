import React, { useState, useEffect } from 'react';
import { mastersAPI, transactionsAPI } from '../service/api';
import { Download, Save, History, Search, ChevronRight, Hash, Calendar, Warehouse, ArrowRight, FileText, LayoutGrid } from 'lucide-react';

const DepotStockReceived = () => {
    const [depots, setDepots] = useState([]);
    const [list, setList] = useState([]);
    const [search, setSearch] = useState("");
    const [formData, setFormData] = useState({ 
        code: '', date: new Date().toISOString().split('T')[0], 
        depot_id: '', received_inv_from: '', received_inv_to: '' 
    });

    useEffect(() => {
        mastersAPI.accounts.getAll().then(res => {
            const all = res.data.data || [];
            setDepots(all.filter(a => a.account_group === 'Depot'));
        });
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const res = await transactionsAPI.depotReceived.getAll();
        setList(res.data.data || []);
    };

    const handleSave = async () => {
        if (!formData.depot_id) return alert("Select Depot");
        try {
            await transactionsAPI.depotReceived.create(formData);
            alert("Inbound Shipment Verified");
            setFormData({ code: '', date: new Date().toISOString().split('T')[0], depot_id: '', received_inv_from: '', received_inv_to: '' });
            fetchHistory();
        } catch (err) { alert("Error"); }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            <div className="w-80 flex flex-col bg-white border-r z-20 shadow-xl">
                <div className="p-6 bg-indigo-950 text-white">
                    <div className="flex items-center gap-2 mb-6 font-black text-xs uppercase tracking-widest"><History size={18} /> Inward Manifest</div>
                    <div className="relative"><Search className="absolute left-3 top-2.5 text-indigo-400" size={14} /><input className="w-full pl-9 pr-4 py-2 bg-indigo-900/50 rounded-xl text-xs text-white" placeholder="Search manifest..." onChange={e => setSearch(e.target.value)} /></div>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    {list.map(item => (
                        <div key={item.id} className="p-4 border-b hover:bg-white cursor-pointer group transition-all">
                            <div className="flex justify-between text-[10px] font-black text-indigo-600 mb-1 uppercase"><span>REF: #{item.id}</span><span>{item.date}</span></div>
                            <p className="text-xs font-bold text-slate-700">{item.Depot?.account_name}</p>
                            <div className="mt-2 flex items-center justify-between text-[10px] font-black text-slate-400 bg-slate-100 p-2 rounded">
                                <span>{item.received_inv_from} → {item.received_inv_to}</span>
                                <ChevronRight size={12} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b px-10 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4"><Download className="text-indigo-600" size={24}/><div><h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Depot Inbound Log</h1></div></div>
                    <button onClick={handleSave} className="bg-indigo-600 text-white px-10 py-3.5 rounded-2xl font-black text-xs shadow-lg">COMMIT SHIPMENT</button>
                </header>

                <main className="flex-1 overflow-y-auto p-12 bg-slate-50/50">
                    <div className="max-w-4xl mx-auto space-y-10">
                        <div className="bg-white p-10 rounded-[3rem] border shadow-sm relative overflow-hidden">
                            <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-10 pb-6 border-b"><LayoutGrid size={16} /> Registry Header</div>
                            <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase">Arrival Date</label><input type="date" className="w-full bg-slate-50 p-4 rounded-2xl font-black font-mono border-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                                <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase">Receiving Warehouse</label><select className="w-full bg-slate-50 p-4 rounded-2xl font-black border-none" value={formData.depot_id} onChange={e => setFormData({...formData, depot_id: e.target.value})}><option value="">Select Depot...</option>{depots.map(d => <option key={d.id} value={d.id}>{d.account_name}</option>)}</select></div>
                            </div>
                        </div>

                        <div className="bg-indigo-950 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden border">
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-12 font-black text-sm uppercase text-indigo-200"><FileText size={20}/> Sequence Batch</div>
                                <div className="grid grid-cols-2 gap-16 items-center">
                                    <div className="space-y-4"><label className="text-[11px] font-black text-indigo-400 uppercase">Inv From</label><input className="w-full bg-indigo-900/40 border-b-4 border-indigo-500/30 p-4 text-5xl font-black text-white outline-none" value={formData.received_inv_from} onChange={e => setFormData({...formData, received_inv_from: e.target.value})} /></div>
                                    <div className="space-y-4"><label className="text-[11px] font-black text-indigo-400 uppercase">Inv To</label><div className="flex items-center gap-8"><ArrowRight className="text-indigo-600" size={40}/><input className="w-full bg-indigo-900/40 border-b-4 border-indigo-500/30 p-4 text-5xl font-black text-white outline-none" value={formData.received_inv_to} onChange={e => setFormData({...formData, received_inv_to: e.target.value})} /></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DepotStockReceived;