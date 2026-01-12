import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';
import { Search, Save, X, Plus, Edit, CheckCircle } from 'lucide-react';

const SalesOrderOpen = () => {
  const [list, setList] = useState([]);
  const [parties, setParties] = useState([]);
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initial = { order_no: '', order_date: new Date().toISOString().split('T')[0], party_id: '', status: 'OPEN', remarks: '' };
  const [form, setForm] = useState(initial);

  const fetch = async () => {
    const [ord, par] = await Promise.all([
      mastersAPI.orderHeaders.getAll({ status: 'OPEN' }),
      mastersAPI.accounts.getAll()
    ]);
    setList(ord.data.data);
    setParties(par.data.data);
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await mastersAPI.orderHeaders.update(editingId, form);
      else await mastersAPI.orderHeaders.create({...form, is_with_order: true});
      setShow(false);
      fetch();
    } catch (err) { alert("Operation failed"); }
  };

  return (
    <div className="p-4 text-xs font-sans">
      <div className="bg-white border p-2 text-center font-bold text-red-700 mb-4 uppercase shadow-sm">
        Pending Sales Orders (Open)
      </div>

      <div className="flex gap-4">
        <div className="w-64 bg-white border p-4 shadow-sm h-fit">
          <label className="text-[10px] font-bold text-blue-800 uppercase block mb-1">Filter by Party</label>
          <select className="border w-full p-1 mb-3">
             <option>-- All Parties --</option>
             {parties.map(p => <option key={p.account_code}>{p.account_name}</option>)}
          </select>
          <button className="w-full bg-blue-50 border border-blue-300 p-1 flex items-center justify-center gap-1 font-bold">
            <Search size={12}/> Refresh List
          </button>
        </div>

        <div className="flex-1 bg-white border shadow-sm h-[400px] overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b uppercase sticky top-0">
              <tr>
                <th className="p-2 border-r w-12 text-center">Edit</th>
                <th className="p-2 border-r">Order No</th>
                <th className="p-2 border-r">Date</th>
                <th className="p-2 border-r">Customer</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map(i => (
                <tr key={i.id} className="border-b hover:bg-green-50">
                  <td className="p-2 border-r text-center">
                    <Edit size={14} className="cursor-pointer text-blue-600 inline" onClick={() => { setForm(i); setEditingId(i.id); setShow(true); }}/>
                  </td>
                  <td className="p-2 border-r font-bold">{i.order_no}</td>
                  <td className="p-2 border-r">{i.order_date || i.date}</td>
                  <td className="p-2 border-r uppercase">{i.Account?.account_name}</td>
                  <td className="p-2 text-green-700 font-bold flex items-center gap-1">
                    <CheckCircle size={12}/> {i.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#f0f0f0] border-[3px] border-yellow-500 w-[500px] shadow-2xl">
            <div className="bg-yellow-500 p-1 flex justify-between text-white px-3 font-bold uppercase">
              <span>{editingId ? 'Modify Order Header' : 'Register New Order'}</span>
              <X className="cursor-pointer" onClick={() => setShow(false)} />
            </div>
            <form onSubmit={handleSave} className="p-6 bg-[#BDD4F1] space-y-3">
              <div className="bg-white border-2 border-yellow-500 p-4 space-y-3 shadow-inner">
                <div className="flex items-center gap-4">
                  <label className="w-24">Order No</label>
                  <input required className="border w-32 p-1 bg-blue-50 font-bold" value={form.order_no} onChange={e=>setForm({...form, order_no:e.target.value})}/>
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-24">Order Date</label>
                  <input type="date" className="border flex-1 p-1" value={form.order_date} onChange={e=>setForm({...form, order_date:e.target.value})}/>
                </div>
                <div>
                  <label className="block text-[10px] mb-1">Customer / Party</label>
                  <select required className="border w-full p-1" value={form.party_id} onChange={e=>setForm({...form, party_id:e.target.value})}>
                    <option value="">-- Select Customer --</option>
                    {parties.map(p => <option key={p.account_code} value={p.account_code}>{p.account_name}</option>)}
                  </select>
                </div>
                <div>
                   <label className="block text-[10px] mb-1">Status</label>
                   <select className="border w-full p-1 font-bold text-green-700" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
                      <option>OPEN</option><option>CLOSED</option><option>CANCELLED</option>
                   </select>
                </div>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button type="submit" className="bg-white border-2 border-blue-400 px-8 py-1 text-blue-800 font-bold flex items-center gap-2">
                  <Save size={14}/> {editingId ? 'Update' : 'Save Header'}
                </button>
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

export default SalesOrderOpen;