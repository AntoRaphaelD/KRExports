import React, { useState, useEffect } from 'react';
import { mastersAPI, transactionsAPI } from '../service/api';

const DespatchEntry = () => {
  const [form, setForm] = useState({ load_no: '', transport_id: '', vehicle_no: '', lr_no: '', no_of_bags: 0, freight_total: 0 });
  const [transports, setTransports] = useState([]);

  useEffect(() => {
    mastersAPI.transports.getAll().then(res => setTransports(res.data.data));
  }, []);

  const onSave = async () => {
    await transactionsAPI.despatch.create(form);
    alert("Despatch Recorded");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-2xl rounded-lg border-t-8 border-blue-900">
      <h2 className="text-xl font-black text-blue-900 mb-6 uppercase border-b pb-2">Despatch Entry</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500">LOAD NO</label>
          <input className="border-b-2 focus:border-blue-500 outline-none p-1 font-bold" value={form.load_no} onChange={e => setForm({...form, load_no: e.target.value})} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500">TRANSPORT</label>
          <select className="border-b-2 p-1 font-bold bg-transparent" value={form.transport_id} onChange={e => setForm({...form, transport_id: e.target.value})}>
            <option>Select Transport</option>
            {transports.map(t => <option key={t.id} value={t.id}>{t.transport_name}</option>)}
          </select>
        </div>
        <input placeholder="VEHICLE NO" className="border p-2 bg-gray-50" onChange={e => setForm({...form, vehicle_no: e.target.value})} />
        <input placeholder="LR NO" className="border p-2 bg-gray-50" onChange={e => setForm({...form, lr_no: e.target.value})} />
        <input type="number" placeholder="NO OF BAGS" className="border p-2" onChange={e => setForm({...form, no_of_bags: e.target.value})} />
        <input type="number" placeholder="FREIGHT TOTAL" className="border p-2" onChange={e => setForm({...form, freight_total: e.target.value})} />
        <button onClick={onSave} className="col-span-2 bg-blue-900 text-white font-bold py-3 mt-4 hover:bg-blue-800 tracking-widest">UPDATE DESPATCH</button>
      </div>
    </div>
  );
};

export default DespatchEntry;