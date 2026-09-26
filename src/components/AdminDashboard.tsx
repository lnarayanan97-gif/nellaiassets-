import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Trash2, 
  ExternalLink,
  Users,
  Building,
  MessageSquare,
  Search,
  Check,
  Ban,
  Phone,
  Calendar,
  Clock,
  Send,
  Edit3,
  UserCheck,
  FileText,
  Filter,
  ArrowRight
} from 'lucide-react';
import { PropertyListing, PropertyEnquiry, ListingStatus, LeadStatus } from '../types';
import { 
  fetchAllPropertiesAdmin, 
  fetchAllEnquiriesAdmin, 
  updatePropertyStatus, 
  deletePropertyListing,
  updateLeadStatusAndNotes,
  assignLeadToAdvisor
} from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import { NellaiAssetsLogo } from './NellaiAssetsLogo';

interface AdminDashboardProps {
  onSelectProperty: (prop: PropertyListing) => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectProperty, onExitAdmin }) => {
  const { userProfile } = useAuth();
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [enquiries, setEnquiries] = useState<PropertyEnquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'listings'>('leads');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [leadFilterStatus, setLeadFilterStatus] = useState<string>('all');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [rejectingPropId, setRejectingPropId] = useState<string | null>(null);

  // Selected lead for detail/CRM actions
  const [selectedLead, setSelectedLead] = useState<PropertyEnquiry | null>(null);
  const [internalNoteInput, setInternalNoteInput] = useState('');
  const [updatingLead, setUpdatingLead] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [props, enqs] = await Promise.all([
        fetchAllPropertiesAdmin(),
        fetchAllEnquiriesAdmin()
      ]);
      setProperties(props);
      setEnquiries(enqs);
      if (enqs.length > 0 && !selectedLead) {
        setSelectedLead(enqs[0]);
      }
    } catch (err) {
      console.warn('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    await updatePropertyStatus(id, 'approved');
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'approved', isVerified: true } : p));
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason for seller correction');
      return;
    }
    await updatePropertyStatus(id, 'rejected', rejectionReason);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected', adminRejectionReason: rejectionReason } : p));
    setRejectingPropId(null);
    setRejectionReason('');
  };

  const handleSuspend = async (id: string) => {
    await updatePropertyStatus(id, 'suspended');
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'suspended' } : p));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this listing permanently from the database?')) {
      await deletePropertyListing(id);
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    setUpdatingLead(true);
    try {
      await updateLeadStatusAndNotes(leadId, newStatus);
      setEnquiries(prev => prev.map(e => e.id === leadId ? { ...e, leadStatus: newStatus } : e));
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, leadStatus: newStatus } : null);
      }
    } finally {
      setUpdatingLead(false);
    }
  };

  const handleAddInternalNote = async (leadId: string) => {
    if (!internalNoteInput.trim()) return;
    setUpdatingLead(true);
    try {
      const currentNotes = selectedLead?.internalNotes || [];
      const updatedNotes = [...currentNotes, `[${new Date().toLocaleDateString()}] ${internalNoteInput.trim()}`];
      await updateLeadStatusAndNotes(leadId, selectedLead?.leadStatus || 'new', updatedNotes);
      setEnquiries(prev => prev.map(e => e.id === leadId ? { ...e, internalNotes: updatedNotes } : e));
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, internalNotes: updatedNotes } : null);
      }
      setInternalNoteInput('');
    } finally {
      setUpdatingLead(false);
    }
  };

  const handleAssignAdvisor = async (leadId: string, advisorName: string) => {
    setUpdatingLead(true);
    try {
      await assignLeadToAdvisor(leadId, advisorName);
      setEnquiries(prev => prev.map(e => e.id === leadId ? { ...e, assignedAdvisor: advisorName } : e));
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, assignedAdvisor: advisorName } : null);
      }
    } finally {
      setUpdatingLead(false);
    }
  };

  const filteredProperties = properties.filter(p => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  const filteredEnquiries = enquiries.filter(e => {
    if (leadFilterStatus === 'all') return true;
    return (e.leadStatus || 'new') === leadFilterStatus;
  });

  const getStatusColor = (status?: LeadStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'qualified': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'site_visit_scheduled': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'converted': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'closed': return 'bg-stone-100 text-stone-700 border-stone-200';
      case 'not_interested': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Top Header Banner with Official Branding */}
      <div className="bg-[#123F2B] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <NellaiAssetsLogo variant="white" size="sm" showTagline={false} />
              <span className="text-xs font-bold uppercase tracking-wider text-[#E0B25B] bg-white/10 px-3 py-1 rounded-full border border-[#E0B25B]/30">
                Nellai Assets Advisory & CRM Gateway
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black">
              Tirunelveli Central Control & Moderation
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl leading-relaxed">
              Nellai Assets acts as the active discovery, verification, and enquiry advisory bridge. Contact privacy is strictly enforced: buyer and seller personal numbers are protected and coordinated through our advisory desk.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20 cursor-pointer"
            >
              Exit to Marketplace
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-emerald-800/80">
          <div className="bg-white/5 p-4 rounded-xl backdrop-blur-xs border border-white/10">
            <span className="text-[10px] uppercase font-bold text-[#E0B25B]">Active Leads / Enquiries</span>
            <p className="text-2xl font-black text-white mt-1">{enquiries.length}</p>
            <p className="text-[10px] text-emerald-200/70 mt-0.5">Tirunelveli buyers</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl backdrop-blur-xs border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Pending Review Listings</span>
            <p className="text-2xl font-black text-[#F4D068] mt-1">
              {properties.filter(p => p.status === 'pending_review').length}
            </p>
            <p className="text-[10px] text-emerald-200/70 mt-0.5">Awaiting verification</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl backdrop-blur-xs border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Approved Live Properties</span>
            <p className="text-2xl font-black text-emerald-300 mt-1">
              {properties.filter(p => p.status === 'approved').length}
            </p>
            <p className="text-[10px] text-emerald-200/70 mt-0.5">Publicly listed</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl backdrop-blur-xs border border-white/10">
            <span className="text-[10px] uppercase font-bold text-[#E0B25B]">Advisory Desks</span>
            <p className="text-2xl font-black text-white mt-1">Sundar Rajan K</p>
            <p className="text-[10px] text-emerald-200/70 mt-0.5">Chief Assets Adviser</p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'leads' 
              ? 'bg-[#123F2B] text-white shadow-md' 
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#E0B25B]" />
          <span>Nellai Assets Lead Management CRM ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'listings' 
              ? 'bg-[#123F2B] text-white shadow-md' 
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#E0B25B]" />
          <span>Listings Moderation & Verification ({properties.length})</span>
        </button>
      </div>

      {/* TAB 1: LEAD MANAGEMENT CRM */}
      {activeTab === 'leads' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Leads Listing Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-[#18352A]">Buyer Inquiries & Leads</h3>
                <span className="text-[11px] text-stone-500 font-semibold">{filteredEnquiries.length} results</span>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-stone-400" />
                <select
                  value={leadFilterStatus}
                  onChange={(e) => setLeadFilterStatus(e.target.value)}
                  className="w-full text-xs font-semibold bg-[#F5F6F3] border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800"
                >
                  <option value="all">All Lead Pipeline Stages</option>
                  <option value="new">New Inquiries</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="site_visit_scheduled">Site Visit Scheduled</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                  <option value="not_interested">Not Interested</option>
                </select>
              </div>
            </div>

            {/* List of Leads */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map(enq => (
                  <div
                    key={enq.id}
                    onClick={() => setSelectedLead(enq)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedLead?.id === enq.id
                        ? 'bg-emerald-50/70 border-[#123F2B] shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-[#18352A] line-clamp-1">{enq.buyerName}</h4>
                        <p className="text-[11px] text-stone-500 line-clamp-1">{enq.propertyTitle}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusColor(enq.leadStatus)}`}>
                        {(enq.leadStatus || 'new').replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 line-clamp-2 mt-2 italic bg-stone-50/80 p-1.5 rounded">
                      "{enq.message}"
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                      <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                      <span className="font-semibold text-emerald-800">
                        Advisor: {enq.assignedAdvisor || 'Sundar Rajan K'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                  No inquiries found matching selected filter.
                </div>
              )}
            </div>
          </div>

          {/* Selected Lead Detailed Management Card */}
          <div className="lg:col-span-7">
            {selectedLead ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-[#B8892D]">Lead Details</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(selectedLead.leadStatus)}`}>
                        {(selectedLead.leadStatus || 'new').replace('_', ' ')}
                      </span>
                    </div>
                    <h2 className="text-xl font-serif font-black text-[#18352A] mt-1">{selectedLead.buyerName}</h2>
                    <p className="text-xs text-stone-500">Inquired on {new Date(selectedLead.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedLead.buyerPhone}`}
                      className="px-3.5 py-2 rounded-xl bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#E0B25B]" />
                      <span>Call Buyer ({selectedLead.buyerPhone})</span>
                    </a>
                  </div>
                </div>

                {/* Property & Request Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-400 uppercase text-[10px]">Property Subject</span>
                    <p className="font-bold text-[#18352A]">{selectedLead.propertyTitle}</p>
                    <p className="text-stone-500">{selectedLead.propertyLocation}</p>
                    {selectedLead.propertyPrice > 0 && (
                      <p className="font-black text-[#123F2B] text-sm">₹{selectedLead.propertyPrice.toLocaleString('en-IN')}</p>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-400 uppercase text-[10px]">Buyer Contact Details</span>
                    <p className="font-semibold text-stone-800">Phone: {selectedLead.buyerPhone}</p>
                    {selectedLead.buyerEmail && <p className="text-stone-600">Email: {selectedLead.buyerEmail}</p>}
                    <p className="text-stone-500">
                      Best Time: <strong>{selectedLead.preferredTime || 'Anytime'}</strong>
                    </p>
                    {selectedLead.requestSiteVisit && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                        ✓ Requested Site Inspection
                      </span>
                    )}
                  </div>
                </div>

                {/* Buyer Message */}
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
                  <span className="text-[10px] uppercase font-bold text-[#B8892D]">Buyer Query Message</span>
                  <p className="text-xs text-stone-800 mt-1 leading-relaxed">
                    "{selectedLead.message}"
                  </p>
                </div>

                {/* Workflow Status Progression */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">
                    Update Lead Pipeline Status (Nellai Assets Advisory)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { status: 'new', label: 'New' },
                      { status: 'contacted', label: 'Contacted' },
                      { status: 'qualified', label: 'Qualified' },
                      { status: 'site_visit_scheduled', label: 'Site Visit' },
                      { status: 'negotiation', label: 'Negotiation' },
                      { status: 'converted', label: 'Converted' },
                      { status: 'closed', label: 'Closed' },
                      { status: 'not_interested', label: 'Not Interested' }
                    ].map(st => (
                      <button
                        key={st.status}
                        onClick={() => handleUpdateLeadStatus(selectedLead.id, st.status as LeadStatus)}
                        disabled={updatingLead}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all text-center border cursor-pointer ${
                          selectedLead.leadStatus === st.status
                            ? 'bg-[#123F2B] text-white border-[#123F2B] shadow-xs'
                            : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advisor Assignment */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <div>
                    <span className="font-bold text-stone-500 uppercase text-[10px]">Assigned Advisory Officer</span>
                    <p className="font-bold text-[#18352A] mt-0.5">
                      {selectedLead.assignedAdvisor || 'Sundar Rajan K (Founder)'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAssignAdvisor(selectedLead.id, 'Sundar Rajan K')}
                      className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 font-bold text-[11px] text-stone-700 hover:bg-stone-100"
                    >
                      Assign Sundar Rajan K
                    </button>
                    <button
                      onClick={() => handleAssignAdvisor(selectedLead.id, 'Nellai Assets Desk')}
                      className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 font-bold text-[11px] text-stone-700 hover:bg-stone-100"
                    >
                      Assign Desk Team
                    </button>
                  </div>
                </div>

                {/* Internal Notes CRM */}
                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#B8892D]" />
                    <span>Internal Advisory Notes & Activity Log</span>
                  </h4>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedLead.internalNotes && selectedLead.internalNotes.length > 0 ? (
                      selectedLead.internalNotes.map((note, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-[#F8F9F6] border border-stone-200 text-xs text-stone-700">
                          {note}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-400 italic">No notes recorded yet.</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={internalNoteInput}
                      onChange={(e) => setInternalNoteInput(e.target.value)}
                      placeholder="Add advisory note (e.g. 'Buyer budget confirmed at 42L. Site visit set for Saturday 11am')..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#123F2B] outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddInternalNote(selectedLead.id);
                      }}
                    />
                    <button
                      onClick={() => handleAddInternalNote(selectedLead.id)}
                      disabled={updatingLead || !internalNoteInput.trim()}
                      className="px-4 py-2 bg-[#123F2B] text-white text-xs font-bold rounded-xl hover:bg-[#1a553a] disabled:opacity-50"
                    >
                      Save Note
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400">
                Select an inquiry from the left to view full buyer specifications and CRM controls.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: LISTINGS MODERATION */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-[#18352A]">Property Listings Verification Desk</h2>
              <p className="text-xs text-stone-500">Ensure revenue records, DTCP approvals, and genuine Tirunelveli properties before publishing.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500">Filter Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#F5F6F3] border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-stone-800"
              >
                <option value="all">All ({properties.length})</option>
                <option value="pending_review">Pending Review ({properties.filter(p => p.status === 'pending_review').length})</option>
                <option value="approved">Approved Live</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#F5F6F3] text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Private Seller Contact</th>
                  <th className="py-3 px-4">Price / Area</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProperties.map(prop => (
                  <tr key={prop.id} className="hover:bg-stone-50/60 transition-colors">
                    
                    {/* Property info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={prop.coverImage || prop.images[0]} 
                          alt={prop.title} 
                          className="w-14 h-10 object-cover rounded-md shrink-0" 
                        />
                        <div className="max-w-xs">
                          <button
                            onClick={() => onSelectProperty(prop)}
                            className="font-bold text-stone-900 hover:text-[#123F2B] text-left line-clamp-1 truncate cursor-pointer"
                          >
                            {prop.title}
                          </button>
                          <p className="text-[11px] text-stone-500">{prop.area}, {prop.city} • {prop.propertyType}</p>
                        </div>
                      </div>
                    </td>

                    {/* Private Seller info (Admin-only view) */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-stone-800">{prop.sellerName}</p>
                      <p className="text-[11px] text-stone-500 font-mono">
                        {prop.sellerPrivateContact?.phone || prop.sellerPhone} ({prop.sellerRole})
                      </p>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#123F2B]">₹{prop.price.toLocaleString('en-IN')}</p>
                      <p className="text-[11px] text-stone-500">{prop.landAreaCent ? `${prop.landAreaCent} Cents` : `${prop.landAreaSqft} sq.ft`}</p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        prop.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : prop.status === 'pending_review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {prop.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      {prop.status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(prop.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                          title="Approve and mark verified"
                        >
                          Approve
                        </button>
                      )}

                      {prop.status !== 'rejected' && (
                        <button
                          onClick={() => setRejectingPropId(prop.id)}
                          className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] cursor-pointer"
                        >
                          Reject
                        </button>
                      )}

                      {prop.status === 'approved' && (
                        <button
                          onClick={() => handleSuspend(prop.id)}
                          className="px-2.5 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-[11px] cursor-pointer"
                        >
                          Suspend
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rejection Modal / Prompt */}
          {rejectingPropId && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
                <h3 className="font-bold text-[#18352A]">Specify Rejection Reason</h3>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Missing DTCP approval certificate or invalid survey number for Palayamkottai revenue boundary..."
                  className="w-full h-24 p-3 border border-stone-300 rounded-xl text-xs outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => { setRejectingPropId(null); setRejectionReason(''); }}
                    className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReject(rejectingPropId)}
                    className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
