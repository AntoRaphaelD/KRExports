import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';
import { Search, Save, X, Plus, Edit } from 'lucide-react';

const TransportMaster = () => {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const initial = { transport_code: '', transport_name: '', place: '', address: '' };
  const [form, setForm] = useState(initial);

  const fetch = async () => { 
    const res = await mastersAPI.transports.getAll(); 
    setList(res.data.data); 
  };
  
  useEffect(() => { fetch(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) await mastersAPI.transports.update(editingId, form);
    else await mastersAPI.transports.create(form);
    setShow(false);
    fetch();
  };

  return (
    <div className="p-4 text-xs font-sans">
      <div className="bg-white border p-2 text-center font-bold text-red-700 mb-4 uppercase shadow-sm">
        Transport Master
      </div>
      <div className="flex gap-4">
        <div className="w-64 bg-white border p-4 shadow-sm h-fit">
          <input className="border w-full p-1 mb-2 uppercase" placeholder="Search Place..." />
          <button className="w-full bg-gray-100 border p-1 flex items-center justify-center gap-1 hover:bg-gray-200">
            <Search size={14}/> Search
          </button>
        </div>
        <div className="flex-1 bg-white border shadow-sm h-[400px] overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b uppercase sticky top-0">
              <tr>
                <th className="p-2 border-r w-12 text-center">Edit</th>
                <th className="p-2 border-r">Code</th>
                <th className="p-2 border-r">Transport Name</th>
                <th className="p-2">Place</th>
              </tr>
            </thead>
            <tbody>
              {list.map(i => (
                <tr key={i.id} className="border-b hover:bg-blue-50">
                  <td className="p-2 border-r text-center">
                    <Edit size={14} className="cursor-pointer text-blue-600 inline" onClick={() => { setForm(i); setEditingId(i.id); setShow(true); }}/>
                  </td>
                  <td className="p-2 border-r font-mono">{i.transport_code}</td>
                  <td className="p-2 border-r font-bold uppercase">{i.transport_name}</td>
                  <td className="p-2 uppercase text-gray-600">{i.place}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {show && (
         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-[#f0f0f0] border-[3px] border-yellow-500 w-[480px] shadow-2xl">
               <div className="bg-yellow-500 p-1 text-white px-3 font-bold uppercase flex justify-between">
                 <span>{editingId ? 'Modify Transport' : 'New Transport Master'}</span>
                 <X className="cursor-pointer" onClick={() => setShow(false)}/>
               </div>
               <form onSubmit={handleSave} className="p-6 bg-[#BDD4F1] space-y-3">
                  <div className="bg-white border-2 border-yellow-500 p-4 space-y-3 shadow-inner">
                    <div className="flex items-center gap-4">
                      <label className="w-24">Code</label>
                      <input required className="border w-24 p-1 bg-blue-100 font-bold" value={form.transport_code} onChange={e=>setForm({...form, transport_code:e.target.value})}/>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="w-24">Name</label>
                      <input required className="border flex-1 p-1 uppercase" value={form.transport_name} onChange={e=>setForm({...form, transport_name:e.target.value})}/>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="w-24">Place</label>
                      <input required className="border flex-1 p-1 uppercase" value={form.place} onChange={e=>setForm({...form, place:e.target.value})}/>
                    </div>
                    <div className="flex items-start gap-4">
                      <label className="w-24">Full Address</label>
                      <textarea className="border flex-1 p-1 h-24 uppercase text-[10px]" value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/>
                    </div>
                  </div>
                  <div className="flex justify-center gap-2 pt-2">
                    <button type="submit" className="bg-white border-2 border-blue-400 px-8 py-1 text-blue-800 font-bold flex items-center gap-2 shadow-sm">
                      <Save size={14}/> Save Record
                    </button>
                    <button type="button" onClick={() => setShow(false)} className="bg-white border-2 border-red-400 px-8 py-1 text-red-800 font-bold shadow-sm">Cancel</button>
                  </div>
               </form>
            </div>
         </div>
      )}
      <button onClick={() => {setForm(initial); setEditingId(null); setShow(true);}} className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition">
        <Plus/>
      </button>
    </div>
  );
};

export default TransportMaster;