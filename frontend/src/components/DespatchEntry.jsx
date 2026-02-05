import React, { useState, useEffect } from 'react';
import { mastersAPI, transactionsAPI } from '../service/api';
import { Truck, Save, Clock, MapPin } from 'lucide-react';

const DespatchEntry = () => {
    const emptyState = { load_no: '', load_date: new Date().toISOString().split('T')[0], transport_id: '', lr_no: '', lr_date: '', vehicle_no: '', delivery_place: '', in_time: '', out_time: '', no_of_bags: 0, freight: 0, freight_per_bag: 0 };
    const [list, setList] = useState([]);
    const [transports, setTransports] = useState([]);
    const [formData, setFormData] = useState(emptyState);

    useEffect(() => {
        fetchRecords();
        mastersAPI.transports.getAll().then(res => setTransports(res.data.data));
    }, []);

    const fetchRecords = async () => {
        const res = await transactionsAPI.despatch.getAll();
        setList(res.data.data);
    };

    const handleSave = async () => {
        formData.id ? await transactionsAPI.despatch.update(formData.id, formData) : await transactionsAPI.despatch.create(formData);
        fetchRecords(); setFormData(emptyState);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-blue-900 flex items-center gap-3"><Truck size={32}/> DESPATCH ENTRY</h2>
                <div className="flex gap-2">
                    <button onClick={() => setFormData(emptyState)} className="bg-gray-200 px-4 py-2 rounded-lg font-bold">NEW LOAD</button>
                    <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold shadow-lg">SAVE DESPATCH</button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white p-8 rounded-2xl shadow-sm border space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Load No</label><input className="w-full border-b-2 p-2 font-bold" value={formData.load_no} onChange={e => setFormData({...formData, load_no: e.target.value})}/></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Load Date</label><input type="date" className="w-full border-b-2 p-2" value={formData.load_date} onChange={e => setFormData({...formData, load_date: e.target.value})}/></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Vehicle No</label><input className="w-full border-b-2 p-2 font-bold text-blue-600" value={formData.vehicle_no} onChange={e => setFormData({...formData, vehicle_no: e.target.value})}/></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Transport</label>
                        <select className="w-full border-b-2 p-2" value={formData.transport_id} onChange={e => setFormData({...formData, transport_id: e.target.value})}>
                            <option value="">Select Transport</option>
                            {transports.map(t => <option key={t.id} value={t.id}>{t.transport_name}</option>)}
                        </select></div>
                        <div><label className="text-xs font-bold text-gray-400 uppercase">Delivery Place</label>
                        <input className="w-full border-b-2 p-2" value={formData.delivery_place} onChange={e => setFormData({...formData, delivery_place: e.target.value})}/></div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 bg-blue-50 p-4 rounded-xl">
                        <div><label className="text-[10px] font-bold text-blue-800">LR NO</label><input className="w-full border-b border-blue-200 bg-transparent" value={formData.lr_no} onChange={e => setFormData({...formData, lr_no: e.target.value})}/></div>
                        <div><label className="text-[10px] font-bold text-blue-800">LR DATE</label><input type="date" className="w-full border-b border-blue-200 bg-transparent" value={formData.lr_date} onChange={e => setFormData({...formData, lr_date: e.target.value})}/></div>
                        <div><label className="text-[10px] font-bold text-blue-800 flex items-center gap-1"><Clock size={10}/> IN TIME</label><input className="w-full border-b border-blue-200 bg-transparent" value={formData.in_time} onChange={e => setFormData({...formData, in_time: e.target.value})}/></div>
                        <div><label className="text-[10px] font-bold text-blue-800 flex items-center gap-1"><Clock size={10}/> OUT TIME</label><input className="w-full border-b border-blue-200 bg-transparent" value={formData.out_time} onChange={e => setFormData({...formData, out_time: e.target.value})}/></div>
                    </div>
                </div>

                <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-center">
                    <h3 className="text-gray-400 font-bold text-xs mb-6 uppercase tracking-widest">Freight Calculation</h3>
                    <div className="space-y-6">
                        <div><label className="text-xs">No. of Bags</label><input type="number" className="w-full bg-transparent border-b border-gray-600 text-2xl font-bold" value={formData.no_of_bags} onChange={e => setFormData({...formData, no_of_bags: e.target.value})}/></div>
                        <div><label className="text-xs">Total Freight (Rs)</label><input type="number" className="w-full bg-transparent border-b border-gray-600 text-2xl font-bold text-green-400" value={formData.freight} onChange={e => setFormData({...formData, freight: e.target.value})}/></div>
                        <div className="pt-4 border-t border-gray-700"><p className="text-xs text-gray-400">Freight per Bag</p><p className="text-3xl font-black">₹ {formData.no_of_bags > 0 ? (formData.freight / formData.no_of_bags).toFixed(2) : '0.00'}</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DespatchEntry;