import React, { useState, useEffect } from 'react';
import { mastersAPI, transactionsAPI } from '../service/api';
import { 
    Save, Plus, Trash2, X, Search, ShoppingCart, 
    PlusCircle, MinusCircle, ChevronRight, Calendar, 
    MapPin, User, Hash, ClipboardList, Info, CheckCircle, 
    Clock, AlertTriangle, LayoutGrid
} from 'lucide-react';

const SalesWithOrder = () => {
    // --- States ---
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("head");
    const [loading, setLoading] = useState(false);
    
    // Master Data
    const [parties, setParties] = useState([]);
    const [brokers, setBrokers] = useState([]);
    const [products, setProducts] = useState([]);

    // Form States
    const emptyHeader = {
        order_no: '',
        date: new Date().toISOString().split('T')[0],
        party_id: '', 
        broker_id: '', 
        place: '', 
        is_cancelled: false,
        is_with_order: true, 
        status: 'OPEN'
    };
    const [formData, setFormData] = useState(emptyHeader);
    const [gridRows, setGridRows] = useState([{ product_id: '', rate_cr: 0, rate_imm: 0, rate_per: 0, qty: 0, bag_wt: 0 }]);

    // --- Initialization ---
    useEffect(() => {
        fetchMasters();
        fetchOrders();
        generateNextOrderNo();
    }, []);

    const fetchMasters = async () => {
        try {
            const [p, b, pr] = await Promise.all([
                mastersAPI.accounts.getAll(),
                mastersAPI.brokers.getAll(),
                mastersAPI.products.getAll()
            ]);
            setParties(p.data.data || []);
            setBrokers(b.data.data || []);
            setProducts(pr.data.data || []);
        } catch (err) {
            console.error("Error fetching masters", err);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await transactionsAPI.orders.getAll();
            const openOrders = res.data.filter(o => o.is_with_order === true);
            setOrders(openOrders);
        } catch (err) {
            console.error("Error fetching orders", err);
        } finally {
            setLoading(false);
        }
    };

    const generateNextOrderNo = async () => {
        try {
            const res = await transactionsAPI.orders.getAll();
            const allRecords = res.data;
            let nextId = 1;
            if (allRecords && allRecords.length > 0) {
                const maxId = Math.max(...allRecords.map(o => o.id));
                nextId = maxId + 1;
            }
            setFormData(prev => ({ ...prev, order_no: `${nextId}` }));
        } catch (err) {
            console.error("Error generating Order No", err);
        }
    };

    // --- Action Handlers ---
    const handleAddNew = () => {
        setFormData(emptyHeader);
        setGridRows([{ product_id: '', rate_cr: 0, rate_imm: 0, rate_per: 0, qty: 0, bag_wt: 0 }]);
        setActiveTab("head");
        generateNextOrderNo();
    };

    const handleSelectOrder = (order) => {
        setFormData({ ...order });
        if (order.OrderDetails) setGridRows(order.OrderDetails);
        else setGridRows([{ product_id: '', rate_cr: 0, rate_imm: 0, rate_per: 0, qty: 0, bag_wt: 0 }]);
        setActiveTab("head");
    };

    const handleSave = async () => {
        if (!formData.party_id) return alert("Please select a Party/Customer");
        if (gridRows.length === 0 || !gridRows[0].product_id) return alert("Please add at least one product");
        
        setLoading(true);
        const payload = { ...formData, Details: gridRows };

        try {
            if (formData.id) {
                await transactionsAPI.orders.update(formData.id, payload);
            } else {
                await transactionsAPI.orders.create(payload);
            }
            alert("Order Processed Successfully");
            fetchOrders();
            handleAddNew();
        } catch (err) {
            alert("Error saving order: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Permanent Delete: Are you sure?")) return;
        try {
            await transactionsAPI.orders.delete(formData.id);
            fetchOrders();
            handleAddNew();
        } catch (err) {
            alert("Error deleting order");
        }
    };

    // --- Grid Logic ---
    const addRow = () => setGridRows([...gridRows, { product_id: '', rate_cr: 0, rate_imm: 0, rate_per: 0, qty: 0, bag_wt: 0 }]);
    const removeRow = (index) => {
        if (gridRows.length > 1) {
            setGridRows(gridRows.filter((_, i) => i !== index));
        }
    };
    const updateGrid = (index, field, value) => {
        const updated = [...gridRows];
        updated[index][field] = value;
        setGridRows(updated);
    };

    // Calculations
    const totalQty = gridRows.reduce((sum, row) => sum + (parseFloat(row.qty) || 0), 0);

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            
            {/* 1. SIDEBAR: LIST OF ORDERS */}
            <div className="w-80 flex flex-col bg-white border-r border-slate-200 shadow-xl z-20">
                <div className="p-5 bg-slate-900 text-white">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2">
                            <ClipboardList size={20} className="text-indigo-400" />
                            <h2 className="font-black text-sm uppercase tracking-widest">Order Registry</h2>
                        </div>
                        <button 
                            onClick={handleAddNew} 
                            className="p-1.5 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40"
                        >
                            <Plus size={18}/>
                        </button>
                    </div>
                    
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16}/>
                        <input 
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border-none rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                            placeholder="Find order or party..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {orders
                        .filter(o => o.order_no.toLowerCase().includes(search.toLowerCase()) || o.Party?.account_name.toLowerCase().includes(search.toLowerCase()))
                        .map(order => (
                        <div 
                            key={order.id} 
                            onClick={() => handleSelectOrder(order)} 
                            className={`group p-4 border-b border-slate-50 cursor-pointer transition-all ${
                                formData.id === order.id ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`font-black text-xs ${formData.id === order.id ? 'text-indigo-700' : 'text-slate-500'}`}>
                                    #{order.order_no}
                                </span>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                                    order.is_cancelled ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                    {order.is_cancelled ? 'Cancelled' : 'Open'}
                                </span>
                            </div>
                            <p className="text-xs font-bold text-slate-800 truncate mb-1 uppercase tracking-tight">
                                {order.Party?.account_name || 'No Party Assigned'}
                            </p>
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                                <span className="flex items-center gap-1"><Calendar size={10}/> {order.date}</span>
                                <span className="flex items-center gap-1"><MapPin size={10}/> {order.place}</span>
                            </div>
                        </div>
                    ))}
                    {!loading && orders.length === 0 && (
                        <div className="p-10 text-center text-slate-400 text-xs italic">No orders found.</div>
                    )}
                </div>
            </div>

            {/* 2. MAIN TRANSACTION INTERFACE */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* GLOBAL ACTION HEADER */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                            <ShoppingCart size={24}/>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                {formData.id ? 'Edit Confirmation' : 'New Sales Order'}
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={12} className="text-indigo-400"/> {new Date().toDateString()}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {formData.id && (
                            <button 
                                onClick={handleDelete} 
                                className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                title="Delete Order"
                            >
                                <Trash2 size={22}/>
                            </button>
                        )}
                        <button 
                            onClick={handleAddNew} 
                            className="p-2.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                            title="Reset Form"
                        >
                            <X size={22}/>
                        </button>
                        <div className="w-px h-8 bg-slate-200 mx-2"></div>
                        <button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                        >
                            <Save size={18}/> {loading ? 'SAVING...' : formData.id ? 'UPDATE CONFIRMATION' : 'FINALIZE ORDER'}
                        </button>
                    </div>
                </header>

                {/* FORM WORKSPACE */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    
                    {/* STEPPER / TABS */}
                    <div className="flex bg-white px-8 border-b border-slate-100">
                        <button 
                            onClick={() => setActiveTab('head')} 
                            className={`flex items-center gap-2 py-5 px-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                                activeTab === 'head' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <Info size={14}/> 01. Order Identity
                            {activeTab === 'head' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>}
                        </button>
                        <button 
                            onClick={() => setActiveTab('detail')} 
                            className={`flex items-center gap-2 py-5 px-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                                activeTab === 'detail' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <LayoutGrid size={14}/> 02. Product Selection
                            {activeTab === 'detail' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
                        <div className="max-w-6xl mx-auto">
                            {activeTab === 'head' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    
                                    {/* IDENTIFICATION CARD */}
                                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                                        <div className="flex items-center gap-2 mb-2 text-indigo-500 font-black text-[10px] uppercase tracking-widest">
                                            <Hash size={16}/> Basic Registration
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Order Number</label>
                                            <input 
                                                className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl font-black text-indigo-600 text-xl outline-none focus:bg-white focus:border-indigo-100 transition-all cursor-not-allowed" 
                                                value={formData.order_no} 
                                                readOnly 
                                            />
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Confirmation Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-4 text-slate-400" size={20} />
                                                <input 
                                                    type="date" 
                                                    className="w-full pl-12 bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-100 transition-all" 
                                                    value={formData.date} 
                                                    onChange={e => setFormData({...formData, date: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ENTITY SELECTION CARD */}
                                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                                        <div className="flex items-center gap-2 mb-2 text-indigo-500 font-black text-[10px] uppercase tracking-widest">
                                            <User size={16}/> Customer & Agency
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Select Party / Customer</label>
                                            <select 
                                                className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-100 transition-all appearance-none" 
                                                value={formData.party_id} 
                                                onChange={e => setFormData({...formData, party_id: e.target.value})}>
                                                <option value="">-- Choose Customer --</option>
                                                {parties.map(p => <option key={p.id} value={p.id}>{p.account_name}</option>)}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Delivery Destination</label>
                                                <input 
                                                    className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-100 transition-all" 
                                                    placeholder="City/Place"
                                                    value={formData.place} 
                                                    onChange={e => setFormData({...formData, place: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Assigned Broker</label>
                                                <select 
                                                    className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-100 transition-all" 
                                                    value={formData.broker_id} 
                                                    onChange={e => setFormData({...formData, broker_id: e.target.value})}>
                                                    <option value="">Direct Sales</option>
                                                    {brokers.map(b => <option key={b.id} value={b.id}>{b.broker_name}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative inline-flex items-center">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={formData.is_cancelled} 
                                                        onChange={e => setFormData({...formData, is_cancelled: e.target.checked})}
                                                    />
                                                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-red-600 transition-all">Cancel this order</span>
                                            </label>
                                            {formData.is_cancelled && <AlertTriangle size={18} className="text-red-500 animate-pulse" />}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* TRANSACTION GRID */
                                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-bottom duration-500">
                                    <div className="p-1 overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-slate-900 text-white text-[10px] uppercase font-black tracking-[0.2em]">
                                                    <th className="p-6 text-left">Product / Item Name</th>
                                                    <th className="p-6 text-center">Rate (CR)</th>
                                                    <th className="p-6 text-center">Rate (IMM)</th>
                                                    <th className="p-6 text-center">Unit</th>
                                                    <th className="p-6 text-center">Quantity</th>
                                                    <th className="p-6 text-center">Bag Wt</th>
                                                    <th className="p-6 text-center w-16"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {gridRows.map((row, index) => (
                                                    <tr key={index} className="hover:bg-slate-50 transition-all group">
                                                        <td className="p-4">
                                                            <select 
                                                                className="w-full text-xs font-bold p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                                                                value={row.product_id} 
                                                                onChange={e => updateGrid(index, 'product_id', e.target.value)}>
                                                                <option value="">Select SKU</option>
                                                                {products.map(p => <option key={p.id} value={p.id}>{p.product_name}</option>)}
                                                            </select>
                                                        </td>
                                                        <td className="p-4"><input type="number" className="w-24 mx-auto text-center font-bold border-none bg-slate-50 p-3 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500" value={row.rate_cr} onChange={e => updateGrid(index, 'rate_cr', e.target.value)}/></td>
                                                        <td className="p-4"><input type="number" className="w-24 mx-auto text-center font-bold border-none bg-slate-50 p-3 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500" value={row.rate_imm} onChange={e => updateGrid(index, 'rate_imm', e.target.value)}/></td>
                                                        <td className="p-4"><input type="number" className="w-16 mx-auto text-center border-none bg-slate-50 p-3 rounded-xl text-xs outline-none" value={row.rate_per} onChange={e => updateGrid(index, 'rate_per', e.target.value)}/></td>
                                                        <td className="p-4"><input type="number" className="w-24 mx-auto text-center font-black text-indigo-700 bg-indigo-50/50 p-3 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500" value={row.qty} onChange={e => updateGrid(index, 'qty', e.target.value)}/></td>
                                                        <td className="p-4"><input type="number" className="w-20 mx-auto text-center border-none bg-slate-50 p-3 rounded-xl text-xs outline-none" value={row.bag_wt} onChange={e => updateGrid(index, 'bag_wt', e.target.value)}/></td>
                                                        <td className="p-4 text-center">
                                                            <button 
                                                                onClick={() => removeRow(index)} 
                                                                className="p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                                                <MinusCircle size={20}/>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                                        <button 
                                            onClick={addRow} 
                                            className="px-8 py-3 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all rounded-xl shadow-sm border border-indigo-100">
                                            <PlusCircle size={18}/> Append Row
                                        </button>
                                        
                                        <div className="flex items-center gap-10">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Quantity</p>
                                                <p className="text-2xl font-black text-slate-800 tracking-tight">{totalQty.toFixed(2)} <span className="text-xs text-slate-400 uppercase">Unit</span></p>
                                            </div>
                                            <div className="h-10 w-px bg-slate-200"></div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active SKU</p>
                                                <p className="text-2xl font-black text-indigo-600 tracking-tight">{gridRows.filter(r => r.product_id).length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SYSTEM STATUS FOOTER */}
                <footer className="px-8 py-2.5 bg-slate-900 text-white flex justify-between items-center text-[9px] font-black tracking-widest uppercase shrink-0">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5 text-indigo-400"><CheckCircle size={10}/> System Online</span>
                        <span className="text-slate-600">|</span>
                        <span>Mode: {formData.id ? 'Modify Transaction' : 'New Entry'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                        <span>ERP v4.0.2</span>
                        <span>Operator: ADMIN_01</span>
                    </div>
                </footer>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default SalesWithOrder;