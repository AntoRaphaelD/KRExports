import React, { useState, useEffect } from 'react';
import { mastersAPI , transactionsAPI} from '../service/api';
import { Plus, Trash, Save } from 'lucide-react';

const OrderConfirmation = () => {
  const [header, setHeader] = useState({ order_no: '', date: '', account_id: '', broker_id: '', place: '' });
  const [details, setDetails] = useState([{ product_id: '', qty: 0, rate_cr: 0, bag_wt: 55 }]);
  const [dropdowns, setDropdowns] = useState({ accounts: [], brokers: [], products: [] });

  useEffect(() => {
    const fetchMasters = async () => {
      const [a, b, p] = await Promise.all([
        mastersAPI.accounts.getAll(),
        mastersAPI.brokers.getAll(),
        mastersAPI.products.getAll()
      ]);
      setDropdowns({ accounts: a.data.data, brokers: b.data.data, products: p.data.data });
    };
    fetchMasters();
  }, []);

  const addRow = () => setDetails([...details, { product_id: '', qty: 0, rate_cr: 0, bag_wt: 55 }]);
  
  const submitOrder = async () => {
    const payload = { ...header, Details: details };
    await transactionsAPI.orders.create(payload);
    alert("Order Saved Successfully");
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4">
      <div className="bg-blue-600 text-white p-2 font-bold text-sm mb-4 shadow">Order Confirmation (Sales with order)</div>
      
      {/* Header Tab Section */}
      <div className="bg-white p-6 shadow-md border mb-4 grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4"><label className="w-24 text-xs font-bold">Order No.</label><input className="border p-1 w-full" value={header.order_no} onChange={e => setHeader({...header, order_no: e.target.value})} /></div>
          <div className="flex items-center gap-4"><label className="w-24 text-xs font-bold">Date</label><input type="date" className="border p-1 w-full" value={header.date} onChange={e => setHeader({...header, date: e.target.value})} /></div>
        </div>
        <div className="space-y-4">
          <select className="border p-2 w-full text-sm" onChange={e => setHeader({...header, account_id: e.target.value})}>
            <option>Select Party (Account)</option>
            {dropdowns.accounts.map(a => <option key={a.id} value={a.id}>{a.account_name}</option>)}
          </select>
          <select className="border p-2 w-full text-sm" onChange={e => setHeader({...header, broker_id: e.target.value})}>
            <option>Select Agent / Broker</option>
            {dropdowns.brokers.map(b => <option key={b.id} value={b.id}>{b.broker_name}</option>)}
          </select>
        </div>
      </div>

      {/* Details Grid Section */}
      <div className="bg-white border shadow-md">
        <table className="w-full text-xs text-left">
          <thead className="bg-blue-100 uppercase">
            <tr>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Rate (Cr)</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Bag Wt.</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {details.map((row, i) => (
              <tr key={i}>
                <td className="border p-1">
                  <select className="w-full" onChange={e => {
                    const d = [...details]; d[i].product_id = e.target.value; setDetails(d);
                  }}>
                    <option>Select Product</option>
                    {dropdowns.products.map(p => <option key={p.id} value={p.id}>{p.product_name}</option>)}
                  </select>
                </td>
                <td className="border p-1"><input type="number" className="w-full" value={row.rate_cr} onChange={e => {const d = [...details]; d[i].rate_cr = e.target.value; setDetails(d);}} /></td>
                <td className="border p-1"><input type="number" className="w-full" value={row.qty} onChange={e => {const d = [...details]; d[i].qty = e.target.value; setDetails(d);}} /></td>
                <td className="border p-1"><input type="number" className="w-full" value={row.bag_wt} onChange={e => {const d = [...details]; d[i].bag_wt = e.target.value; setDetails(d);}} /></td>
                <td className="border p-1 text-center"><button onClick={() => setDetails(details.filter((_, idx) => idx !== i))}><Trash size={14} className="text-red-500" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-2 flex justify-between bg-gray-50 border-t">
          <button onClick={addRow} className="bg-green-600 text-white px-4 py-1 flex items-center gap-1"><Plus size={14}/> Add Item</button>
          <button onClick={submitOrder} className="bg-blue-700 text-white px-8 py-1 font-bold flex items-center gap-1"><Save size={14}/> Save Order</button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;