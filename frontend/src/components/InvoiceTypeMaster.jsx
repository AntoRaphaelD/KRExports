import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';
import { 
    Save, Plus, Trash2, X, Search, Calculator, 
    Percent, ShieldCheck, Truck, ChevronRight, 
    Settings2, Landmark, Receipt, FileJson 
} from 'lucide-react';

const InvoiceTypeMaster = () => {
    const emptyState = {
        code: '', is_option_ii: false, type_name: '', sales_type: '', group_name: '', round_off_digits: 2, debit_acc: '', credit_acc: '',
        assess_formula: '', assess_acc_name: '',
        is_charity_enabled: false, charity_rate: 0, charity_formula: '', charity_acc: '',
        vat_enabled: false, vat_val: 0, vat_formula: '', vat_dr: '', vat_cr: '',
        duty_enabled: false, duty_val: 0, duty_formula: '', duty_dr: '', duty_cr: '',
        cess_enabled: false, cess_val: 0, cess_formula: '', cess_dr: '', cess_cr: '',
        tcs_enabled: false, tcs_val: 0, tcs_formula: '', tcs_dr: '', tcs_cr: '',
        is_gst_enabled: true, is_igst_enabled: false, igst_pct: 0, igst_formula: '', igst_output_acc: '',
        sgst_acc: '', cgst_acc: '', sgst_pct: 0, cgst_pct: 0,
        sub_total_formula: '', total_value_formula: '',
        round_off: 0, round_off_type: 'Forward', round_off_acc: '',
        lorry_freight: 0, freight_acc: '', is_acc_posting: true
    };

    const [list, setList] = useState([]);
    const [formData, setFormData] = useState(emptyState);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchRecords(); }, []);

    const fetchRecords = async () => {
        try {
            const res = await mastersAPI.invoiceTypes.getAll();
            const data = res.data.data || [];
            setList(data);
            // Generate code for new entry if we aren't currently editing an existing one
            if (!formData.id) generateNextCode(data);
        } catch (err) { console.error("Fetch error", err); }
    };

    // Logic to calculate the next numeric ID
    const generateNextCode = (currentList) => {
        const nextId = currentList.length > 0 ? Math.max(...currentList.map(i => i.id || 0)) + 1 : 1;
        setFormData(prev => ({ ...prev, code: `${String(nextId)}` }));
    };

    const handleSave = async () => {
        if (!formData.type_name) return alert("Please enter Invoice Type Name");
        setLoading(true);
        try {
            if (formData.id) await mastersAPI.invoiceTypes.update(formData.id, formData);
            else await mastersAPI.invoiceTypes.create(formData);
            alert("Configuration Synced Successfully");
            handleAddNew(); fetchRecords();
        } catch (err) { alert("Error saving configuration"); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        if (!formData.id) return;
        if (window.confirm("Delete this invoice configuration? This may affect existing transactions.")) {
            await mastersAPI.invoiceTypes.delete(formData.id);
            handleAddNew(); fetchRecords();
        }
    };

    const handleAddNew = () => {
        setFormData(emptyState);
        generateNextCode(list);
    };

    // Optimized Components for high-density forms
    const InputField = ({ label, name, type = "text", isFormula = false, readOnly = false }) => (
        <div className="flex flex-col">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1 ml-0.5">{label}</label>
            <input 
                type={type} 
                readOnly={readOnly}
                className={`w-full border border-slate-200 p-2 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all 
                    ${isFormula ? 'font-mono bg-slate-50 text-blue-700' : 'bg-white'} 
                    ${readOnly ? 'cursor-not-allowed bg-slate-100 text-blue-600 font-mono' : ''}`}
                value={formData[name] || ''} 
                onChange={e => !readOnly && setFormData({...formData, [name]: e.target.value})}
            />
        </div>
    );

    const Toggle = ({ label, name }) => (
        <label className="flex items-center justify-between group cursor-pointer p-1">
            <span className="text-[11px] font-bold text-slate-600 group-hover:text-indigo-600 transition-colors uppercase">{label}</span>
            <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={formData[name] || false} 
                onChange={e => setFormData({...formData, [name]: e.target.checked})} />
                <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
        </label>
    );

    return (
        <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
            
            {/* LEFT SIDEBAR */}
            <div className="w-80 flex flex-col bg-white border-r border-slate-200 shadow-xl">
                <div className="p-5 bg-slate-900 text-white">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Settings2 size={18} className="text-indigo-400" />
                            <h2 className="font-black text-xs uppercase tracking-widest">Invoicing Engine</h2>
                        </div>
                        <button onClick={handleAddNew} className="p-1.5 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all">
                            <Plus size={16}/>
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                        <input 
                            className="w-full pl-9 pr-4 py-2 bg-slate-800 border-none rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none" 
                            placeholder="Filter types..." 
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {list.filter(i => i.type_name.toLowerCase().includes(search.toLowerCase())).map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => setFormData(item)} 
                            className={`p-4 border-b border-slate-50 cursor-pointer transition-all flex justify-between items-center ${
                                formData.id === item.id ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'hover:bg-slate-50'
                            }`}
                        >
                            <div>
                                <p className={`font-bold text-[11px] uppercase ${formData.id === item.id ? 'text-indigo-700' : 'text-slate-600'}`}>
                                    {item.type_name}
                                </p>
                                <p className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {item.code || 'NO-CODE'}</p>
                            </div>
                            <ChevronRight size={14} className={formData.id === item.id ? 'text-indigo-400' : 'text-slate-200'} />
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* TOOLBAR */}
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                            <Calculator size={20} />
                        </div>
                        <h1 className="text-lg font-black text-slate-800 tracking-tight uppercase">
                            {formData.id ? 'Edit Configuration' : 'Create New Engine'}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-black text-[11px] shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                        >
                            <Save size={16}/> {formData.id ? 'UPDATE ENGINE' : 'SAVE ENGINE'}
                        </button>
                        {formData.id && (
                            <button onClick={handleDelete} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                <Trash2 size={20}/>
                            </button>
                        )}
                        <button onClick={handleAddNew} className="p-2 text-slate-300 hover:text-slate-600 rounded-lg transition-all">
                            <X size={20}/>
                        </button>
                    </div>
                </header>

                {/* SCROLLABLE FORM GRID */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* COLUMN 1: IDENTITY & POSTING */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <ShieldCheck size={16}/> Identity & Posting
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField label="Identifier Code" name="code" readOnly={true} />
                                        <div className="pt-4"><Toggle label="Option II Mode" name="is_option_ii" /></div>
                                    </div>
                                    <InputField label="Invoice Description" name="type_name" />
                                    <InputField label="Sales Classification" name="sales_type" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField label="Account Group" name="group_name" />
                                        <InputField label="Round Digits" name="round_off_digits" type="number" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <InputField label="Debit Ledger" name="debit_acc" />
                                        <InputField label="Credit Ledger" name="credit_acc" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                                <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Landmark size={16}/> Assessable & Charity
                                </h3>
                                <div className="space-y-4">
                                    <InputField label="Assessing Formula" name="assess_formula" isFormula={true} />
                                    <InputField label="Assessing Posting A/c" name="assess_acc_name" />
                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <Toggle label="Enable Charity Logic" name="is_charity_enabled" />
                                        {formData.is_charity_enabled && (
                                            <div className="grid grid-cols-2 gap-4 mt-4 animate-in fade-in duration-300">
                                                <InputField label="Rate/Kg" name="charity_rate" type="number" />
                                                <InputField label="Formula" name="charity_formula" isFormula={true} />
                                                <div className="col-span-2">
                                                    <InputField label="Charity Ledger" name="charity_acc" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2: REGULATORY (GST & DUTIES) */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                                <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Percent size={16}/> GST Configuration
                                </h3>
                                <div className="space-y-4">
                                    <Toggle label="Apply GST Logic" name="is_gst_enabled" />
                                    <div className="p-4 bg-emerald-50 rounded-xl space-y-4">
                                        <Toggle label="Inter-State (IGST)" name="is_igst_enabled" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <InputField label="IGST %" name="igst_pct" type="number" />
                                            <InputField label="IGST Formula" name="igst_formula" isFormula={true} />
                                        </div>
                                        <InputField label="IGST Output Ledger" name="igst_output_acc" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <InputField label="SGST %" name="sgst_pct" type="number" />
                                        <InputField label="CGST %" name="cgst_pct" type="number" />
                                        <InputField label="SGST Ledger" name="sgst_acc" />
                                        <InputField label="CGST Ledger" name="cgst_acc" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Additional Duties</h3>
                                <div className="space-y-4">
                                    {['VAT', 'Duty', 'Cess', 'TCS'].map((tax) => {
                                        const low = tax.toLowerCase();
                                        return (
                                            <div key={tax} className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                                <div className="flex justify-between items-center mb-3">
                                                    <Toggle label={tax} name={`${low}_enabled`} />
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-slate-400">VAL</span>
                                                        <input className="w-12 border-b border-slate-200 bg-transparent text-xs font-bold text-center outline-none focus:border-indigo-500" value={formData[`${low}_val`] || ''} onChange={e => setFormData({...formData, [`${low}_val`]: e.target.value})} />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input className="bg-white border border-slate-200 rounded p-1.5 text-[10px] outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Dr Account" value={formData[`${low}_dr`] || ''} onChange={e => setFormData({...formData, [`${low}_dr`]: e.target.value})} />
                                                    <input className="bg-white border border-slate-200 rounded p-1.5 text-[10px] outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Cr Account" value={formData[`${low}_cr`] || ''} onChange={e => setFormData({...formData, [`${low}_cr`]: e.target.value})} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 3: FORMULAS & FREIGHT */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                                <h3 className="text-[11px] font-black text-purple-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <FileJson size={16}/> Final Calculations
                                </h3>
                                <div className="space-y-5">
                                    <InputField label="Sub-Total Calculation" name="sub_total_formula" isFormula={true} />
                                    <InputField label="Net Invoice Value" name="total_value_formula" isFormula={true} />
                                    
                                    <div className="pt-5 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rounding Mode</span>
                                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                                {['Forward', 'Reverse'].map(type => (
                                                    <button 
                                                        key={type}
                                                        onClick={() => setFormData({...formData, round_off_type: type})}
                                                        className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${formData.round_off_type === type ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                                                    >
                                                        {type.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <InputField label="Round-Off Ledger" name="round_off_acc" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                                <h3 className="text-[11px] font-black text-rose-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Truck size={16}/> Freight & Logistics
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField label="Lorry Freight Rate" name="lorry_freight" type="number" />
                                        <InputField label="Freight Ledger" name="freight_acc" />
                                    </div>
                                    <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                                        <Toggle label="Auto-Post to Ledgers" name="is_acc_posting" />
                                        <p className="text-[9px] text-rose-400 mt-2 italic font-medium leading-tight">
                                            If disabled, this invoice type will only generate documents without affecting account balances.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
            <style jsx>{`
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default InvoiceTypeMaster;