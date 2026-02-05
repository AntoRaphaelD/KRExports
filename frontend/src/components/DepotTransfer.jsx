import React, { useState, useEffect } from 'react';
import { mastersAPI, transactionsAPI } from '../service/api';
import { Truck, ArrowRightLeft, Warehouse, Send, AlertCircle, Calendar } from 'lucide-react';

export const DepotTransfer = () => {
    const [depots, setDepots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [transferData, setTransferData] = useState({
        from_depot_id: '',
        to_depot_id: '',
        vehicle_no: '',
        remarks: '',
        transfer_date: new Date().toISOString().split('T')[0]
    });

    // Fetch available Depots on mount
    useEffect(() => {
        const fetchDepots = async () => {
            try {
                const res = await mastersAPI.accounts.getAll();
                const allAccounts = res.data.data || [];
                // Filter only accounts belonging to the 'Depot' group
                const depotList = allAccounts.filter(acc => acc.account_group === 'Depot');
                setDepots(depotList);
            } catch (err) {
                console.error("Error fetching depots:", err);
            }
        };
        fetchDepots();
    }, []);

    const handleExecuteTransfer = async () => {
        const { from_depot_id, to_depot_id, vehicle_no } = transferData;

        // Final Validation
        if (!from_depot_id || !to_depot_id) {
            return alert("Please select both Source and Destination depots.");
        }

        if (!vehicle_no) {
            return alert("Please enter the Vehicle or LR Number.");
        }

        try {
            setLoading(true);
            await transactionsAPI.invoices.create({
                ...transferData,
                invoice_type: 'Depot Transfer',
                party_id: to_depot_id, // The receiving depot is the 'Party' for accounting
            });

            alert("✅ Depot Stock Transfer Executed Successfully");
            
            // Reset form
            setTransferData({
                from_depot_id: '',
                to_depot_id: '',
                vehicle_no: '',
                remarks: '',
                transfer_date: new Date().toISOString().split('T')[0]
            });
        } catch (err) {
            alert("❌ Error executing transfer: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 bg-slate-50 flex flex-col items-center min-h-screen font-sans text-slate-900">
            <div className="w-full max-w-4xl">
                
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-200">
                        <ArrowRightLeft className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight">Stock Transfer Engine</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inter-Depot Logistics Management</p>
                    </div>
                </div>

                <div className="bg-white shadow-2xl rounded-[2.5rem] p-10 border border-slate-100 overflow-hidden relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                        
                        {/* LEFT COLUMN: SOURCE & DESTINATION */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-[0.2em]">
                                <Warehouse size={16} /> Movement Details
                            </div>

                            {/* FROM SLOT (Excludes TO Depot) */}
                            <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 transition-all focus-within:ring-4 focus-within:ring-red-100">
                                <label className="text-[10px] font-black text-red-400 block mb-3 uppercase tracking-widest ml-1">
                                    From (Source Location)
                                </label>
                                <select 
                                    className="w-full bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
                                    value={transferData.from_depot_id}
                                    onChange={(e) => setTransferData({...transferData, from_depot_id: e.target.value})}
                                >
                                    <option value="">Select Source Depot...</option>
                                    {depots
                                        .filter(d => d.id.toString() !== transferData.to_depot_id)
                                        .map(d => (
                                            <option key={d.id} value={d.id}>{d.account_name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* TO SLOT (Excludes FROM Depot) */}
                            <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 transition-all focus-within:ring-4 focus-within:ring-emerald-100">
                                <label className="text-[10px] font-black text-emerald-400 block mb-3 uppercase tracking-widest ml-1">
                                    To (Destination Location)
                                </label>
                                <select 
                                    className="w-full bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
                                    value={transferData.to_depot_id}
                                    onChange={(e) => setTransferData({...transferData, to_depot_id: e.target.value})}
                                >
                                    <option value="">Select Destination Depot...</option>
                                    {depots
                                        .filter(d => d.id.toString() !== transferData.from_depot_id)
                                        .map(d => (
                                            <option key={d.id} value={d.id}>{d.account_name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                                <AlertCircle size={18} className="text-blue-500 mt-0.5" />
                                <p className="text-[10px] font-medium text-blue-700 leading-relaxed uppercase">
                                    Constraint: The list is dynamically filtered. You cannot select the same source and destination.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: LOGISTICS */}
                        <div className="bg-slate-900 text-white p-10 rounded-[3rem] flex flex-col justify-between shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Truck size={120} />
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                                    <Truck size={16} /> Logistics manifest
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Vehicle / LR Number</label>
                                    <input 
                                        className="w-full bg-white/5 border-b-2 border-slate-700 p-3 outline-none font-bold text-xl focus:border-amber-500 transition-colors uppercase" 
                                        placeholder="e.g. TN 88 C 1158"
                                        value={transferData.vehicle_no}
                                        onChange={(e) => setTransferData({...transferData, vehicle_no: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Transfer Date</label>
                                    <div className="flex items-center gap-2 bg-white/5 border-b-2 border-slate-700 p-3">
                                        <Calendar size={16} className="text-slate-500" />
                                        <input 
                                            type="date"
                                            className="w-full bg-transparent outline-none font-bold text-lg focus:text-white" 
                                            value={transferData.transfer_date}
                                            onChange={(e) => setTransferData({...transferData, transfer_date: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleExecuteTransfer}
                                disabled={loading}
                                className="w-full bg-amber-500 text-slate-900 py-5 rounded-2xl font-black uppercase tracking-[0.1em] mt-10 hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                <Send size={18} />
                                {loading ? "Executing..." : "Execute Transfer"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepotTransfer;
