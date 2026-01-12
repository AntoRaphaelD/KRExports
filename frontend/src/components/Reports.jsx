import React, { useState } from 'react';
import { FileText, Printer, X } from 'lucide-react';

const Reports = () => {
  const [selected, setSelected] = useState('Sales');
  const [dateRange, setDateRange] = useState({ from: '2025-04-01', to: '2026-03-31' });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] border shadow-2xl rounded-sm">
        <div className="bg-blue-800 text-white p-2 flex justify-between items-center text-xs font-bold">
          <span className="flex items-center gap-2"><FileText size={14}/> System Reports</span>
          <X size={14} className="cursor-pointer" />
        </div>
        
        <div className="p-6 flex gap-6">
          {/* Radio Group */}
          <div className="w-1/3 space-y-4 border-r pr-4">
             {['Pending Order', 'Sales', 'Stock', 'RG1 Report', 'Agent Statement'].map(item => (
               <label key={item} className="flex items-center gap-2 text-xs cursor-pointer">
                 <input type="radio" name="rpt" checked={selected === item} onChange={() => setSelected(item)} />
                 {item}
               </label>
             ))}
          </div>

          {/* Date Filters */}
          <div className="w-2/3 space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Report Duration</label>
                <div className="flex gap-2">
                   <input type="date" className="border text-xs p-1" value={dateRange.from} />
                   <input type="date" className="border text-xs p-1" value={dateRange.to} />
                </div>
             </div>

             <div className="bg-blue-50 p-4 border border-blue-100 rounded">
                <p className="text-[10px] italic text-blue-600 mb-2">Select Format:</p>
                <select className="w-full border p-1 text-xs bg-white">
                   <option>Sales Ledger [Invoice Type Wise]</option>
                   <option>Sales Day Book</option>
                   <option>Gate Pass Report</option>
                </select>
             </div>

             <button className="w-full bg-blue-900 text-white py-2 font-bold text-xs flex items-center justify-center gap-2">
                <Printer size={14}/> GENERATE REPORT
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;