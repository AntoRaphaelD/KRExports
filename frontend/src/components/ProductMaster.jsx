import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';
import { Save, Plus, Trash2, Search, Package, Hash, Layers, Scale, ChevronRight, Info, ShieldCheck } from 'lucide-react';

const ProductMaster = () => {
    const emptyState = { 
        product_code: '', product_name: '', short_description: '', 
        packing_type_id: '', tariff_id: '', wt_per_cone: 0, 
        cones_per_pack: 0, pack_nett_wt: 0, actual_count: 0, 
        charity_rs: 0, mill_stock: 0
    };

    const [list, setList] = useState([]);
    const [tariffs, setTariffs] = useState([]);
    const [packingTypes, setPackingTypes] = useState([]);
    const [formData, setFormData] = useState(emptyState);
    const [search, setSearch] = useState("");

    useEffect(() => { 
        fetchRecords();
        mastersAPI.tariffs.getAll().then(res => setTariffs(res.data.data || []));
        mastersAPI.packingTypes.getAll().then(res => setPackingTypes(res.data.data || []));
    }, []);

    const fetchRecords = async () => {
        const res = await mastersAPI.products.getAll();
        const data = res.data.data || [];
        setList(data);
        if (!formData.id) generateNextCode(data);
    };

    const generateNextCode = (currentList) => {
        const nextId = currentList.length > 0 ? Math.max(...currentList.map(i => i.id)) + 1 : 1;
        setFormData(prev => ({ ...prev, product_code: `${String(nextId)}` }));
    };

    const handleAddNew = () => {
        setFormData(emptyState);
        generateNextCode(list);
    };

    const handleSave = async () => {
        if (!formData.product_name) return alert("Product Name Required");
        try {
            formData.id ? await mastersAPI.products.update(formData.id, formData) : await mastersAPI.products.create(formData);
            fetchRecords();
            handleAddNew();
        } catch (err) { alert("Error saving product"); }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            <div className="w-80 flex flex-col bg-white border-r">
                <div className="p-4 bg-slate-900 text-white">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2"><Package size={20} className="text-blue-400" /><h2 className="font-bold">Products</h2></div>
                        <button onClick={handleAddNew} className="p-1.5 bg-blue-600 rounded-lg"><Plus size={18}/></button>
                    </div>
                    <input className="w-full pl-3 pr-4 py-2 bg-slate-800 border-none rounded-lg text-xs" placeholder="Search..." onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {list.filter(i => i.product_name.toLowerCase().includes(search.toLowerCase())).map(item => (
                        <div key={item.id} onClick={() => setFormData(item)} className={`p-4 border-b cursor-pointer transition-all ${formData.id === item.id ? 'bg-blue-50 border-r-4 border-blue-600' : 'hover:bg-slate-50'}`}>
                            <p className="font-bold text-xs uppercase text-slate-700">{item.product_name}</p>
                            <p className="text-[10px] text-emerald-600 font-black">STOCK: {item.mill_stock} KG</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b flex items-center justify-between px-8">
                    <div><h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">{formData.id ? 'Edit Product' : 'New Product Entry'}</h1></div>
                    <div className="flex gap-3"><button onClick={handleSave} className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-black text-xs shadow-lg">SAVE PRODUCT</button></div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl border p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-6 border-b pb-2"><Hash size={18} className="text-blue-600"/><h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Product Identity</h3></div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Product Name</label>
                                        <input className="w-full border p-3 rounded-lg text-sm font-semibold" value={formData.product_name} onChange={e => setFormData({...formData, product_name: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">SKU Code</label>
                                        <input className="w-full border p-3 rounded-lg text-sm font-mono bg-slate-50" readOnly value={formData.product_code} />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-6 border-b pb-2"><Scale size={18} className="text-amber-600"/><h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Specifications</h3></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <select className="w-full border p-3 rounded-lg text-sm" value={formData.packing_type_id} onChange={e => setFormData({...formData, packing_type_id: e.target.value})}>
                                        <option value="">Select Packing Type</option>
                                        {packingTypes.map(p => <option key={p.id} value={p.id}>{p.packing_type}</option>)}
                                    </select>
                                    <select className="w-full border p-3 rounded-lg text-sm" value={formData.tariff_id} onChange={e => setFormData({...formData, tariff_id: e.target.value})}>
                                        <option value="">Select Tariff (HSN)</option>
                                        {tariffs.map(t => <option key={t.id} value={t.id}>{t.tariff_name} - {t.tariff_no}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-emerald-900 rounded-xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
                                <ShieldCheck size={80} className="absolute -right-4 -top-4 opacity-10" />
                                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Mill Inventory Status</p>
                                <h1 className="text-6xl font-black mt-4">{formData.mill_stock || 0} <span className="text-xl">KG</span></h1>
                                <p className="text-[10px] text-emerald-300 mt-4 italic">Updated via Production & Sales Flow</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductMaster;