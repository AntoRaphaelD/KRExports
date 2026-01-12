import React, { useState } from 'react';
import { mastersAPI } from '../service/api';

const AccountMaster = () => {
  const [form, setForm] = useState({ account_code: '', account_name: '', place: '', gst_no: '', email: '', phone_no: '', opening_credit: 0 });

  const onSave = async () => {
    await mastersAPI.accounts.create(form);
    alert("Account Saved");
  };

  return (
    <div className="bg-white p-8 rounded border shadow-md">
      <div className="bg-blue-100 p-2 text-blue-900 font-bold mb-6 text-sm uppercase">Accounts Master</div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {Object.keys(form).map(key => (
          <div key={key} className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">{key.replace('_', ' ')}</label>
            <input 
              className="border p-2 rounded focus:ring-1 focus:ring-blue-400 outline-none text-sm"
              value={form[key]} 
              onChange={e => setForm({...form, [key]: e.target.value})} 
            />
          </div>
        ))}
        <div className="col-span-2 flex justify-end gap-2 mt-6">
          <button className="bg-gray-200 px-6 py-2 text-sm font-bold">CANCEL</button>
          <button onClick={onSave} className="bg-blue-700 text-white px-10 py-2 text-sm font-bold shadow-lg">UPDATE MASTER</button>
        </div>
      </div>
    </div>
  );
};

export default AccountMaster;