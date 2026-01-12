import React, { useState, useEffect } from 'react';
import { mastersAPI , transactionsAPI} from '../service/api';

const RG1Production = () => {
  const [form, setForm] = useState({ date: '', product_id: '', packing_type_id: '', production_kgs: 0, stock_bags: 0, stock_loose: 0 });
  const [masters, setMasters] = useState({ products: [], packing: [] });

  useEffect(() => {
    const loadLinkages = async () => {
      const [p, pack] = await Promise.all([
        mastersAPI.products.getAll(),
        mastersAPI.packingTypes.getAll()
      ]);
      setMasters({ products: p.data.data, packing: pack.data.data });
    };
    loadLinkages();
  }, []);

  const onSave = async () => {
    await transactionsAPI.production.create(form);
    alert("Production Entry Successful");
  };

  return (
    <div className="bg-white p-6 border-t-4 border-red-600 shadow-lg max-w-4xl mx-auto">
      <div className="bg-red-50 p-2 text-red-800 font-bold text-xs mb-6 uppercase">RG1 Production Entry</div>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold">DATE</label>
            <input type="date" className="border p-2 bg-gray-50" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold">SELECT PRODUCT (From Master)</label>
            <select className="border p-2 font-bold" value={form.product_id} onChange={e => setForm({...form, product_id: e.target.value})}>
              <option value="">Select Yarn Count</option>
              {masters.products.map(p => <option key={p.id} value={p.id}>{p.product_name}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold">PACKING TYPE</label>
            <select className="border p-2" value={form.packing_type_id} onChange={e => setForm({...form, packing_type_id: e.target.value})}>
              <option value="">Select Type</option>
              {masters.packing.map(pack => <option key={pack.id} value={pack.id}>{pack.packing_type}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 h-fit">
          <div className="bg-gray-100 p-4 border flex flex-col items-center">
            <span className="text-[9px] font-bold text-gray-500">PRODUCTION KGS</span>
            <input type="number" className="text-xl font-black w-full text-center bg-transparent border-b border-gray-400" value={form.production_kgs} onChange={e => setForm({...form, production_kgs: e.target.value})} />
          </div>
          <div className="bg-gray-100 p-4 border flex flex-col items-center">
            <span className="text-[9px] font-bold text-gray-500">STOCK BAGS</span>
            <input type="number" className="text-xl font-black w-full text-center bg-transparent border-b border-gray-400" value={form.stock_bags} onChange={e => setForm({...form, stock_bags: e.target.value})} />
          </div>
          <button onClick={onSave} className="col-span-2 bg-red-700 text-white font-bold py-3 mt-4 shadow-xl hover:bg-red-800 tracking-tighter">SUBMIT PRODUCTION RECORD</button>
        </div>
      </div>
    </div>
  );
};

export default RG1Production;