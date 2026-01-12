import React, { useState, useEffect } from 'react';
import { transactionsAPI, mastersAPI } from '../service/api';


const InvoicePreparation = () => {
  const [header, setHeader] = useState({ invoice_no: '', date: '', load_no: '', account_id: '', invoice_type_id: '', vehicle_no: '', lr_no: '' });
  const [details, setDetails] = useState([]);
  const [dropdowns, setDropdowns] = useState({ accounts: [], invTypes: [], despatch: [] });

  useEffect(() => {
    const loadData = async () => {
      const [a, i, d] = await Promise.all([
        mastersAPI.accounts.getAll(),
        mastersAPI.invoiceTypes.getAll(),
        transactionsAPI.despatch.getAll()
      ]);
      setDropdowns({ accounts: a.data.data, invTypes: i.data.data, despatch: d.data.data });
    };
    loadData();
  }, []);

  // Fetching record from other table logic
  const handleLoadSelect = async (loadNo) => {
    // When a Load No is selected, we fetch associated despatch/order info
    const selectedLoad = dropdowns.despatch.find(l => l.load_no === loadNo);
    if(selectedLoad) {
      setHeader({ ...header, load_no: loadNo, vehicle_no: selectedLoad.vehicle_no, lr_no: selectedLoad.lr_no });
    }
  };

  return (
    <div className="bg-slate-200 p-4 h-full">
      <div className="bg-white shadow-2xl border-t-4 border-red-700 min-h-[600px] flex flex-col">
        <div className="bg-red-700 text-white p-2 font-bold text-xs flex justify-between">
          <span>Invoice Preparation</span>
          <span>KR EXPORTS v2025</span>
        </div>

        <div className="flex-1 p-6 grid grid-cols-3 gap-8">
          {/* Header Section */}
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col"><label className="text-[10px] font-black">INVOICE NO</label><input className="border p-2 bg-yellow-50 font-bold" /></div>
              <div className="flex flex-col"><label className="text-[10px] font-black">DATE</label><input type="date" className="border p-2" /></div>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black text-blue-700">LINK TO DESPATCH LOAD NO (From Despatch Table)</label>
              <select className="border p-2 font-bold bg-blue-50" onChange={(e) => handleLoadSelect(e.target.value)}>
                <option value="">Select Load</option>
                {dropdowns.despatch.map(l => <option key={l.id} value={l.load_no}>{l.load_no} - {l.vehicle_no}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
               <label className="text-[10px] font-black">PARTY / ACCOUNT</label>
               <select className="border p-2 font-bold">
                 {dropdowns.accounts.map(a => <option key={a.id}>{a.account_name}</option>)}
               </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <input placeholder="VEHICLE NO" className="border p-2" value={header.vehicle_no} readOnly />
                <input placeholder="LR NO" className="border p-2" value={header.lr_no} readOnly />
            </div>
          </div>

          {/* Value Summary (Right Panel in Image 15) */}
          <div className="bg-blue-900 p-6 text-white rounded-md shadow-inner space-y-3">
             <div className="flex justify-between border-b border-blue-800 pb-1"><span>Assessable Value</span><span className="font-mono">0.00</span></div>
             <div className="flex justify-between border-b border-blue-800 pb-1"><span>GST Amount</span><span className="font-mono">0.00</span></div>
             <div className="flex justify-between border-b border-blue-800 pb-1"><span>Charity</span><span className="font-mono">0.00</span></div>
             <div className="flex justify-between border-b border-blue-800 pb-1"><span>Freight</span><span className="font-mono">0.00</span></div>
             <div className="pt-4 flex justify-between text-xl font-black text-yellow-400">
                <span>TOTAL VALUE</span>
                <span>₹ 0.00</span>
             </div>
             <button className="w-full bg-green-600 py-3 mt-4 font-black rounded hover:bg-green-700 transition-colors">APPROVE & PRINT INVOICE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreparation;