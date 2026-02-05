import React, { useState, useEffect } from 'react';
import { mastersAPI, transactionsAPI } from '../service/api';
import { 
    Factory, Save, History, TrendingUp, Search, 
    ChevronRight, Activity, Scale, ArrowDownToLine, Database
} from 'lucide-react';

const RG1Production = () => {
    const emptyState = { 
        date: new Date().toISOString().split('T')[0], 
        product_id: '', production_kgs: 0, prv_day_closing: 0,
        invoice_kgs: 0, stock_kgs: 0
    };

    const [list, setList] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const [formData, setFormData] = useState(emptyState);
    const [search, setSearch] = useState("");

    useEffect(() => {
        mastersAPI.products.getAll().then(res => setProducts(res.data.data || []));
        fetchRecords();
    }, []);

    // EFFECT: When a product is selected, fetch its current mill_stock
    useEffect(() => {
        if (formData.product_id) {
            const product = products.find(p => p.id === parseInt(formData.product_id));
            if (product) {
                setSelectedProductDetails(product);
                // Auto-populate Previous Closing with current Mill Stock
                setFormData(prev => ({
                    ...prev,
                    prv_day_closing: product.mill_stock || 0,
                    // Recalculate closing immediately
                    stock_kgs: (parseFloat(product.mill_stock || 0) + parseFloat(prev.production_kgs || 0) - parseFloat(prev.invoice_kgs || 0)).toFixed(2)
                }));
            }
        } else {
            setSelectedProductDetails(null);
            setFormData(prev => ({ ...prev, prv_day_closing: 0, stock_kgs: 0 }));
        }
    }, [formData.product_id, products]);

    const fetchRecords = async () => {
        const res = await transactionsAPI.production.getAll();
        setList(res.data.data || []);
    };

    const handleSave = async () => {
        if (!formData.product_id) return alert("Please select a Finished Good SKU");
        try {
            await transactionsAPI.production.create(formData);
            alert("RG1 Registry Updated & Mill Stock Incremented!");
            fetchRecords();
            // Refresh products to get updated stock for next entry
            mastersAPI.products.getAll().then(res => setProducts(res.data.data || []));
            setFormData(emptyState);
        } catch (err) { alert("Error saving production"); }
    };

    const calculateStock = (e, field) => {
        const val = parseFloat(e.target.value) || 0;
        const newForm = { ...formData, [field]: val };
        const closing = (parseFloat(newForm.prv_day_closing) + parseFloat(newForm.production_kgs)) - parseFloat(newForm.invoice_kgs);
        setFormData({ ...newForm, stock_kgs: closing.toFixed(2) });
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-900">
            {/* 1. SIDEBAR: REGISTRY HISTORY */}
            <div className="w-96 flex flex-col bg-white border-r z-20 shadow-xl">
                <div className="p-6 bg-slate-900 text-white">
                    <div className="flex items-center gap-2 mb-6 uppercase font-black text-xs tracking-widest">
                        <Factory className="text-emerald-500" /> RG1 Registry
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={16}/>
                        <input 
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500" 
                            placeholder="Search logs..." 
                            onChange={e => setSearch(e.target.value)} 
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    {list.filter(i => i.Product?.product_name?.toLowerCase().includes(search.toLowerCase())).map(item => (
                        <div key={item.id} onClick={() => setFormData(item)} className="p-4 border-b hover:bg-white cursor-pointer group transition-all">
                            <div className="flex justify-between text-[10px] font-black text-slate-400 mb-1 uppercase">
                                <span>ID: {item.id}</span>
                                <span>{item.date}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-700">{item.Product?.product_name}</p>
                            <div className="flex justify-between mt-2">
                                <span className="text-[10px] font-black text-emerald-600">Produced: {item.production_kgs}</span>
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. MAIN WORKSPACE */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <TrendingUp className="text-emerald-600" size={24}/>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Daily Production Log</h1>
                        </div>
                    </div>
                    
                    {/* LIVE STOCK BADGE */}
                    {selectedProductDetails && (
                        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl flex items-center gap-3">
                            <Database size={16} className="text-emerald-600" />
                            <div>
                                <p className="text-[9px] font-black text-emerald-500 uppercase">Available Mill Stock</p>
                                <p className="text-sm font-black text-emerald-900">{selectedProductDetails.mill_stock} KG</p>
                            </div>
                        </div>
                    )}

                    <button onClick={handleSave} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-lg hover:bg-emerald-700 transition-all">
                        COMMIT TO STOCK
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
                    <div className="max-w-6xl mx-auto grid grid-cols-2 gap-10">
                        {/* INPUT SECTION */}
                        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Production Date</label>
                                    <input type="date" className="w-full bg-slate-50 p-4 rounded-2xl font-bold font-mono outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Finished Good SKU</label>
                                    <select 
                                        className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-emerald-100" 
                                        value={formData.product_id} 
                                        onChange={e => setFormData({...formData, product_id: e.target.value})}
                                    >
                                        <option value="">Select SKU...</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.product_name} (Stock: {p.mill_stock})</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4 bg-slate-900 p-6 rounded-3xl">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-emerald-400 uppercase">Production (KG)</label>
                                        <input type="number" className="w-full bg-transparent border-b border-emerald-500/30 text-2xl font-black text-white outline-none" value={formData.production_kgs} onChange={e => calculateStock(e, 'production_kgs')} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-blue-400 uppercase">Total Invoice (KG)</label>
                                        <input type="number" className="w-full bg-transparent border-b border-blue-500/30 text-2xl font-black text-white outline-none" value={formData.invoice_kgs} onChange={e => calculateStock(e, 'invoice_kgs')} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CALCULATION SUMMARY */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col justify-center relative border border-slate-800">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={100} /></div>
                            <div className="space-y-8 relative z-10">
                                <div className="border-b border-white/5 pb-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase">Previous Closing Balance</label>
                                    <input 
                                        type="number" 
                                        className="bg-transparent border-none text-4xl font-black w-full text-white outline-none" 
                                        value={formData.prv_day_closing} 
                                        onChange={e => calculateStock(e, 'prv_day_closing')} 
                                    />
                                    <p className="text-[9px] text-emerald-500 font-bold mt-1 uppercase tracking-tighter italic">
                                        * Pulled from Mill Stock Ledger
                                    </p>
                                </div>
                                <div className="py-8 text-center bg-white/5 rounded-[2rem] border border-white/5">
                                    <span className="text-emerald-400 text-[10px] font-black uppercase mb-2 block">Projected Closing Stock</span>
                                    <h2 className="text-7xl font-black">{formData.stock_kgs} <span className="text-lg">KG</span></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RG1Production;