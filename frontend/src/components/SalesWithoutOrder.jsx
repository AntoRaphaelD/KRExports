import React, { useState, useEffect } from 'react';
import { mastersAPI, transactionsAPI } from '../service/api';
import { Plus, Trash, Save } from 'lucide-react';

const SalesWithoutOrder = () => {
  // Matches OrderHeader model fields
  const [header, setHeader] = useState({ 
    order_no: '', 
    date: new Date().toISOString().split('T')[0], 
    account_id: '', 
    broker_id: '', 
    place: '',
    is_with_order: false // This differentiates from "Orders"
  });

  const [details, setDetails] = useState([{ product_id: '', qty: 0, rate_cr: 0, bag_wt: 55 }]);
  const [dropdowns, setDropdowns] = useState({ accounts: [], brokers: [], products: [] });

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [a, b, p] = await Promise.all([
          mastersAPI.accounts.getAll(),
          mastersAPI.brokers.getAll(),
          mastersAPI.products.getAll()
        ]);
        setDropdowns({ 
          accounts: a.data.data, 
          brokers: b.data.data, 
          products: p.data.data 
        });
      } catch (err) {
        console.error("Failed to fetch masters", err);
      }
    };
    fetchMasters();
  }, []);

  const addRow = () => setDetails([...details, { product_id: '', qty: 0, rate_cr: 0, bag_wt: 55 }]);
  
  const submitOrder = async () => {
    try {
      // Logic: Sequelize 'include' needs the key to match the alias in models.js
      // Your model association is: OrderHeader.hasMany(OrderDetail, { as: 'Details' })
      const payload = { 
        ...header, 
        Details: details.map(d => ({
          ...d,
          qty: parseFloat(d.qty),
          rate_cr: parseFloat(d.rate_cr),
          bag_wt: parseFloat(d.bag_wt)
        }))
      };

      await transactionsAPI.orders.create(payload);
      alert("Direct Sale Saved Successfully");
      
      // Reset form
      setHeader({ order_no: '', date: new Date().toISOString().split('T')[0], account_id: '', broker_id: '', place: '', is_with_order: false });
      setDetails([{ product_id: '', qty: 0, rate_cr: 0, bag_wt: 55 }]);
    } catch (err) {
      console.error("Save Error:", err.response?.data || err.message);
      alert("Error saving: " + (err.response?.data?.error || "Internal Server Error"));
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 font-sans text-xs">
      <div className="bg-orange-600 text-white p-2 font-bold mb-4 shadow uppercase">
        Direct Sale (Sales Without Order)
      </div>
      
      {/* Header Section */}
      <div className="bg-white p-6 shadow-md border mb-4 grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-24 font-bold text-gray-700">Order No.</label>
            <input className="border p-1 w-full focus:ring-1 focus:ring-orange-500 outline-none" value={header.order_no} onChange={e => setHeader({...header, order_no: e.target.value})} />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 font-bold text-gray-700">Date</label>
            <input type="date" className="border p-1 w-full" value={header.date} onChange={e => setHeader({...header, date: e.target.value})} />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 font-bold text-gray-700">Place</label>
            <input className="border p-1 w-full uppercase" value={header.place} onChange={e => setHeader({...header, place: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4">
          {/* CRITICAL FIX: Changed a.id to a.account_code to match your model */}
          <select 
            className="border p-2 w-full text-sm font-semibold bg-orange-50" 
            value={header.account_id}
            onChange={e => setHeader({...header, account_id: e.target.value})}
          >
            <option value="">Select Party (Account)</option>
            {dropdowns.accounts.map(a => (
              <option key={a.account_code} value={a.account_code}>{a.account_name}</option>
            ))}
          </select>

          <select 
            className="border p-2 w-full text-sm" 
            value={header.broker_id}
            onChange={e => setHeader({...header, broker_id: e.target.value})}
          >
            <option value="">Select Agent / Broker</option>
            {dropdowns.brokers.map(b => (
              <option key={b.id} value={b.id}>{b.broker_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Details Table */}
      <div className="bg-white border shadow-md">
        <table className="w-full text-xs text-left">
          <thead className="bg-orange-100 uppercase text-orange-900">
            <tr>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Rate (Cr)</th>
              <th className="p-2 border">Qty (Bags)</th>
              <th className="p-2 border">Bag Wt.</th>
              <th className="p-2 border w-16">Action</th>
            </tr>
          </thead>
          <tbody>
            {details.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border p-1">
                  <select 
                    className="w-full p-1 outline-none" 
                    value={row.product_id}
                    onChange={e => {
                      const d = [...details]; d[i].product_id = e.target.value; setDetails(d);
                    }}
                  >
                    <option value="">Select Product</option>
                    {dropdowns.products.map(p => <option key={p.id} value={p.id}>{p.product_name}</option>)}
                  </select>
                </td>
                <td className="border p-1"><input type="number" className="w-full p-1" value={row.rate_cr} onChange={e => {const d = [...details]; d[i].rate_cr = e.target.value; setDetails(d);}} /></td>
                <td className="border p-1"><input type="number" className="w-full p-1" value={row.qty} onChange={e => {const d = [...details]; d[i].qty = e.target.value; setDetails(d);}} /></td>
                <td className="border p-1"><input type="number" className="w-full p-1" value={row.bag_wt} onChange={e => {const d = [...details]; d[i].bag_wt = e.target.value; setDetails(d);}} /></td>
                <td className="border p-1 text-center"><button onClick={() => setDetails(details.filter((_, idx) => idx !== i))}><Trash size={14} className="text-red-500 mx-auto" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-2 flex justify-between bg-gray-50 border-t">
          <button onClick={addRow} className="bg-green-600 text-white px-4 py-1 flex items-center gap-1 hover:bg-green-700 transition-colors"><Plus size={14}/> Add Item</button>
          <button onClick={submitOrder} className="bg-orange-700 text-white px-8 py-1 font-bold flex items-center gap-1 hover:bg-orange-800 shadow-lg"><Save size={14}/> Save Direct Sale</button>
        </div>
      </div>
    </div>
  );
};

export default SalesWithoutOrder;