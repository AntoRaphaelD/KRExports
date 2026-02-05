import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

// SERVICES
import { mastersAPI, transactionsAPI, reportsAPI } from '../service/api';

// COMPONENTS
// import TaxInvoiceTemplate from '../components/print/TaxInvoiceTemplate';
import TaxInvoiceTemplate from '../print/TaxInvoiceTemplate';
// import fm from '../'
// ICONS
import { 
    Save, FileText, Printer, Search, ChevronRight, 
    ShoppingBag, Landmark, Database, MinusCircle, 
    PlusCircle, Calculator, RefreshCw, Truck, Info,
    CheckCircle2, X
} from 'lucide-react';

/**
 * UI HELPER: STOCK BADGE
 * Displays real-time Mill stock for the selected product
 */
const StockBadge = ({ qty }) => (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border mt-1 w-fit transition-all ${qty <= 0 ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
        <Database size={10} /> 
        <span className="text-[9px] font-black uppercase tracking-tight">Available: {qty} KG</span>
    </div>
);

const InvoicePreparation = () => {
    // --- UI STATES ---
    const [activeTab, setActiveTab] = useState('head');
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    
    // --- MASTER DATA STATES ---
    const [listData, setListData] = useState({ 
        types: [], parties: [], transports: [], 
        products: [], orders: [], history: [] 
    });

    // --- PRINTING LOGIC ---
    const [printData, setPrintData] = useState(null);
    const printRef = useRef();
    const handlePrintAction = useReactToPrint({ 
        contentRef: printRef,
        onAfterPrint: () => setPrintData(null)
    });

    // --- FORM STATES ---
    const emptyInvoice = {
        invoice_no: '', 
        date: new Date().toISOString().split('T')[0], 
        sales_type: 'Local',
        party_id: '', 
        transport_id: '', 
        vehicle_no: '', 
        delivery: '',
        remarks: '',
        assessable_value: 0, 
        final_invoice_value: 0
    };

    const [formData, setFormData] = useState(emptyInvoice);
    const [gridRows, setGridRows] = useState([{ 
        product_id: '', packs: 0, total_kgs: 0, rate: 0, available_stock: 0 
    }]);

    // --- INITIALIZATION ---
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [invT, acc, tra, pro, ord, his] = await Promise.all([
                mastersAPI.invoiceTypes.getAll(),
                mastersAPI.accounts.getAll(),
                mastersAPI.transports.getAll(),
                mastersAPI.products.getAll(),
                transactionsAPI.orders.getAll(),
                transactionsAPI.invoices.getAll()
            ]);

            const historyData = his.data.data || [];
            setListData({ 
                types: invT.data.data || [], 
                parties: acc.data.data || [], 
                transports: tra.data.data || [], 
                products: pro.data.data || [], 
                orders: ord.data.data || [], 
                history: historyData 
            });

            // Logic: Auto-generate Next Invoice ID if new entry
            if (!formData.id) {
                const maxId = historyData.length > 0 ? Math.max(...historyData.map(i => i.id)) : 0;
                setFormData(prev => ({ ...prev, invoice_no: (maxId + 1).toString() }));
            }
        } catch (error) {
            console.error("Failed to load master data", error);
        } finally {
            setLoading(false);
        }
    };

    // --- GRID UPDATES ---
    const updateGrid = (idx, field, val) => {
        const updated = [...gridRows];
        updated[idx][field] = val;

        if (field === 'product_id') {
            const product = listData.products.find(x => x.id === parseInt(val));
            updated[idx].available_stock = product ? product.mill_stock : 0;
        }

        setGridRows(updated);
        calculateFinalTotals(updated);
    };

    const calculateFinalTotals = (rows) => {
        const totalAssessable = rows.reduce((sum, r) => {
            return sum + ((parseFloat(r.total_kgs) || 0) * (parseFloat(r.rate) || 0));
        }, 0);

        setFormData(prev => ({ 
            ...prev, 
            assessable_value: totalAssessable.toFixed(2), 
            final_invoice_value: totalAssessable.toFixed(2) 
        }));
    };

    const addRow = () => {
        setGridRows([...gridRows, { product_id: '', packs: 0, total_kgs: 0, rate: 0, available_stock: 0 }]);
    };

    const removeRow = (idx) => {
        if (gridRows.length > 1) {
            const updated = gridRows.filter((_, i) => i !== idx);
            setGridRows(updated);
            calculateFinalTotals(updated);
        }
    };

    // --- LOGIC: ORDER PULLER ---
    const handleOrderPull = (orderId) => {
        if (!orderId) return;
        const order = listData.orders.find(o => o.id === parseInt(orderId));
        if (order) {
            setFormData(prev => ({
                ...prev,
                party_id: order.party_id,
                delivery: order.place
            }));

            if (order.OrderDetails) {
                const newRows = order.OrderDetails.map(d => ({
                    product_id: d.product_id,
                    packs: d.qty, // Assuming packs/qty mapping
                    total_kgs: d.qty,
                    rate: d.rate_cr,
                    available_stock: d.Product?.mill_stock || 0
                }));
                setGridRows(newRows);
                calculateFinalTotals(newRows);
            }
            setActiveTab('detail');
        }
    };

    // --- ACTIONS ---
    const handleSave = async () => {
        if (!formData.party_id) return alert("Please select a Party");
        setLoading(true);
        try {
            await transactionsAPI.invoices.create({ ...formData, Details: gridRows });
            alert("✅ Invoice Posted & Mill Stock Decremented!");
            setFormData(emptyInvoice);
            setGridRows([{ product_id: '', packs: 0, total_kgs: 0, rate: 0, available_stock: 0 }]);
            fetchInitialData();
            setActiveTab('head');
        } catch (e) {
            alert("❌ Save failed");
        } finally {
            setLoading(false);
        }
    };

    const triggerPrint = async (invoiceNo) => {
        if (!invoiceNo) return;
        setLoading(true);
        try {
            const res = await reportsAPI.getInvoicePrintData(invoiceNo.toString());
            if (res.data.success) {
                setPrintData(res.data.data);
                // Delay allows React to populate the hidden ref before printing
                setTimeout(() => handlePrintAction(), 700);
            }
        } catch (err) {
            console.error("Print Error", err);
            alert("Error fetching data for printer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            
            {/* 1. SIDEBAR: REGISTRY */}
            <div className="w-80 flex flex-col bg-white border-r shadow-xl z-20">
                <div className="p-6 bg-slate-900 text-white">
                    <div className="flex justify-between items-center mb-6 uppercase font-black text-[10px] tracking-widest">
                        <span className="flex items-center gap-2"><FileText size={16} className="text-blue-400"/> Billing Registry</span>
                        <RefreshCw size={14} className={`cursor-pointer ${loading ? 'animate-spin' : ''}`} onClick={fetchInitialData}/>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                        <input className="w-full pl-9 pr-4 py-2 bg-slate-800 border-none rounded-xl text-xs text-white" placeholder="Find Invoice No..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {listData.history?.filter(i => i.invoice_no.toLowerCase().includes(search.toLowerCase())).map(inv => (
                        <div key={inv.id} className="p-4 border-b hover:bg-white cursor-pointer group flex justify-between items-center transition-all">
                            <div>
                                <p className="text-[10px] font-black text-blue-600 uppercase">#{inv.invoice_no}</p>
                                <p className="text-[11px] font-bold text-slate-700 truncate w-32 uppercase">{inv.Party?.account_name}</p>
                                <p className="text-[9px] text-slate-400 font-mono">{inv.date}</p>
                            </div>
                            <button onClick={() => triggerPrint(inv.invoice_no)} className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 transition-all border rounded-lg">
                                <Printer size={16}/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. MAIN WORKSPACE */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-6">
                        <h1 className="text-lg font-black uppercase tracking-tight">Invoice Preparation</h1>
                        <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl border">
                            <TabBtn active={activeTab === 'head'} onClick={() => setActiveTab('head')} label="1. IDENTITY" />
                            <TabBtn active={activeTab === 'detail'} onClick={() => setActiveTab('detail')} label="2. ITEMS" />
                        </nav>
                    </div>
                    <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-black text-xs shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50">
                        {loading ? 'POSTING...' : 'POST INVOICE'}
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-8 flex gap-8 bg-slate-50/50">
                    <div className="flex-1 space-y-6">
                        {activeTab === 'head' ? (
                            <div className="grid grid-cols-2 gap-8 bg-white p-8 rounded-[2.5rem] border shadow-sm">
                                <div className="space-y-4">
                                    <SectionTitle icon={<Landmark size={14}/>} title="Registration" />
                                    <InputField label="Invoice Reference" value={formData.invoice_no} onChange={e => setFormData({...formData, invoice_no: e.target.value})} />
                                    <SelectField label="Party / Client" value={formData.party_id} options={listData.parties.map(p => ({value: p.id, label: p.account_name}))} isObject onChange={e => setFormData({...formData, party_id: e.target.value})} />
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Narration</label>
                                        <textarea className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-xs font-bold outline-none focus:bg-white" rows="3" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <SectionTitle icon={<Truck size={14}/>} title="Logistics" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <SelectField label="Transporter" value={formData.transport_id} options={listData.transports.map(t => ({value: t.id, label: t.transport_name}))} isObject onChange={e => setFormData({...formData, transport_id: e.target.value})} />
                                        <InputField label="Vehicle Number" value={formData.vehicle_no} onChange={e => setFormData({...formData, vehicle_no: e.target.value})} />
                                    </div>
                                    <InputField label="Delivery Destination" value={formData.delivery} onChange={e => setFormData({...formData, delivery: e.target.value})} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-blue-600 rounded-[2rem] p-6 text-white shadow-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag size={20} className="text-blue-200" />
                                        <div>
                                            <h3 className="font-black text-xs uppercase tracking-widest">Order Puller</h3>
                                            <p className="text-[9px] font-bold text-blue-200 uppercase">Import from Sales Confirmation</p>
                                        </div>
                                    </div>
                                    <select className="bg-white/10 border-2 border-white/10 p-3 rounded-xl font-bold text-xs text-white outline-none cursor-pointer" onChange={(e) => handleOrderPull(e.target.value)}>
                                        <option value="" className="text-slate-900">Select an Open Order...</option>
                                        {listData.orders.map(o => <option className="text-slate-900" key={o.id} value={o.id}>{o.order_no} | {o.Party?.account_name}</option>)}
                                    </select>
                                </div>

                                <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                                            <tr><th className="p-5">Finished Good SKU</th><th className="p-5">Kgs</th><th className="p-5">Rate</th><th className="p-5">Valuation</th><th className="p-5 w-10"></th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {gridRows.map((row, idx) => (
                                                <tr key={idx} className="group hover:bg-slate-50 transition-all">
                                                    <td className="p-4">
                                                        <select className="w-full border-none bg-slate-100/50 p-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500" value={row.product_id} onChange={e => updateGrid(idx, 'product_id', e.target.value)}>
                                                            <option value="">Choose Item...</option>
                                                            {listData.products.map(p => <option key={p.id} value={p.id}>{p.product_name}</option>)}
                                                        </select>
                                                        {row.available_stock !== undefined && <StockBadge qty={row.available_stock} />}
                                                    </td>
                                                    <td className="p-4"><input type="number" className="w-full bg-slate-100/50 p-3 rounded-xl text-xs font-black text-slate-700 outline-none focus:bg-white" value={row.total_kgs} onChange={e => updateGrid(idx, 'total_kgs', e.target.value)} /></td>
                                                    <td className="p-4"><input type="number" className="w-full bg-slate-100/50 p-3 rounded-xl text-xs font-black text-blue-600 outline-none focus:bg-white" value={row.rate} onChange={e => updateGrid(idx, 'rate', e.target.value)} /></td>
                                                    <td className="p-4 font-black text-sm">₹ {(row.total_kgs * row.rate).toFixed(2)}</td>
                                                    <td className="p-4"><MinusCircle className="text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-all" onClick={() => removeRow(idx)}/></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="p-5 bg-slate-50/50">
                                        <button onClick={addRow} className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-all"><PlusCircle size={16}/> Add Line Item</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-96 space-y-4">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col border border-slate-800">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Calculator size={120} /></div>
                            <h3 className="font-black text-blue-400 text-[10px] uppercase tracking-widest mb-10 border-b border-white/5 pb-4">Financial Ledger</h3>
                            <div className="space-y-6 relative z-10">
                                <LedgerRow label="Assessable Value" value={formData.assessable_value} />
                                <LedgerRow label="Tax / GST (0%)" value="0.00" color="text-slate-500" />
                                <div className="pt-8 mt-4 border-t border-white/10 text-center">
                                    <span className="text-[10px] font-black text-blue-400 uppercase mb-2 block tracking-widest">Net Payable</span>
                                    <div className="text-5xl font-black font-mono tracking-tighter">₹ {formData.final_invoice_value}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border border-blue-100 p-6 rounded-3xl flex items-start gap-3">
                            <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                            <div>
                                <h4 className="text-[10px] font-black uppercase">Live Sync</h4>
                                <p className="text-[11px] text-slate-500 font-medium">Posting will automatically reduce Mill inventory levels.</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* THE HIDDEN PRINT TEMPLATE (Off-screen) */}
            <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
                <TaxInvoiceTemplate ref={printRef} data={printData} />
            </div>
        </div>
    );
};

/* --- UI COMPONENTS --- */
const TabBtn = ({ active, onClick, label }) => (
    <button onClick={onClick} className={`px-8 py-2 rounded-lg text-[10px] font-black transition-all ${active ? 'bg-white text-blue-700 shadow-sm border' : 'text-slate-400 hover:text-slate-600'}`}>{label}</button>
);
const SectionTitle = ({ icon, title }) => (
    <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-widest mb-2">{icon} {title}</div>
);
const InputField = ({ label, value, onChange }) => (
    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase ml-1">{label}</label>
    <input className="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl text-xs font-bold outline-none focus:bg-white transition-all" value={value} onChange={onChange} /></div>
);
const SelectField = ({ label, value, options, onChange, isObject }) => (
    <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase ml-1">{label}</label>
    <select className="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl text-xs font-bold outline-none focus:bg-white appearance-none" value={value} onChange={onChange}>
        <option value="">Choose...</option>
        {options.map(opt => isObject ? <option key={opt.value} value={opt.value}>{opt.label}</option> : <option key={opt} value={opt}>{opt}</option>)}
    </select></div>
);
const LedgerRow = ({ label, value, color = "text-white" }) => (
    <div className="flex justify-between items-center text-xs font-bold"><span className="text-slate-400 font-black uppercase">{label}</span><span className={`${color} font-mono`}>₹ {value}</span></div>
);

export default InvoicePreparation;