import React from 'react';

const TaxInvoiceTemplate = React.forwardRef(({ data }, ref) => {
    // Helper for Indian Currency Formatting
    const fmt = (val) => parseFloat(val || 0).toLocaleString('en-IN', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });

    // We ALWAYS render the wrapper div so the 'ref' is never null
    return (
        <div ref={ref} className="bg-white">
            {data ? (
                <div className="p-8 text-black font-sans text-[11px] leading-tight w-[210mm] min-h-[297mm]">
                    {/* Header Checkboxes */}
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-1/3"></div>
                        <div className="w-1/3 text-center">
                            <h1 className="text-sm font-black underline uppercase">Tax Invoice</h1>
                        </div>
                        <div className="w-1/3 space-y-0.5 text-[8px] font-bold">
                            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 border border-black"></div> ORIGINAL FOR BUYER</div>
                            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 border border-black"></div> DUPLICATE FOR TRANSPORTER</div>
                        </div>
                    </div>

                    <div className="border border-black">
                        {/* Company Header */}
                        <div className="flex border-b border-black">
                            <div className="flex-1 p-3 text-center">
                                <h2 className="text-lg font-black uppercase">KAYAAR EXPORTS PRIVATE LIMITED</h2>
                                <p className="font-bold">D.No: 43/5, Railway Feeder Road, Kovilpatti</p>
                                <p className="font-black mt-1">GSTIN : 33AAACK4468M1ZA</p>
                            </div>
                        </div>

                        {/* Party vs Invoice Details */}
                        <div className="flex border-b border-black min-h-[100px]">
                            <div className="flex-1 p-3 border-r border-black">
                                <p className="font-bold mb-1 underline text-[9px]">Party Name & Address</p>
                                <h3 className="text-sm font-black mb-1 uppercase">{data.party_name}</h3>
                                <div className="whitespace-pre-line font-bold">{data.address}</div>
                                <p className="mt-2 font-black">GST No: {data.gst_no}</p>
                            </div>
                            <div className="w-[200px] text-[10px]">
                                <table className="w-full font-black">
                                    <tbody>
                                        <tr className="border-b border-black">
                                            <td className="p-1">Inv No</td><td>:</td><td className="text-right">{data.invoice_no}</td>
                                        </tr>
                                        <tr className="border-b border-black">
                                            <td className="p-1">Date</td><td>:</td><td className="text-right">{data.date}</td>
                                        </tr>
                                        <tr className="border-b border-black">
                                            <td className="p-1">Vehicle</td><td>:</td><td className="text-right">{data.vehicle}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="grid grid-cols-12 border-b border-black text-center font-black uppercase text-[9px]">
                            <div className="col-span-1 border-r border-black py-1">Bags</div>
                            <div className="col-span-2 border-r border-black py-1">Weight</div>
                            <div className="col-span-5 border-r border-black py-1">Description</div>
                            <div className="col-span-2 border-r border-black py-1">Rate</div>
                            <div className="col-span-2 py-1">Value</div>
                        </div>
                        <div className="flex min-h-[150px]">
                            <div className="grid grid-cols-12 w-full content-start">
                                <div className="col-span-1 border-r border-black text-center p-2 font-bold">{data.bags}</div>
                                <div className="col-span-2 border-r border-black text-center p-2 font-bold">{fmt(data.weight)}</div>
                                <div className="col-span-5 border-r border-black p-2 font-black italic">{data.product_name}</div>
                                <div className="col-span-2 border-r border-black text-center p-2 font-mono">{fmt(data.rate)}</div>
                                <div className="col-span-2 text-right p-2 font-black">{fmt(data.total)}</div>
                            </div>
                        </div>

                        {/* Grand Total */}
                        <div className="border-t border-black flex items-center h-10 bg-gray-50">
                            <div className="flex-1 px-2 font-black italic text-[9px] uppercase">
                                Indian Rupees {data.total_in_words || '---'} Only.
                            </div>
                            <div className="w-[120px] border-l border-black h-full flex items-center justify-end px-2 text-sm font-black">
                                ₹ {fmt(data.grand_total)}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-10 text-center text-gray-300">Loading document structure...</div>
            )}
        </div>
    );
});

export default TaxInvoiceTemplate;