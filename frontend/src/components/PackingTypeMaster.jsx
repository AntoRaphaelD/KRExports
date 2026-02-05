import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';
import { 
    Plus, Save, Trash2, Package, Search, 
    ChevronRight, Info, LayoutGrid, X, Hash 
} from 'lucide-react';

const PackingTypeMaster = () => {

    const emptyState = { id: null, packing_code: '', packing_type: '' };

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
            const res = await mastersAPI.packingTypes.getAll();
            const data = res.data.data || [];
            setList(data);

            // ✅ Generate next code only when creating new
            if (!formData.id) {
                generateNextCode(data);
            }
        } catch (err) {
            console.error("Error fetching packing types", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Generate next numeric code safely
    const generateNextCode = (currentList) => {
        const nextId =
            currentList.length > 0
                ? Math.max(...currentList.map(i => Number(i.packing_code || i.id))) + 1
                : 1;

        setFormData(prev => ({
            ...prev,
            packing_code: String(nextId)
        }));
    };

    const handleSave = async () => {
        if (!formData.packing_type.trim()) {
            alert("Please enter a Packing Type description");
            return;
        }

        setLoading(true);
        try {
            if (formData.id) {
                await mastersAPI.packingTypes.update(formData.id, formData);
            } else {
                await mastersAPI.packingTypes.create(formData);
            }

            alert("Packing configuration saved");
            handleAddNew();
            fetchRecords();
        } catch (err) {
            alert("Error saving packing type");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!formData.id) return;

        if (!window.confirm("Delete this packing configuration?")) return;

        try {
            await mastersAPI.packingTypes.delete(formData.id);
            handleAddNew();
            fetchRecords();
        } catch (err) {
            alert("Error deleting record");
        }
    };

    // ✅ Reset form AND regenerate next ID
    const handleAddNew = () => {
        setFormData(emptyState);
        generateNextCode(list);
    };

    const filteredList = list.filter(i =>
        i.packing_type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* SIDEBAR */}
            <div className="w-96 flex flex-col bg-white border-r border-slate-200 shadow-sm">
                <div className="p-6 bg-slate-900 text-white">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-500 rounded-lg">
                                <Package size={20} />
                            </div>
                            <h2 className="font-black text-sm uppercase tracking-widest">
                                Packing Types
                            </h2>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 rounded-xl text-xs text-white"
                            placeholder="Search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredList.map(item => (
                        <div
                            key={item.id}
                            onClick={() => setFormData(item)}
                            className={`p-4 rounded-xl cursor-pointer flex justify-between items-center ${
                                formData.id === item.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white hover:bg-slate-50'
                            }`}
                        >
                            <div>
                                <p className="font-bold">{item.packing_type}</p>
                                <p className="text-xs opacity-70">
                                    ID: {item.packing_code || item.id}
                                </p>
                            </div>
                            <ChevronRight size={16} />
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN FORM */}
            <div className="flex-1 flex items-center justify-center p-12">
                <div className="w-full max-w-xl bg-white p-10 rounded-3xl shadow-xl">

                    <div className="flex justify-end gap-3 mb-6">
                        {formData.id && (
                            <button onClick={handleDelete} className="text-red-500">
                                <Trash2 />
                            </button>
                        )}
                        <button onClick={handleAddNew}>
                            <X />
                        </button>
                    </div>

                    {/* PACKING CODE */}
                    <label className="text-xs font-bold text-slate-400">
                        Packing Identifier (Auto)
                    </label>
                    <div className="relative mb-6">
                        <Hash className="absolute left-3 top-4 text-slate-400" />
                        <input
                            className="w-full pl-10 p-4 rounded-xl bg-slate-100 font-mono font-bold text-indigo-600"
                            value={formData.packing_code}
                            readOnly
                        />
                    </div>

                    {/* PACKING TYPE */}
                    <label className="text-xs font-bold text-slate-400">
                        Packing Description
                    </label>
                    <input
                        className="w-full p-4 rounded-xl border text-lg font-bold mb-8"
                        placeholder="e.g. BOX, BAG, CONE"
                        value={formData.packing_type}
                        onChange={e =>
                            setFormData({ ...formData, packing_type: e.target.value })
                        }
                    />

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold"
                    >
                        {loading
                            ? 'SAVING...'
                            : formData.id
                            ? 'UPDATE'
                            : 'SAVE'}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default PackingTypeMaster;
