import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';

const BrokerMaster = () => {
  const [form, setForm] = useState({ broker_code: '', broker_name: '', address: '', commission_pct: 0 });
  
  const onSave = async () => {
    await mastersAPI.brokers.create(form);
    alert("Broker Details Saved");
    setForm({ broker_code: '', broker_name: '', address: '', commission_pct: 0 });
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 border-t-4 border-blue-500 shadow-2xl">
      <h2 className="bg-blue-600 text-white p-2 text-xs font-bold mb-6">Broker Master</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold w-32">Broker Code</label>
          <input className="border p-1 flex-1" value={form.broker_code} onChange={e => setForm({...form, broker_code: e.target.value})} />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold w-32">Broker Name</label>
          <input className="border p-1 flex-1" value={form.broker_name} onChange={e => setForm({...form, broker_name: e.target.value})} />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold w-32">Address</label>
          <textarea className="border p-1 flex-1 h-20" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold w-32">Commission %</label>
          <input type="number" className="border p-1 w-24" value={form.commission_pct} onChange={e => setForm({...form, commission_pct: e.target.value})} />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onSave} className="bg-blue-800 text-white px-10 py-2 text-xs font-bold hover:bg-blue-700">UPDATE</button>
        </div>
      </div>
    </div>
  );
};

export default BrokerMaster;