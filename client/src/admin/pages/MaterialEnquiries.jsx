import React, { useState, useEffect } from 'react';
import { FiSearch, FiCheckCircle, FiClock, FiMessageSquare, FiTrash2, FiUser, FiInfo } from 'react-icons/fi';
import adminToast from '../utils/toast.js';

export const MaterialEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'NEW', 'CONTACTED', 'COMPLETED'
  
  // Seed initial mock enquiries to populate list on first load
  const initialEnquiries = [
    {
      id: 'enq-1',
      customerName: 'Patil Constructions',
      phone: '+91 98220 12345',
      category: 'Cement & Aggregates',
      message: 'Need urgent quote for 450 bags of Ultratech 53-grade cement for Alibag site delivery.',
      status: 'NEW',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'enq-2',
      customerName: 'Ramesh Sawant',
      phone: '+91 99234 56789',
      category: 'Structural Steel & Rebars',
      message: 'Looking for 3 Tons of Tata Tiscon 12mm TMT bars. Please confirm rate inclusive of transit.',
      status: 'CONTACTED',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      id: 'enq-3',
      customerName: 'Karan Mhatre',
      phone: '+91 94220 98765',
      category: 'Pipes & Fittings',
      message: 'Need 120 pieces of Astral 4-inch PVC drainage pipe. Please send best price sheet.',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('mhatre_enquiries');
    if (saved) {
      setEnquiries(JSON.parse(saved));
    } else {
      localStorage.setItem('mhatre_enquiries', JSON.stringify(initialEnquiries));
      setEnquiries(initialEnquiries);
    }
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e);
    setEnquiries(updated);
    localStorage.setItem('mhatre_enquiries', JSON.stringify(updated));
    adminToast.success(`Enquiry status updated to ${newStatus}`);
  };

  const deleteEnquiry = (id) => {
    const updated = enquiries.filter(e => e.id !== id);
    setEnquiries(updated);
    localStorage.setItem('mhatre_enquiries', JSON.stringify(updated));
    adminToast.success('Enquiry log entry removed');
  };

  // Filter list
  const filtered = enquiries.filter(e => {
    const matchesSearch = e.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          e.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#ECE7DF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headings text-2xl font-bold">Material Enquiries</h1>
          <p className="text-xs text-[#676767]">Manage customer requests and offline quotation workflows</p>
        </div>
      </div>

      {/* Advisory Info Banner */}
      <div className="bg-[#FCFBF8] border border-[#ECE7DF] p-4 rounded-xl flex gap-3 text-xs text-zinc-600 max-w-2xl">
        <FiInfo className="text-[#B56A45] text-lg shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>B2B Quote Dispatch:</strong> Direct catalog quotes from the customer website are routed to WhatsApp for instant offline processing. Use this directory to log, status-track, and coordinate fulfillment.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="flex items-center bg-[#FFFFFF] border border-[#ECE7DF] px-4 py-2 rounded-xl text-sm sm:col-span-2">
          <FiSearch className="text-zinc-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search enquiries by name, messages content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-0 focus:outline-hidden focus:ring-0 w-full"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex bg-[#FFFFFF] border border-[#ECE7DF] p-1 rounded-xl gap-1 text-xs">
          {['ALL', 'NEW', 'CONTACTED', 'COMPLETED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 py-1.5 rounded-lg font-bold text-center cursor-pointer transition-all ${
                filterStatus === status 
                  ? 'bg-[#B56A45] text-[#FFFFFF]' 
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {status === 'ALL' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries List Display */}
      {filtered.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] rounded-xl p-12 text-center text-zinc-400 text-sm">
          No enquiries match your filtering criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((enq) => (
            <div 
              key={enq.id} 
              className={`bg-[#FFFFFF] border rounded-2xl p-6 transition-all shadow-2xs hover:shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-6 ${
                enq.status === 'NEW' 
                  ? 'border-l-4 border-l-[#B56A45] border-[#ECE7DF]' 
                  : 'border-[#ECE7DF]'
              }`}
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#FCFBF8] border border-[#ECE7DF] flex items-center justify-center text-zinc-500">
                    <FiUser className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-zinc-800 text-sm leading-snug">{enq.customerName}</h3>
                    <p className="text-[10px] text-zinc-400 font-mono">{enq.phone} • {new Date(enq.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="bg-[#FCFBF8] p-3 rounded-lg border border-[#ECE7DF]/40 text-xs text-zinc-700">
                  <p className="font-semibold text-[10px] text-[#B56A45] uppercase tracking-wide mb-1">Division: {enq.category}</p>
                  <p className="leading-relaxed font-light font-mono">"{enq.message}"</p>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0">
                <select
                  value={enq.status}
                  onChange={(e) => updateStatus(enq.id, e.target.value)}
                  className={`text-xs font-semibold py-1.5 px-3 rounded-lg border focus:outline-hidden ${
                    enq.status === 'COMPLETED'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : enq.status === 'CONTACTED'
                      ? 'bg-amber-50 border-amber-200 text-[#B56A45]'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                  }`}
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="COMPLETED">FULFILLED</option>
                </select>

                <button
                  onClick={() => deleteEnquiry(enq.id)}
                  className="p-2 text-red-500 hover:bg-red-50 hover:border-red-100 border border-transparent rounded-lg transition-colors cursor-pointer"
                  title="Remove log entry"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MaterialEnquiries;
