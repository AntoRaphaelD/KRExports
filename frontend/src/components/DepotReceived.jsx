import React, { useState, useEffect } from 'react';
import { mastersAPI } from '../service/api';

const DepotReceived = () => {
  const [loads, setLoads] = useState([]);
  const [selectedLoad, setSelectedLoad] = useState(null);

  useEffect(() => {
    // Only fetch loads that haven't been received yet
    transactionsAPI.despatch.getAll().then(res => setLoads(res.data.data));
  }, []);

  const handleConfirm = async () => {
    alert(`Stock for Load ${selectedLoad.load_no} confirmed at Depot.`);
    // Update logic here
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border p-8 shadow-2xl">
      <div className="bg-orange-600 text-white p-2 text-xs font-bold mb-6">DEPOT STOCK RECEIVE CONFIRMATION</div>
      
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold">SELECT PENDING IN-TRANSIT LOAD (From Despatch Table)</label>
          <select className="border p-3 bg-orange-50 font-bold" onChange={e => setSelectedLoad(loads.find(l => l.id == e.target.value))}>
            <option>-- Select Load No --</option>
            {loads.map(l => <option key={l.id} value={l.id}>{l.load_no} | Vehicle: {l.vehicle_no}</option>)}
          </select>
        </div>

        {selectedLoad && (
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 border animate-in fade-in">
             <div className="text-xs"><b>From Transport:</b> {selectedLoad.Transport?.transport_name}</div>
             <div className="text-xs"><b>Sent Date:</b> {selectedLoad.load_date}</div>
             <div className="text-xs"><b>Total Bags:</b> {selectedLoad.no_of_bags}</div>
             <div className="text-xs"><b>Destination:</b> {selectedLoad.delivery_place}</div>
          </div>
        )}

        <button 
          onClick={handleConfirm}
          disabled={!selectedLoad}
          className="w-full bg-orange-700 text-white font-bold py-4 disabled:bg-gray-300 shadow-lg"
        >
          CONFIRM RECEIPT & UPDATE DEPOT STOCK
        </button>
      </div>
    </div>
  );
};

export default DepotReceived;