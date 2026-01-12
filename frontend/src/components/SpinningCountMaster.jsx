import React, { useState } from 'react';
import { mastersAPI } from '../service/api';

const SpinningCountMaster = () => {
  const [form, setForm] = useState({ count_name: '', conversion_factor_40s: 0 });

  const onSave = async () => {
    await mastersAPI.spinningCounts.create(form);
    alert("Spinning Count Added");
    setForm({ count_name: '', conversion_factor_40s: 0 });
  };

  return (
    <div className="bg-white p-10 max-w-lg mx-auto border shadow-xl">
      <h3 className="font-black text-blue-900 border-b-2 border-blue-900 pb-1 mb-6 text-sm">SPINNING COUNT CONFIGURATION</h3>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500">COUNT NAME (e.g. 67s C)</label>
          <input className="border p-2 text-sm font-bold" value={form.count_name} onChange={e => setForm({...form, count_name: e.target.value})} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500">40'S CONVERSION FACTOR</label>
          <input type="number" step="0.0001" className="border p-2 text-sm font-bold" value={form.conversion_factor_40s} onChange={e => setForm({...form, conversion_factor_40s: e.target.value})} />
        </div>
        <button onClick={onSave} className="w-full bg-blue-900 text-white font-bold py-3 text-xs tracking-widest shadow-lg">REGISTER COUNT</button>
      </div>
    </div>
  );
};

export default SpinningCountMaster;