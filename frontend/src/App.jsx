import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ChevronRight, Database, LayoutDashboard, Settings, 
  Truck, Factory, FileText, Users, Package, MapPin 
} from 'lucide-react';

// --- Master Components ---
import AccountMaster from './components/AccountMaster'; // Img 7 & 8
import BrokerMaster from './components/BrokerMaster';   // Img 4
import ProductMaster from './components/ProductMaster'; // Img 1
import TariffMaster from './components/TariffMaster';   // Img 2
import TransportMaster from './components/TransportMaster'; // Img 3
import InvoiceTypeMaster from './components/InvoiceTypeMaster'; // Img 12
import PackingTypeMaster from './components/PackingTypeMaster'; // Img 5
import SpinningCountMaster from './components/SpinningCountMaster'; // Added for dynamic counts

// --- Transactional Components ---
import OrderConfirmation from './components/OrderConfirmation'; // Sales With Order (Img 9, 10, 11)
import SalesWithoutOrder from './components/SalesWithoutOrder'; // Image 6
import RG1Production from './components/RG1Production';         // Image 12 - Bottom
import DespatchEntry from './components/DespatchEntry';         // Images 13 & 14

/**
 * Sidebar Navigation Link
 * Logic matches the sidebar UI in the source images
 */
const SidebarLink = ({ to, label, icon: Icon }) => {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-4 py-2 text-[11px] transition-all duration-200
        ${active 
          ? 'bg-blue-600 text-white font-bold shadow-md transform scale-105 rounded-sm z-10' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
        }`}
    >
      {Icon && <Icon size={14} className={active ? 'text-white' : 'text-gray-400'} />}
      {!Icon && <ChevronRight size={12} className={active ? 'text-white' : 'text-gray-400'} />} 
      {label}
    </Link>
  );
};

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#E2E8F0] overflow-hidden font-sans">
        
        {/* --- Sidebar: Kayaar System Navigation --- */}
        <aside className="w-64 bg-white border-r border-gray-300 shadow-2xl flex flex-col z-20">
          {/* Top Logo Area */}
          <div className="p-4 bg-gradient-to-b from-blue-800 to-blue-950 text-white flex items-center gap-3 shadow-lg">
            <div className="bg-white p-1 rounded-md">
                <Database size={24} className="text-blue-900" />
            </div>
            <div>
              <div className="text-[9px] font-black tracking-widest opacity-60">KAYAAR EXPORTS</div>
              <div className="text-[11px] font-bold uppercase leading-tight">Sales Mgmt System</div>
            </div>
          </div>

          <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {/* Masters Section */}
            <div className="px-4 text-[10px] font-black text-blue-800 uppercase mb-2 mt-2 tracking-widest flex items-center gap-2 border-b border-blue-50 pb-1">
              <Settings size={10}/> System Masters
            </div>
            <SidebarLink to="/accounts" label="Accounts Master" icon={Users} />
            <SidebarLink to="/product" label="Product Master" icon={Package} />
            <SidebarLink to="/tariff" label="Tariff Sub Head" icon={FileText} />
            <SidebarLink to="/spinning-counts" label="Spinning Counts" icon={LayoutDashboard} />
            <SidebarLink to="/broker" label="Broker Master" />
            <SidebarLink to="/transport" label="Transport Master" icon={MapPin} />
            <SidebarLink to="/invoice" label="Invoice Types" />
            <SidebarLink to="/packing" label="Packing Types" />

            <div className="h-px bg-gray-200 my-4 mx-4 shadow-inner"></div>

            {/* Transactions Section */}
            <div className="px-4 text-[10px] font-black text-red-700 uppercase mb-2 tracking-widest flex items-center gap-2 border-b border-red-50 pb-1">
              <Factory size={10}/> Transactions (Yarn)
            </div>
            <SidebarLink to="/order-with" label="Sales With Order" />
            <SidebarLink to="/order-without" label="Sales Without Order" />
            <SidebarLink to="/production" label="RG1 Production" icon={Factory} />
            <SidebarLink to="/despatch" label="Despatch Entry" icon={Truck} />
          </nav>

          {/* Windows-style System Tray Info */}
          <div className="p-2 border-t bg-gray-100 text-[10px] text-center text-gray-500 font-mono">
            V 2026.01 | Admin: ONLINE
          </div>
        </aside>

        {/* --- Main Viewport --- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Banner Header mirroring image header text exactly */}
          <header className="bg-white h-14 border-b border-gray-300 flex items-center justify-between px-6 shadow-md z-10">
            <h1 className="text-[#B91C1C] font-black text-sm uppercase tracking-widest flex items-center gap-3">
              <span className="bg-[#B91C1C] text-white px-2 py-0.5 rounded-sm">KR</span>
              KAYAAR EXPORTS PRIVATE LIMITED [ 2025 - 2026 ]
            </h1>
            <div className="flex items-center gap-6 text-[11px] font-bold text-gray-600">
               <div className="flex flex-col items-end">
                  <span className="text-gray-400 text-[9px]">FINANCIAL YEAR</span>
                  <span>2025-2026</span>
               </div>
               <div className="h-8 w-px bg-gray-200"></div>
               <div className="flex flex-col items-end">
                  <span className="text-gray-400 text-[9px]">SYSTEM DATE</span>
                  <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
               </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-auto p-6 bg-slate-200 shadow-inner">
            <div className="max-w-[1500px] mx-auto">
              <Routes>
                {/* --- Master Module Routes --- */}
                <Route path="/accounts" element={<AccountMaster />} />
                <Route path="/product" element={<ProductMaster />} />
                <Route path="/tariff" element={<TariffMaster />} />
                <Route path="/spinning-counts" element={<SpinningCountMaster />} />
                <Route path="/broker" element={<BrokerMaster />} />
                <Route path="/transport" element={<TransportMaster />} />
                <Route path="/invoice" element={<InvoiceTypeMaster />} />
                <Route path="/packing" element={<PackingTypeMaster />} />

                {/* --- Transaction Module Routes --- */}
                <Route path="/order-with" element={<OrderConfirmation />} />
                <Route path="/order-without" element={<SalesWithoutOrder />} />
                <Route path="/production" element={<RG1Production />} />
                <Route path="/despatch" element={<DespatchEntry />} />

                {/* --- Dashboard / Initial View --- */}
                <Route path="/" element={
                  <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400 animate-pulse">
                    <div className="bg-white p-12 rounded-full shadow-2xl mb-6">
                        <LayoutDashboard size={80} className="opacity-30" />
                    </div>
                    <p className="text-xl font-black uppercase tracking-tighter italic">Kayaar Exports Management Portal</p>
                    <p className="text-sm">Please select a master or transaction to manage records.</p>
                  </div>
                } />
              </Routes>
            </div>
          </main>
          
          {/* Windows-style Taskbar info */}
          <footer className="h-6 bg-blue-900 text-white text-[9px] px-4 flex items-center justify-between">
             <div>CAPS LOCK: OFF | NUM LOCK: ON</div>
             <div className="flex gap-4">
                <span>Database: MySQL_Production</span>
                <span>Server: Localhost</span>
             </div>
          </footer>
        </div>

      </div>
    </Router>
  );
}