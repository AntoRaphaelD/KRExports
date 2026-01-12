import React, { useState } from 'react';
import { mastersAPI } from '../service/api';

const InvoiceTypeMaster = () => {
  const [form, setForm] = useState({
    invoice_type_name: '', sales_type: 'CST SALES',
    assess_value_formula: '[H]-[igstamt]-[Lorryfright]',
    igst_pct: 5, charity_formula: '[Total Kgs]*[CharityRs]',
    is_account_posting: true
  });

  const onSave = async () => {
    await mastersAPI.invoiceTypes.create(form);
    alert("Invoice Configuration Updated");
  };

  return (
    <div className="bg-white border shadow-2xl max-w-5xl mx-auto">
      <div className="bg-blue-600 text-white p-2 font-bold text-xs">Invoice Type Master : Configuration</div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 border-b pb-4">
          <input placeholder="Invoice Type (e.g. YARN SALES GST)" className="border p-2 font-bold" value={form.invoice_type_name} onChange={e => setForm({...form, invoice_type_name: e.target.value})} />
          <select className="border p-2" value={form.sales_type} onChange={e => setForm({...form, sales_type: e.target.value})}>
            <option value="CST SALES">CST SALES</option>
            <option value="LOCAL SALES">LOCAL SALES</option>
          </select>
        </div>

        {/* Formula Grid Mirroring Image 12 */}
        <div className="space-y-2">
          <div className="grid grid-cols-4 bg-gray-100 p-1 text-[10px] font-black">
            <span>CALCULATION FIELD</span><span>ENABLE</span><span>FORMULA / VALUE</span><span>LEDGER POSTING</span>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2 border-b py-1">
            <span className="text-xs font-bold">Assess Value</span>
            <input type="checkbox" checked readOnly />
            <input className="border p-1 text-xs font-mono" value={form.assess_value_formula} readOnly />
            <span className="text-[10px] text-blue-700">SALES ACCOUNT</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-2 border-b py-1">
            <span className="text-xs font-bold">Charity</span>
            <input type="checkbox" defaultChecked />
            <input className="border p-1 text-xs font-mono" value={form.charity_formula} readOnly />
            <span className="text-[10px] text-blue-700">CHARITY PAYABLE</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-2 border-b py-1">
            <span className="text-xs font-bold">IGST %</span>
            <input type="checkbox" defaultChecked />
            <div className="flex gap-2">
                <input type="number" className="border w-12 p-1" value={form.igst_pct} onChange={e => setForm({...form, igst_pct: e.target.value})} />
                <span className="text-xs">%</span>
            </div>
            <span className="text-[10px] text-blue-700">OUTPUT IGST</span>
          </div>
        </div>

        <button onClick={onSave} className="w-full bg-blue-800 text-white py-3 font-bold mt-4 hover:bg-blue-700 shadow-lg">
          UPDATE INVOICE MASTER
        </button>
      </div>
    </div>
  );
};

export default InvoiceTypeMaster;