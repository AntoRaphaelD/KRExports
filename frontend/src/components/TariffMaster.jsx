import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';
import { Search, Save, Edit, Trash } from 'lucide-react';

const TariffMaster = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ tariff_code: '', tariff_name: '', tariff_no: '', product_type: '', commodity: '', fibre: '', yarn_type: '' });
  const [search, setSearch] = useState({ field: 'tariff_name', condition: 'Like', value: '' });

  useEffect(() => { handleSearch(); }, []);

  const handleSearch = async () => {
    const res = await mastersAPI.tariffs.getAll({ searchField: search.field, condition: search.condition, value: search.value });
    setRecords(res.data.data);
  };

  const onSave = async () => {
    await mastersAPI.tariffs.create(form);
    handleSearch();
    setForm({ tariff_code: '', tariff_name: '', tariff_no: '', product_type: '', commodity: '', fibre: '', yarn_type: '' });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border-t-4 border-blue-600 shadow-lg p-6">
        <h2 className="text-sm font-black text-blue-900 mb-4 uppercase">Tariff Sub Head Master</h2>
        <div className="grid grid-cols-4 gap-4">
          <input placeholder="Tariff Code" className="border p-2 text-sm" value={form.tariff_code} onChange={e => setForm({...form, tariff_code: e.target.value})} />
          <input placeholder="Tariff Name" className="border p-2 text-sm col-span-2" value={form.tariff_name} onChange={e => setForm({...form, tariff_name: e.target.value})} />
          <input placeholder="Tariff No (HSN)" className="border p-2 text-sm" value={form.tariff_no} onChange={e => setForm({...form, tariff_no: e.target.value})} />
          <input placeholder="Product Type" className="border p-2 text-sm" value={form.product_type} onChange={e => setForm({...form, product_type: e.target.value})} />
          <input placeholder="Commodity" className="border p-2 text-sm" value={form.commodity} onChange={e => setForm({...form, commodity: e.target.value})} />
          <input placeholder="Fibre" className="border p-2 text-sm" value={form.fibre} onChange={e => setForm({...form, fibre: e.target.value})} />
          <input placeholder="Yarn Type" className="border p-2 text-sm" value={form.yarn_type} onChange={e => setForm({...form, yarn_type: e.target.value})} />
          <button onClick={onSave} className="bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2"><Save size={14}/> UPDATE</button>
        </div>
      </div>

      <div className="bg-gray-100 p-2 border flex gap-2 rounded text-[10px] items-center">
         <Search size={12}/>
         <select value={search.field} onChange={e => setSearch({...search, field: e.target.value})} className="border">
            <option value="tariff_name">Tariff Name</option>
            <option value="tariff_no">HSN No</option>
         </select>
         <input placeholder="Search Value..." className="border px-2" value={search.value} onChange={e => setSearch({...search, value: e.target.value})} />
         <button onClick={handleSearch} className="bg-white border px-4 py-0.5 font-bold">Find</button>
      </div>

      <div className="bg-white border max-h-64 overflow-auto">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-slate-200 sticky top-0">
            <tr>
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">HSN</th>
              <th className="p-2 border">Yarn Type</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} className="hover:bg-blue-50 cursor-pointer">
                <td className="p-2 border">{r.tariff_code}</td>
                <td className="p-2 border">{r.tariff_name}</td>
                <td className="p-2 border">{r.tariff_no}</td>
                <td className="p-2 border">{r.yarn_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TariffMaster;