import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';
import { 
    Save, Plus, Search, BookOpen, 
    Hash, Tag, Box, Trash2, 
    ChevronRight, Filter, Info
} from 'lucide-react';

const TariffMaster = () => {
    const emptyState = { 
        tariff_code: '', 
        tariff_name: '', 
        tariff_no: '', 
        product_type: '', 
        commodity: '', 
        fibre: '', 
        yarn_type: '' 
    };

    const [list, setList] = useState([]);
    const [formData, setFormData] = useState(emptyState);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => { 
        fetchRecords(); 
    }, []);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const res = await mastersAPI.tariffs.getAll();
            const data = res.data.data || [];
            setList(data);
            // Generate code for new entry if we aren't currently editing an existing one
            if (!formData.id) generateNextCode(data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Logic to calculate the next numeric ID
    const generateNextCode = (currentList) => {
        const nextId = currentList.length > 0 ? Math.max(...currentList.map(i => i.id)) + 1 : 1;
        setFormData(prev => ({ ...prev, tariff_code: `${String(nextId)}` }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData.tariff_name || !formData.tariff_no) {
            return alert("Tariff Name and HSN No are required.");
        }
        
        setLoading(true);
        try {
            if (formData.id) {
                await mastersAPI.tariffs.update(formData.id, formData);
            } else {
                await mastersAPI.tariffs.create(formData);
            }
            alert("Tariff record saved successfully");
            fetchRecords(); 
            handleAddNew();
        } catch (err) {
            alert("Error saving tariff record");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!formData.id) return;
        if (window.confirm("Are you sure you want to delete this tariff?")) {
            try {
                await mastersAPI.tariffs.delete(formData.id);
                fetchRecords();
                handleAddNew();
            } catch (err) {
                alert("Error deleting record");
            }
        }
    };

    const handleAddNew = () => {
        setFormData(emptyState);
        generateNextCode(list); // Generate code for the fresh form
    };

    const filteredList = list.filter(i => 
        i.tariff_name.toLowerCase().includes(search.toLowerCase()) ||
        i.tariff_no.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            
            {/* SIDEBAR: TARIFF EXPLORER */}
            <div className="w-96 flex flex-col bg-white border-r border-slate-200 shadow-xl z-20">
                <div className="p-6 bg-slate-900 text-white">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <BookOpen size={20} />
                            </div>
                            <h2 className="font-black text-lg tracking-tight uppercase">Tariff Master</h2>
                        </div>
                        <button 
                            onClick={handleAddNew} 
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                            title="Add New"
                        >
                            <Plus size={20}/>
                        </button>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input 
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border-none rounded-xl text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                            placeholder="Search by HSN or Name..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading && list.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 text-sm italic">Loading records...</div>
                    ) : filteredList.length > 0 ? (
                        filteredList.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => setFormData(item)} 
                                className={`group p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 ${
                                    formData.id === item.id ? 'bg-blue-50/50 border-l-4 border-blue-600' : ''
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className={`font-bold text-sm uppercase ${formData.id === item.id ? 'text-blue-700' : 'text-slate-700'}`}>
                                            {item.tariff_name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase tracking-tighter">
                                                HSN: {item.tariff_no}
                                            </span>
                                            <span className="text-[10px] text-slate-400 italic">{item.product_type}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className={`text-slate-300 transition-transform ${formData.id === item.id ? 'text-blue-500 translate-x-1' : ''}`} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-slate-400 text-sm">No tariffs found.</div>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT: EDITOR */}
            <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
                {/* TOOLBAR */}
                <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Tariff Configuration</h1>
                        <p className="text-xl font-bold text-slate-800 tracking-tight">
                            {formData.id ? `Editing: ${formData.tariff_name}` : 'Setup New Tariff Entry'}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {formData.id && (
                            <button 
                                onClick={handleDelete}
                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <Trash2 size={22} />
                            </button>
                        )}
                        <button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {formData.id ? 'UPDATE CHANGES' : 'SAVE TARIFF'}
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10">
                    <div className="max-w-4xl mx-auto space-y-8">
                        
                        {/* IDENTIFICATION SECTION */}
                        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                            <div className="flex items-center gap-2 mb-8">
                                <Tag size={18} className="text-blue-500" />
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Primary Identification</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Tariff Head Name</label>
                                    <input 
                                        name="tariff_name"
                                        className="w-full border-b-2 border-slate-100 p-2 focus:border-blue-500 outline-none text-lg font-bold transition-colors placeholder:font-normal placeholder:text-slate-300" 
                                        placeholder="e.g. Cotton Yarn Dyed"
                                        value={formData.tariff_name} 
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Tariff / HSN No</label>
                                    <div className="relative">
                                        <Hash className="absolute right-2 top-2 text-slate-300" size={18} />
                                        <input 
                                            name="tariff_no"
                                            className="w-full border-b-2 border-slate-100 p-2 focus:border-blue-500 outline-none font-mono text-blue-600 font-bold tracking-widest transition-colors" 
                                            placeholder="5205"
                                            value={formData.tariff_no} 
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Internal Code</label>
                                    <input 
                                        name="tariff_code"
                                        className="w-full border-b-2 border-slate-100 p-2 focus:border-blue-500 outline-none transition-colors font-mono text-blue-600 bg-slate-50" 
                                        placeholder="T-001"
                                        value={formData.tariff_code} 
                                        readOnly // Set to readOnly as it's auto-generated
                                    />
                                </div>
                            </div>
                        </section>

                        {/* CLASSIFICATION SECTION ... (Rest of the UI remains the same) */}
                        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                            <div className="flex items-center gap-2 mb-8">
                                <Filter size={18} className="text-amber-500" />
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Product Classification</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Product Type</label>
                                    <input 
                                        name="product_type"
                                        className="w-full border-b-2 border-slate-100 p-2 focus:border-blue-500 outline-none transition-colors" 
                                        placeholder="Yarn / Fabric / Waste"
                                        value={formData.product_type} 
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Yarn Type</label>
                                    <input 
                                        name="yarn_type"
                                        className="w-full border-b-2 border-slate-100 p-2 focus:border-blue-500 outline-none transition-colors" 
                                        placeholder="Combed / Carded"
                                        value={formData.yarn_type} 
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Commodity</label>
                                    <input 
                                        name="commodity"
                                        className="w-full border-b-2 border-slate-100 p-2 focus:border-blue-500 outline-none transition-colors" 
                                        value={formData.commodity} 
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Fibre</label>
                                    <input 
                                        name="fibre"
                                        className="w-full border-b-2 border-slate-100 p-2 focus:border-blue-500 outline-none transition-colors" 
                                        value={formData.fibre} 
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="flex items-start gap-4 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                            <Info className="text-blue-500 shrink-0" size={20} />
                            <div>
                                <h4 className="text-xs font-black text-blue-900 uppercase mb-1">Taxation Info</h4>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Tariff Heads define how products are categorized for GST and Export reports. 
                                    Ensure the <strong>HSN No</strong> matches the latest GST Council notifications to prevent invoicing errors.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <style jsx>{`
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
        </div>
    );
};

export default TariffMaster;