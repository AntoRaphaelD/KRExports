import React, { useState, useEffect } from 'react';
import { transactionsAPI } from '../service/api';
import { 
    ShieldCheck, UserCheck, Clock, CheckCircle, Search, 
    ArrowUpRight, AlertCircle, Eye, X, Package, AlertTriangle 
} from 'lucide-react';

const InvoiceApproval = () => {
    const [invoices, setInvoices] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedInvoice, setSelectedInvoice] = useState(null); // State for Eye view

    useEffect(() => { fetchPending(); }, []);

    const fetchPending = async () => {
        const res = await transactionsAPI.invoices.getAll();
        setInvoices((res.data.data || []).filter(inv => !inv.is_approved));
    };

    const handleApprove = async (id) => {
        if (!window.confirm("Authorize this transaction for Ledger Posting?")) return;
        try {
            await transactionsAPI.invoices.approve(id);
            alert("Invoice Authorized Successfully");
            fetchPending();
        } catch (err) { alert("Error approving"); }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Rejecting will DELETE this invoice and ADD quantity back to Mill Stock. Proceed?")) return;
        try {
            await transactionsAPI.invoices.reject(id);
            alert("Invoice Rejected & Stock Reverted");
            fetchPending();
        } catch (err) { alert("Error rejecting"); }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden text-slate-900">
            {/* VIEW MODAL (Triggered by Eye Icon) */}
            {selectedInvoice && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                            <div>
                                <h3 className="font-black uppercase tracking-tight">Invoice Details</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">REF: {selectedInvoice.invoice_no}</p>
                            </div>
                            <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
                        </div>
                        <div className="p-8">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                                    <tr>
                                        <th className="pb-3">Product SKU</th>
                                        <th className="pb-3 text-center">Weight (KG)</th>
                                        <th className="pb-3 text-right">Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {selectedInvoice.InvoiceDetails?.map((item, idx) => (
                                        <tr key={idx} className="text-sm font-bold">
                                            <td className="py-4 flex items-center gap-2">
                                                <Package size={14} className="text-slate-300"/>
                                                {item.Product?.product_name}
                                            </td>
                                            <td className="py-4 text-center font-mono text-indigo-600">{item.total_kgs}</td>
                                            <td className="py-4 text-right font-mono italic">₹{item.rate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase">Grand Total Value</p>
                                <p className="text-2xl font-black text-slate-900 font-mono">₹{selectedInvoice.final_invoice_value}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <header className="bg-white border-b px-8 py-6 flex justify-between items-center shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={24}/>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Post-Transaction Audit</h2>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span> {invoices.length} Pending Authorization
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input className="pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-xs font-bold w-64 outline-none" placeholder="Search queue..." onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto space-y-4">
                    {invoices.filter(i => i.Party?.account_name?.toLowerCase().includes(search.toLowerCase())).map(inv => (
                        <div key={inv.id} className="group bg-white rounded-3xl border p-2 pl-6 flex items-center justify-between hover:border-amber-200 hover:shadow-xl transition-all">
                            <div className="flex items-center gap-8 py-4">
                                <div className="p-3 bg-slate-50 rounded-2xl border text-center group-hover:bg-amber-50 transition-colors">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Issue Date</p>
                                    <p className="font-mono font-bold text-slate-700 text-sm">{inv.date}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-black text-slate-800 text-base uppercase">{inv.Party?.account_name}</h4>
                                        <ArrowUpRight size={14} className="text-slate-300" />
                                    </div>
                                    <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        <span className="text-blue-600 bg-blue-50 px-2 rounded-md">REF: {inv.invoice_no}</span>
                                        <span className="flex items-center gap-1"><Clock size={12}/> Pending Review</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 bg-slate-50 rounded-2xl p-4 border group-hover:bg-white group-hover:border-amber-100 transition-all">
                                <div className="text-right border-r pr-8">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Value</p>
                                    <p className="text-lg font-black text-slate-900 font-mono">₹{inv.final_invoice_value}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setSelectedInvoice(inv)}
                                        className="h-11 w-11 flex items-center justify-center bg-white text-slate-400 rounded-xl border hover:text-blue-600 transition-colors"
                                    >
                                        <Eye size={20}/>
                                    </button>
                                    <button 
                                        onClick={() => handleReject(inv.id)} 
                                        className="h-11 w-11 flex items-center justify-center bg-white text-red-400 rounded-xl border hover:bg-red-50 transition-colors"
                                        title="Reject Invoice"
                                    >
                                        <X size={20}/>
                                    </button>
                                    <button 
                                        onClick={() => handleApprove(inv.id)} 
                                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase hover:bg-emerald-600 transition-all shadow-md active:scale-95"
                                    >
                                        AUTHORIZE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {invoices.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 opacity-20">
                            <CheckCircle size={80} className="mb-4" />
                            <h3 className="text-3xl font-black uppercase">Queue Cleared</h3>
                        </div>
                    )}
                </div>
            </main>

            <footer className="h-10 bg-white border-t px-8 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase shrink-0">
                <div className="flex items-center gap-6">
                    <span><AlertCircle size={14} className="text-amber-500 inline mr-1" /> Secure Session</span>
                    <span>Audit Trail: Active</span>
                </div>
                <div className="bg-slate-900 text-white px-3 py-1 rounded-full text-[9px]">Authorization Level: ADMIN</div>
            </footer>
        </div>
    );
};

export default InvoiceApproval;