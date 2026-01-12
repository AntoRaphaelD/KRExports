import React, { useState, useEffect } from 'react';
import { mastersAPI, transactionsAPI } from '../service/api';
import { Save, X, Plus, Edit } from 'lucide-react';
import OrderDetailTab from './OrderDetailTab';

const SalesWithoutOrder = () => {
  const [list, setList] = useState([]);
  const [parties, setParties] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState('Head');
  const [editingId, setEditingId] = useState(null);

  const initial = { 
    order_no: '', 
    date: new Date().toISOString().split('T')[0], 
    account_id: '', 
    broker_id: '', 
    place: '', 
    is_with_order: false // Crucial flag for Image 6 logic
  };
  
  const [form, setForm] = useState(initial);

  const fetch = async () => {
    try {
      const [res, pRes, bRes] = await Promise.all([
        transactionsAPI.orderHeaders.getAll({ is_with_order: false }),
        mastersAPI.accounts.getAll(),
        mastersAPI.brokers.getAll()
      ]);
      setList(res.data.data);
      setParties(pRes.data.data);
      setBrokers(bRes.data.data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE existing record
        await transactionsAPI.orderHeaders.update(editingId, form);
      } else {
        // CREATE new record (ensure is_with_order is false)
        await transactionsAPI.orderHeaders.create({ ...form, is_with_order: false });
      }
      setShow(false);
      fetch();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  const openAddModal = () => {
    setForm(initial);
    setEditingId(null);
    setTab('Head');
    setShow(true);
  };

  const openEditModal = (item) => {
    setForm(item);
    setEditingId(item.id);
    setTab('Head');
    setShow(true);
  };

  return (
    <div className="p-4 text-xs font-sans">
      <div className="bg-white border-b mb-4 p-2 text-center font-bold text-orange-700 uppercase shadow-sm">
        Sales with out order (Direct Transactions)
      </div>

      <div className="bg-white border shadow-md h-[400px] overflow-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b uppercase font-bold text-orange-900 sticky top-0">
            <tr>
              <th className="p-2 border-r w-12 text-center">Edit</th>
              <th className="p-2 border-r">Order No</th>
              <th className="p-2 border-r">Date</th>
              <th className="p-2 border-r">Party Name</th>
              <th className="p-2">Broker</th>
            </tr>
          </thead>
          <tbody>
            {list.map(item => (
              <tr key={item.id} className="border-b hover:bg-orange-50 cursor-pointer">
                <td className="p-2 border-r text-center">
                  <Edit size={14} className="inline text-orange-600 cursor-pointer" onClick={() => openEditModal(item)}/>
                </td>
                <td className="p-2 border-r font-bold">{item.order_no}</td>
                <td className="p-2 border-r">{item.date}</td>
                <td className="p-2 border-r uppercase">{item.Account?.account_name}</td>
                <td className="p-2 uppercase text-gray-500">{item.Broker?.broker_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#f0f0f0] border-[3px] border-orange-500 w-[750px] shadow-2xl">
            <div className="bg-orange-500 p-1 flex justify-between text-white px-3 font-bold uppercase">
              <span>{editingId ? 'Modify Direct Sale' : 'Add New Direct Sale'}</span>
              <X className="cursor-pointer" onClick={() => setShow(false)} />
            </div>
            
            <form onSubmit={handleSave} className="p-4 bg-[#BDD4F1]">
              <div className="flex gap-1 mb-0">
                <button type="button" onClick={() => setTab('Head')} className={`px-6 py-1 rounded-t border border-b-0 ${tab === 'Head' ? 'bg-white font-bold text-orange-800 border-orange-500' : 'bg-gray-200'}`}>Head</button>
                <button type="button" onClick={() => setTab('Detail')} className={`px-6 py-1 rounded-t border border-b-0 ${tab === 'Detail' ? 'bg-white font-bold text-orange-800 border-orange-500' : 'bg-gray-200'}`}>Detail</button>
              </div>

              <div className="bg-white border-2 border-orange-500 p-6 shadow-inner min-h-[300px]">
                {tab === 'Head' ? (
                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="flex items-center gap-4">
                      <label className="w-24 font-bold">Order No.</label>
                      <input 
                        required 
                        className="border flex-1 p-1 bg-white font-bold" 
                        value={form.order_no} 
                        onChange={e => setForm({ ...form, order_no: e.target.value })} 
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="w-24">Date</label>
                      <input type="date" className="border flex-1 p-1" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="w-24">Party</label>
                      <select required className="border flex-1 p-1" value={form.account_id} onChange={e => setForm({ ...form, account_id: e.target.value })}>
                        <option value="">-- Select Party --</option>
                        {parties.map(p => <option key={p.account_code} value={p.account_code}>{p.account_name}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="w-24">Agent/Broker</label>
                      <select required className="border flex-1 p-1" value={form.broker_id} onChange={e => setForm({ ...form, broker_id: e.target.value })}>
                        <option value="">-- Select Broker --</option>
                        {brokers.map(b => <option key={b.id} value={b.id}>{b.broker_name}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="w-24">Place</label>
                      <input className="border flex-1 p-1 uppercase" value={form.place} onChange={e => setForm({ ...form, place: e.target.value })} />
                    </div>
                  </div>
                ) : (
                  <OrderDetailTab details={form.OrderDetails || []} />
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button type="submit" className="bg-white border-2 border-orange-400 px-8 py-1 text-orange-800 flex items-center gap-2 font-bold shadow-sm hover:bg-orange-50">
                  <Save size={14} /> {editingId ? 'Update' : 'Save Record'}
                </button>
                <button type="button" onClick={() => setShow(false)} className="bg-white border-2 border-gray-400 px-8 py-1 text-gray-600 font-bold hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ADD BUTTON */}
      <button 
        onClick={openAddModal} 
        className="fixed bottom-8 right-8 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center z-40"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default SalesWithoutOrder;