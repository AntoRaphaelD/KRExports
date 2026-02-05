import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';
import { 
    Save, Plus, Trash2, X, Search, User, 
    MapPin, Phone, Mail, Globe, Hash, 
    CreditCard, Building2, ChevronRight 
} from 'lucide-react';

const AccountMaster = () => {
    const [list, setList] = useState([]);
    const [formData, setFormData] = useState(initialState());
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    function initialState() {
        return {
            account_code: '', account_group: 'Sundry Debtors', account_name: '',
            place: '', address: '', pincode: '', state: '', delivery_address: '',
            tin_no: '', cst_no: '', ph_no: '', email: '', fax: '', website: '',
            account_no: '', contact_person: '', cell_no: '', gst_no: '',
            opening_credit: 0, opening_debit: 0
        };
    }

    useEffect(() => { fetchRecords(); }, []);

    const fetchRecords = async () => {
        try {
            const res = await mastersAPI.accounts.getAll();
            const data = res.data.data || [];
            setList(data);
            if (!formData.id) generateNextCode(data);
        } catch (err) { console.error(err); }
    };

    const generateNextCode = (currentList) => {
        const nextId = currentList.length > 0 ? Math.max(...currentList.map(i => i.id)) + 1 : 1;
        setFormData(prev => ({ ...prev, account_code: `${String(nextId)}` }));
    };

    const handleAddNew = () => {
        const reset = initialState();
        setFormData(reset);
        generateNextCode(list);
    };

    const handleSelect = (item) => setFormData(item);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData.account_name) return alert("Account Name Required");
        setLoading(true);
        try {
            formData.id ? await mastersAPI.accounts.update(formData.id, formData) : await mastersAPI.accounts.create(formData);
            fetchRecords();
            handleAddNew();
        } catch (err) { alert("Error saving"); } finally { setLoading(false); }
    };

    const filteredList = list.filter(item => 
        item.account_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
            <div className="flex flex-col bg-white border-r border-slate-200 w-96">
                <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">Accounts</h2>
                        <button onClick={handleAddNew} className="p-2 bg-blue-50 text-blue-600 rounded-lg shadow-sm"><Plus size={20} /></button>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredList.map((item) => (
                        <div key={item.id} onClick={() => handleSelect(item)} className={`p-4 border-b cursor-pointer transition-all ${formData.id === item.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'}`}>
                            <p className="font-semibold text-slate-700">{item.account_name}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                <span className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">{item.account_code}</span>
                                <span>•</span><span>{item.account_group}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><Building2 size={24} /></div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800">{formData.id ? 'Edit Profile' : 'New Account Entry'}</h1>
                            <p className="text-xs text-slate-500">Master Ledger Configuration</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-5 py-2 rounded-xl font-medium flex items-center gap-2 shadow-md">
                            <Save size={18} /> {loading ? 'Saving...' : 'Save Account'}
                        </button>
                        <button onClick={handleAddNew} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border p-6">
                            <div className="flex items-center gap-2 mb-6 text-slate-400 font-bold text-xs uppercase tracking-widest"><User size={18} /> General Information</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Account Code</label>
                                    <input name="account_code" value={formData.account_code} readOnly className="w-full border p-2.5 rounded-xl bg-slate-50 font-mono text-blue-600" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Account Group</label>
                                    <select name="account_group" value={formData.account_group} onChange={handleChange} className="w-full border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="Sundry Debtors">Sundry Debtors (Customers)</option>
                                        <option value="Sundry Creditors">Sundry Creditors (Suppliers)</option>
                                        <option value="Depot">Depot (Branch/Warehouse)</option>
                                        <option value="Bank Accounts">Bank Accounts</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Account Name *</label>
                                    <input name="account_name" value={formData.account_name} onChange={handleChange} className="w-full border p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl border p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-6 text-slate-400 font-bold text-xs uppercase tracking-widest"><MapPin size={18} /> Address Details</div>
                                <div className="space-y-4">
                                    <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Billing Address" rows="2" className="w-full border p-2.5 rounded-xl" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="place" value={formData.place} onChange={handleChange} placeholder="Place" className="w-full border p-2.5 rounded-xl" />
                                        <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="w-full border p-2.5 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-6 text-slate-400 font-bold text-xs uppercase tracking-widest"><Hash size={18} /> Tax & Financials</div>
                                <div className="space-y-4">
                                    <input name="gst_no" value={formData.gst_no} onChange={handleChange} placeholder="GST Number (22AAAAA...)" className="w-full border p-2.5 rounded-xl uppercase font-bold text-blue-700" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" name="opening_debit" value={formData.opening_debit} onChange={handleChange} placeholder="Op. Debit" className="w-full border p-2.5 rounded-xl text-red-600" />
                                        <input type="number" name="opening_credit" value={formData.opening_credit} onChange={handleChange} placeholder="Op. Credit" className="w-full border p-2.5 rounded-xl text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountMaster;