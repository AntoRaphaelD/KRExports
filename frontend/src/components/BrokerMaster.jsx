import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';
import { 
    Save, Plus, Trash2, Search, X, 
    UserCheck, MapPin, Percent, CircleDollarSign, 
    ChevronRight, Briefcase, Info 
} from 'lucide-react';

const BrokerMaster = () => {
    const emptyState = { 
        broker_code: '', 
        broker_name: '', 
        address: '', 
        commission_pct: 0, 
        is_comm_per_kg: false 
    };

    const [list, setList] = useState([]);
    const [formData, setFormData] = useState(emptyState);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => { 
        fetchRecords(); 
    }, []);

    const fetchRecords = async () => {
        try {
            const res = await mastersAPI.brokers.getAll();
            const data = res.data.data || [];
            setList(data);
            // Generate code for new entry if we aren't currently editing an existing one
            if (!formData.id) generateNextCode(data);
        } catch (err) {
            console.error("Error fetching brokers", err);
        }
    };

    // Logic to calculate the next numeric ID
    const generateNextCode = (currentList) => {
        const nextId = currentList.length > 0 ? Math.max(...currentList.map(i => i.id)) + 1 : 1;
        setFormData(prev => ({ ...prev, broker_code: `${String(nextId)}` }));
    };

    const handleSave = async () => {
        if (!formData.broker_name) return alert("Please enter Broker Name");
        setLoading(true);
        try {
            if (formData.id) {
                await mastersAPI.brokers.update(formData.id, formData);
            } else {
                await mastersAPI.brokers.create(formData);
            }
            alert("Broker profile saved successfully");
            handleAddNew(); 
            fetchRecords();
        } catch (err) { 
            alert("Error saving record"); 
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!formData.id) return;
        if (!window.confirm("Are you sure you want to remove this broker from the system?")) return;
        try {
            await mastersAPI.brokers.delete(formData.id);
            handleAddNew(); 
            fetchRecords();
        } catch (err) {
            alert("Error deleting record");
        }
    };

    const handleAddNew = () => {
        setFormData(emptyState);
        generateNextCode(list); // Generate code for the fresh form
    };

    const filteredList = list.filter(i => 
        i.broker_name.toLowerCase().includes(search.toLowerCase()) ||
        i.broker_code?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            
            {/* SIDEBAR: BROKER LIST */}
            <div className="w-80 flex flex-col bg-white border-r border-slate-200 shadow-sm">
                <div className="p-5 border-b border-slate-100 bg-slate-900 text-white">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Briefcase size={20} className="text-blue-400" />
                            <h2 className="font-black text-sm uppercase tracking-widest">Brokers</h2>
                        </div>
                        <button 
                            onClick={handleAddNew} 
                            className="p-1.5 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
                        >
                            <Plus size={18}/>
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={16}/>
                        <input 
                            className="w-full pl-9 pr-4 py-2 bg-slate-800 border-none rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            placeholder="Search brokers..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredList.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => setFormData(item)} 
                            className={`group p-4 border-b border-slate-50 cursor-pointer transition-all ${
                                formData.id === item.id ? 'bg-blue-50 border-r-4 border-blue-600' : 'hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className={`font-bold text-xs uppercase ${formData.id === item.id ? 'text-blue-700' : 'text-slate-700'}`}>
                                        {item.broker_name}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 rounded">
                                            ID: {item.broker_code || 'N/A'}
                                        </span>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                                            {item.commission_pct}{item.is_comm_per_kg ? ' /Kg' : '%'}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight size={14} className={`text-slate-300 transition-transform ${formData.id === item.id ? 'text-blue-500 translate-x-1' : ''}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN WORKSPACE: EDITOR */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* HEADER */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-100 transition-colors">
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                {formData.id ? 'Edit Broker Profile' : 'Register New Broker'}
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commission & Contact Management</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                        >
                            <Save size={18}/> 
                            {loading ? 'PROCESSING...' : formData.id ? 'UPDATE BROKER' : 'SAVE BROKER'}
                        </button>
                        {formData.id && (
                            <button 
                                onClick={handleDelete} 
                                className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <Trash2 size={22}/>
                            </button>
                        )}
                        <div className="w-px h-8 bg-slate-200 mx-2"></div>
                        <button onClick={handleAddNew} className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
                            <X size={22}/>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
                    <div className="max-w-3xl mx-auto space-y-6">
                        
                        {/* SECTION 1: IDENTITY */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Info size={18} className="text-blue-500" />
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Primary Identity</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Broker Full Name</label>
                                    <input 
                                        className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none font-semibold bg-slate-50/50" 
                                        value={formData.broker_name} 
                                        onChange={e => setFormData({...formData, broker_name: e.target.value})}
                                        placeholder="e.g. Paramount Textiles & Agency"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Broker Code (Auto)</label>
                                    <input 
                                        className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none font-mono bg-slate-100 text-blue-600 cursor-not-allowed" 
                                        value={formData.broker_code} 
                                        readOnly
                                        title="This code is automatically generated"
                                        placeholder="Generating..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: COMMISSION LOGIC */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-8 pb-4">
                                <div className="flex items-center gap-2 mb-6">
                                    <CircleDollarSign size={18} className="text-emerald-500" />
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Commission Structure</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Commission Rate</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-3 text-slate-400">
                                                {formData.is_comm_per_kg ? <CircleDollarSign size={18}/> : <Percent size={18}/>}
                                            </div>
                                            <input 
                                                type="number" 
                                                className="w-full pl-10 border border-slate-200 p-3 rounded-xl text-lg font-black text-emerald-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50/50" 
                                                value={formData.commission_pct} 
                                                onChange={e => setFormData({...formData, commission_pct: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-slate-700">Rate Calculation Type</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">
                                                    {formData.is_comm_per_kg 
                                                        ? 'Fixed amount per net kilogram' 
                                                        : 'Percentage of total invoice value'}
                                                </p>
                                            </div>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer"
                                                    checked={formData.is_comm_per_kg} 
                                                    onChange={e => setFormData({...formData, is_comm_per_kg: e.target.checked})}
                                                />
                                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-8 py-3 bg-emerald-50/50 border-t border-emerald-100 flex items-center gap-2">
                                <Info size={14} className="text-emerald-600" />
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">
                                    Note: This rate will be automatically applied to all sales linked to this broker.
                                </span>
                            </div>
                        </div>

                        {/* SECTION 3: ADDRESS */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin size={18} className="text-slate-400" />
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact Details</h3>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Office Address</label>
                                <textarea 
                                    className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none bg-slate-50/50" 
                                    rows="4" 
                                    value={formData.address} 
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                    placeholder="Complete mailing address..."
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrokerMaster;