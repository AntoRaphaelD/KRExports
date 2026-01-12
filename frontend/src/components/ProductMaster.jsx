import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';
import { Search, Save, X, Plus } from 'lucide-react';

const ProductMaster = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ product_code: '', product_name: '', tariff_id: '', packing_type_id: '', spinning_count_id: '', wt_per_cone: 0, no_of_cones: 0, charity_rs: 0 });
  const [masters, setMasters] = useState({ tariffs: [], packing: [], counts: [] });
  const [search, setSearch] = useState({ field: 'product_name', condition: 'Like', value: '' });

  useEffect(() => {
    loadDropdowns();
    handleSearch();
  }, []);

  const loadDropdowns = async () => {
    const [t, p, c] = await Promise.all([
      mastersAPI.tariffs.getAll(),
      mastersAPI.packingTypes.getAll(),
      mastersAPI.spinningCounts.getAll()
    ]);
    setMasters({ tariffs: t.data.data, packing: p.data.data, counts: c.data.data });
  };

  const handleSearch = async () => {
    const res = await mastersAPI.products.getAll({ searchField: search.field, condition: search.condition, value: search.value });
    setRecords(res.data.data);
  };

  const onSave = async () => {
    await mastersAPI.products.create(form);
    handleSearch();
    setForm({ product_code: '', product_name: '', tariff_id: '', packing_type_id: '', spinning_count_id: '', wt_per_cone: 0, no_of_cones: 0, charity_rs: 0 });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="bg-white p-6 rounded shadow-lg border-t-4 border-blue-600">
        <h2 className="text-blue-800 font-bold mb-4 flex items-center gap-2">Product Master</h2>
        <div className="grid grid-cols-3 gap-4">
          <input placeholder="Product Code" className="border p-2" value={form.product_code} onChange={e => setForm({...form, product_code: e.target.value})} />
          <input placeholder="Product Name" className="border p-2 col-span-2" value={form.product_name} onChange={e => setForm({...form, product_name: e.target.value})} />
          
          <select className="border p-2" value={form.tariff_id} onChange={e => setForm({...form, tariff_id: e.target.value})}>
            <option value="">Select Tariff (HSN)</option>
            {masters.tariffs.map(t => <option key={t.id} value={t.id}>{t.tariff_name} [{t.tariff_no}]</option>)}
          </select>

          <select className="border p-2" value={form.spinning_count_id} onChange={e => setForm({...form, spinning_count_id: e.target.value})}>
            <option value="">Select Spinning Count</option>
            {masters.counts.map(c => <option key={c.id} value={c.id}>{c.count_name}</option>)}
          </select>

          <select className="border p-2" value={form.packing_type_id} onChange={e => setForm({...form, packing_type_id: e.target.value})}>
            <option value="">Select Packing Type</option>
            {masters.packing.map(p => <option key={p.id} value={p.id}>{p.packing_type}</option>)}
          </select>

          <input type="number" placeholder="Wt per Cone" className="border p-2" onChange={e => setForm({...form, wt_per_cone: e.target.value})} />
          <input type="number" placeholder="Charity Rs" className="border p-2" onChange={e => setForm({...form, charity_rs: e.target.value})} />
          <button onClick={onSave} className="bg-blue-600 text-white flex items-center justify-center gap-2 font-bold"><Save size={16}/> Update Record</button>
        </div>
      </div>

      {/* Search Panel mirroring bottom of image 1 */}
      <div className="bg-gray-100 p-3 border flex gap-4 items-center rounded">
        <select className="text-xs p-1" value={search.field} onChange={e => setSearch({...search, field: e.target.value})}>
          <option value="product_name">Product Name</option>
          <option value="product_code">Product Code</option>
        </select>
        <select className="text-xs p-1" value={search.condition} onChange={e => setSearch({...search, condition: e.target.value})}>
          <option value="Like">Like</option>
          <option value="=">=</option>
        </select>
        <input className="text-xs p-1 border" value={search.value} onChange={e => setSearch({...search, value: e.target.value})} />
        <button onClick={handleSearch} className="bg-white border px-4 py-1 text-xs font-bold hover:bg-blue-50">Search</button>
      </div>
    </div>
  );
};

export default ProductMaster;