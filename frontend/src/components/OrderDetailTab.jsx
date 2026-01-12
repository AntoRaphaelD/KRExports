import React from 'react';

const OrderDetailTab = ({ details = [], products = [] }) => {
  return (
    <div className="bg-white border-2 border-yellow-500 overflow-hidden shadow-inner min-h-[200px]">
      <table className="w-full text-[11px] text-left border-collapse">
        <thead className="bg-blue-100 border-b font-bold uppercase text-blue-900 sticky top-0">
          <tr>
            <th className="p-2 border-r w-8"></th>
            <th className="p-2 border-r">Product Description</th>
            <th className="p-2 border-r">Rate (Cr)</th>
            <th className="p-2 border-r">Rate (Imm.)</th>
            <th className="p-2 border-r">Rate Per</th>
            <th className="p-2 border-r">Qty</th>
            <th className="p-2 border-r">Bag Wt.</th>
            <th className="p-2">Packing Type</th>
          </tr>
        </thead>
        <tbody>
          {details.length > 0 ? (
            details.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-yellow-50 group">
                <td className="p-2 border-r text-center text-blue-600 font-bold">▶</td>
                <td className="p-2 border-r font-bold uppercase">
                  {item.Product?.product_name || "N/A"}
                </td>
                <td className="p-2 border-r text-right px-4">{item.rate_cr}</td>
                <td className="p-2 border-r text-right px-4">{item.rate_imm}</td>
                <td className="p-2 border-r text-center font-mono text-blue-800">5.5</td>
                <td className="p-2 border-r text-center font-bold bg-gray-50">{item.qty}</td>
                <td className="p-2 border-r text-center">{item.bag_wt}</td>
                <td className="p-2 uppercase text-gray-600">
                  {item.Product?.PackingType?.packing_type || 'BAGS'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-12 text-center text-gray-400 italic bg-gray-50 border-dashed border-2 m-2">
                <div className="flex flex-col items-center gap-2">
                  <span>Type starting letter of the product to search...</span>
                  <input 
                    type="text" 
                    placeholder="Search Product..." 
                    className="border p-1 w-64 not-italic text-black uppercase"
                  />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Footer Totals style from Image 11 */}
      {details.length > 0 && (
        <div className="bg-blue-50 p-1 border-t flex justify-end gap-10 pr-10 font-bold text-blue-900">
          <span>Total Qty: {details.reduce((sum, i) => sum + Number(i.qty), 0)}</span>
        </div>
      )}
    </div>
  );
};

export default OrderDetailTab;