import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'; // FIXED IMPORT
import { 
    FileText, Calendar, Filter, PieChart, 
    Download, ChevronRight, BarChart3, 
    FileJson, ScrollText, Layers, 
    CheckCircle2, Printer, ArrowRightCircle, X
} from 'lucide-react';
import { InvoiceTemplate } from '../print/InvoiceTemplate';
import { reportsAPI } from '../service/api';

const ReportsDashboard = () => {
    const [category, setCategory] = useState('Sales');
    const [selectedReport, setSelectedReport] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [printData, setPrintData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Ref for the hidden print template
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onAfterPrint: () => setPrintData(null)
    });

    const reportOptions = {
        Sales: [
            { id: 's1', name: 'Sales Ledger', desc: 'Sales-Invoice Type Wise Day Book', type: 'PDF' },
            { id: 's2', name: 'Tax Invoice', desc: 'Generate Statutory Tax Invoice (Original/Duplicate)', type: 'PRINT' },
            { id: 's3', name: 'Gate Pass', desc: 'Day wise Gate Pass Report', type: 'PDF' }
        ],
        Stock: [
            { id: 'st1', name: 'RG1 Stock Statement', desc: 'Statutory count wise production details', type: 'PDF' },
            { id: 'st2', name: 'Depot Stock Statement', desc: 'Opening, Receipt and Sales summary', type: 'PDF' },
            { id: 'st3', name: 'Waste Stock', desc: 'Daily Waste & Scrap ledger', type: 'PDF' }
        ],
        Order: [
            { id: 'o1', name: 'Pending Orders', desc: 'Sales Pending Order by Item/Broker', type: 'PDF' }
        ],
        Govt: [
            { id: 'g1', name: 'GST Returns JSON', desc: 'E-filing compatible data export', type: 'JSON' }
        ]
    };

    const icons = {
        Sales: <BarChart3 size={20} />,
        Stock: <Layers size={20} />,
        Order: <ScrollText size={20} />,
        Govt: <FileJson size={20} />
    };

    /**
     * TRIGGER: Fetch and Generate
     */
    const produceDocument = async () => {
        if (!selectedReport) return alert("Please select a report module from the list.");
        setLoading(true);

        try {
            const reportMetadata = reportOptions[category].find(r => r.id === selectedReport);

            // 1. IF TAX INVOICE (HTML Print Template)
            if (reportMetadata.type === 'PRINT') {
                const invoiceId = prompt("Enter Invoice Number to Print:");
                if (!invoiceId) { setLoading(false); return; }
                
                const res = await reportsAPI.getInvoicePrintData(invoiceId);
                if (res.data.success) {
                    setPrintData(res.data.data);
                    setTimeout(() => handlePrint(), 500);
                } else {
                    alert("Invoice not found.");
                }
            } 
            
            // 2. IF TABULAR REPORT (jsPDF-AutoTable)
            else if (reportMetadata.type === 'PDF') {
                const res = await reportsAPI.getReportData(selectedReport, dateRange);
                if (res.data.data && res.data.data.length > 0) {
                    generateTablePDF(reportMetadata.name, res.data.data);
                } else {
                    alert("No data found for the selected date range.");
                }
            }
        } catch (err) {
            console.error("Doc Generation Error", err);
            alert("Error: Connection to reporting engine failed.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * PDF ENGINE: Fixed autoTable Implementation
     */
    const generateTablePDF = (title, data) => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();

        // 1. Header Branding
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text("Kayaar Export Pvt Ltd,", pageWidth / 2, 15, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`${title} from ${dateRange.start || 'Start'} To ${dateRange.end || 'Today'}`, pageWidth / 2, 22, { align: 'center' });

        // 2. The Red Line (Screenshot Branding)
        doc.setDrawColor(200, 0, 0); 
        doc.setLineWidth(0.8);
        doc.line(15, 26, pageWidth - 15, 26);

        // 3. Mapping Data for Table
        const tableRows = data.map(item => [
            item.invoice_no || item.id,
            item.Party?.account_name || item.Product?.product_name || 'N/A',
            item.InvoiceDetails?.[0]?.Product?.product_name || item.date || '---',
            item.InvoiceDetails?.[0]?.packs || item.production_kgs || '0',
            item.InvoiceDetails?.[0]?.total_kgs || item.stock_kgs || '0',
            item.final_invoice_value ? `Rs. ${item.final_invoice_value}` : '---',
            item.InvoiceDetails?.[0]?.rate || '---'
        ]);

        // 4. Calling autoTable correctly as a function
        autoTable(doc, {
            startY: 35,
            head: [["Ref No", "Entity Name", "Description", "Qty", "Total Kgs", "Total Value", "Rate"]],
            body: tableRows,
            theme: 'plain',
            headStyles: { textColor: [0, 0, 150], fontStyle: 'bold', fontSize: 8 }, // Blue text headers
            styles: { fontSize: 8, cellPadding: 3, lineColor: [240, 240, 240], lineWidth: 0.1 },
            columnStyles: {
                3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right' }
            },
            didDrawPage: (dataArg) => {
                // Signature lines at bottom of page
                const finalY = doc.internal.pageSize.getHeight() - 25;
                doc.setFontSize(9);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(0);
                doc.text("PREPARED BY", 20, finalY);
                doc.text("VERIFIED BY", pageWidth / 2, finalY, { align: 'center' });
                doc.text("APPROVED BY", pageWidth - 20, finalY, { align: 'right' });
            }
        });

        doc.save(`${title.replace(/\s+/g, '_')}_Report.pdf`);
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            
            {/* LEFT NAVIGATION: BI ENGINE */}
            <div className="w-80 flex flex-col bg-slate-900 text-white shadow-2xl z-20">
                <div className="p-8 border-b border-white/5 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                            <PieChart size={24} />
                        </div>
                        <h1 className="text-xl font-black uppercase italic tracking-tighter">Kayaar BI</h1>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Intelligence Engine v2.0</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {Object.keys(reportOptions).map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => {setCategory(cat); setSelectedReport('');}} 
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                                category === cat 
                                ? 'bg-blue-600 text-white shadow-xl translate-x-2' 
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={category === cat ? 'text-white' : 'text-slate-600 group-hover:text-blue-400'}>
                                    {icons[cat]}
                                </span>
                                <span className="font-black text-xs uppercase tracking-widest">{cat}</span>
                            </div>
                            <ChevronRight size={14} className={category === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                        </button>
                    ))}
                </nav>

                <div className="p-6 bg-white/5 m-4 rounded-[2rem] border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                        <CheckCircle2 size={14} />
                        <span className="text-[10px] font-black uppercase">System Online</span>
                    </div>
                    <p className="text-[9px] text-slate-500 leading-relaxed font-medium">Reporting servers are synced with Mill mainframes.</p>
                </div>
            </div>

            {/* MAIN WORKSPACE */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
                            <Filter size={20}/>
                        </div>
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Generate {category} Analytics</h2>
                    </div>
                    
                    <button 
                        onClick={produceDocument}
                        disabled={loading || !selectedReport}
                        className="bg-slate-900 text-white px-10 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'PROCESSING...' : 'PRODUCE DOCUMENT'} <ArrowRightCircle size={16}/>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-12 bg-slate-50/50 custom-scrollbar">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                        
                        {/* SELECTION LIST */}
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Available Report Modules</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {reportOptions[category].map(report => (
                                    <div 
                                        key={report.id}
                                        onClick={() => setSelectedReport(report.id)}
                                        className={`p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all flex items-center justify-between group ${
                                            selectedReport === report.id 
                                            ? 'bg-white border-blue-500 shadow-xl translate-x-2' 
                                            : 'bg-white border-transparent hover:border-slate-200 shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${
                                                selectedReport === report.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                                            }`}>
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-800 text-sm uppercase">{report.name}</h4>
                                                <p className="text-xs text-slate-400 font-medium">{report.desc}</p>
                                            </div>
                                        </div>
                                        {selectedReport === report.id && <CheckCircle2 size={24} className="text-blue-600" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FILTERS PANEL */}
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                                <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                                    <Calendar size={16} /> Period Parameters
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                            value={dateRange.start}
                                            onChange={e => setDateRange({...dateRange, start: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                            value={dateRange.end}
                                            onChange={e => setDateRange({...dateRange, end: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><BarChart3 size={100} /></div>
                                <h3 className="font-black text-blue-400 text-[10px] uppercase tracking-widest mb-4">Export Format</h3>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-medium mb-6">
                                    High-resolution PDF generation with automated branding and digital timestamps.
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-tighter">A4 Document</span>
                                    <span className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-tighter">Statutory-Ready</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            {/* HIDDEN AREA FOR HTML PRINTING */}
            <div style={{ display: 'none' }}>
                <InvoiceTemplate ref={componentRef} data={printData} />
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default ReportsDashboard;