import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';
import { 
    Plus, Save, MapPin, Truck, Search, 
    ChevronRight, Navigation, Trash2, 
    Building, Hash, Info, X 
} from 'lucide-react';

const TransportMaster = () => {
    const emptyState = { 
        transport_code: '', 
        transport_name: '', 
        place: '', 
        address: '' 
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
            const res = await mastersAPI.transports.getAll();
            const data = res.data.data || [];
            setList(data);
            // If we are starting fresh (no ID), generate the next code
            if (!formData.id) generateNextCode(data);
        } catch (err) {
            console.error("Failed to load transports", err);
        } finally {
            setLoading(false);
        }
    };

    // Logic to calculate the next numeric ID
    const generateNextCode = (currentList) => {
        const nextId = currentList.length > 0 ? Math.max(...currentList.map(i => i.id)) + 1 : 1;
        setFormData(prev => ({ ...prev, transport_code: `${String(nextId)}` }));
    };

    const handleSave = async () => {
        if (!formData.transport_name) return alert("Please enter Transport Name");
        setLoading(true);
        try {
            if (formData.id) {
                await mastersAPI.transports.update(formData.id, formData);
            } else {
                await mastersAPI.transports.create(formData);
            }
            alert("Transport data synced successfully");
            fetchRecords(); 
            handleAddNew();
        } catch (err) {
            alert("Error updating database");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!formData.id) return;
        if (!window.confirm("Are you sure you want to remove this transporter?")) return;
        try {
            await mastersAPI.transports.delete(formData.id);
            fetchRecords();
            handleAddNew();
        } catch (err) {
            alert("Error deleting record");
        }
    };

    const handleAddNew = () => {
        setFormData(emptyState);
        generateNextCode(list); // Generate the next ID for the new form
    };

    const filteredList = list.filter(i => 
        i.transport_name.toLowerCase().includes(search.toLowerCase()) ||
        i.place?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            
            {/* SIDEBAR: TRANSPORTER DIRECTORY */}
            <div className="w-80 flex flex-col bg-white border-r border-slate-200 shadow-sm">
                <div className="p-5 bg-slate-900 text-white">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-500 rounded-lg">
                                <Truck size={18} />
                            </div>
                            <h2 className="font-black text-sm uppercase tracking-widest">Transports</h2>
                        </div>
                        <button 
                            onClick={handleAddNew} 
                            className="p-1.5 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
                        >
                            <Plus size={18}/>
                        </button>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16}/>
                        <input 
                            className="w-full pl-9 pr-4 py-2 bg-slate-800 border-none rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                            placeholder="Find by name or city..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredList.length > 0 ? (
                        filteredList.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => setFormData(item)} 
                                className={`group p-4 border-b border-slate-50 cursor-pointer transition-all ${
                                    formData.id === item.id ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className={`font-bold text-xs uppercase ${formData.id === item.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                                            {item.transport_name}
                                        </p>
                                        <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-500">
                                            <MapPin size={10} className={formData.id === item.id ? 'text-indigo-400' : ''}/>
                                            <p className="text-[10px] font-bold uppercase tracking-tighter">
                                                ID: {item.transport_code} • {item.place || 'Local'}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className={`mt-1 text-slate-300 transition-transform ${formData.id === item.id ? 'text-indigo-500 translate-x-1' : ''}`} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-slate-400 text-xs italic">No transporters found</div>
                    )}
                </div>
            </div>

            {/* MAIN WORKSPACE: PROFILE EDITOR */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* HEADER */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                            <Navigation size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                {formData.id ? 'Edit Transporter' : 'New Fleet Entry'}
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logistics & Route Management</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                        >
                            <Save size={18}/> 
                            {loading ? 'SAVING...' : formData.id ? 'UPDATE DATABASE' : 'SAVE TRANSPORT'}
                        </button>
                        {formData.id && (
                            <button 
                                onClick={handleDelete} 
                                className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                title="Delete Record"
                            >
                                <Trash2 size={22}/>
                            </button>
                        )}
                        <div className="w-px h-8 bg-slate-200 mx-2"></div>
                        <button 
                            onClick={handleAddNew} 
                            className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
                        >
                            <X size={22}/>
                        </button>
                    </div>
                </header>

                {/* FORM CONTENT */}
                <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
                    <div className="max-w-4xl mx-auto space-y-6">
                        
                        {/* CARD: PRIMARY DETAILS */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 transition-all hover:shadow-md">
                            <div className="flex items-center gap-2 mb-8 border-b border-slate-50 pb-4">
                                <Building size={18} className="text-indigo-500" />
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Transporter Identity</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Agency / Company Name</label>
                                    <input 
                                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-lg font-black text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none placeholder:font-normal placeholder:text-slate-300" 
                                        placeholder="Enter Transporter Name"
                                        value={formData.transport_name} 
                                        onChange={e => setFormData({...formData, transport_name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Transport Code (Auto)</label>
                                    <div className="relative group">
                                        <Hash className="absolute left-4 top-4 text-slate-300" size={18} />
                                        <input 
                                            className="w-full bg-slate-100 border border-slate-100 pl-10 p-4 rounded-2xl font-mono text-sm text-blue-600 outline-none transition-all uppercase cursor-not-allowed" 
                                            placeholder="TR-000"
                                            value={formData.transport_code} 
                                            readOnly
                                            title="This code is automatically generated"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CARD: LOGISTICS HUB */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 transition-all hover:shadow-md">
                            <div className="flex items-center gap-2 mb-8 border-b border-slate-50 pb-4">
                                <MapPin size={18} className="text-indigo-500" />
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Operations</h3>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="space-y-1 max-w-md">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Primary Hub / Place</label>
                                    <input 
                                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all uppercase" 
                                        placeholder="CITY NAME"
                                        value={formData.place} 
                                        onChange={e => setFormData({...formData, place: e.target.value})}
                                    />
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Registered Address</label>
                                    <textarea 
                                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all min-h-[120px]" 
                                        placeholder="Complete office or godown address..."
                                        value={formData.address} 
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* INFO BOX */}
                        <div className="flex items-start gap-4 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
                            <Info className="text-indigo-500 shrink-0 mt-0.5" size={18} />
                            <div>
                                <h4 className="text-xs font-black text-indigo-900 uppercase tracking-tighter mb-1">Logistics Note</h4>
                                <p className="text-[11px] text-indigo-700/80 leading-relaxed font-medium">
                                    Registered transporters will appear in the <strong>Delivery Challans</strong> and <strong>Sales Invoices</strong>. 
                                    Ensure the "Place" name is consistent with the city mentioned in your GST e-way bill settings for automated routing.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style jsx>{`
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
};

export default TransportMaster;