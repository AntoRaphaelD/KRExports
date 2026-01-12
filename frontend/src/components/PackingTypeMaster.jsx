import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';

const PackingTypeMaster = () => {
  const [types, setTypes] = useState([]);
  const [name, setName] = useState('');

  const refresh = async () => {
    const res = await mastersAPI.packingTypes.getAll();
    setTypes(res.data.data);
  };

  useEffect(() => { refresh(); }, []);

  const onAdd = async () => {
    await mastersAPI.packingTypes.create({ packing_type: name });
    setName('');
    refresh();
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow border">
       <h2 className="text-xs font-bold bg-slate-100 p-2 mb-4 border-l-4 border-blue-900">Packing Type Master</h2>
       <div className="flex gap-2 mb-4">
         <input placeholder="Enter New Packing Type..." className="border p-2 text-sm flex-1" value={name} onChange={e => setName(e.target.value)} />
         <button onClick={onAdd} className="bg-blue-900 text-white px-4 font-bold text-xs">ADD</button>
       </div>
       <div className="border bg-gray-50">
         {types.map(t => (
           <div key={t.id} className="p-2 border-b text-xs flex justify-between uppercase">
             <span>{t.packing_type}</span>
             <span className="text-gray-400">ID: {t.id}</span>
           </div>
         ))}
       </div>
    </div>
  );
};

export default PackingTypeMaster;