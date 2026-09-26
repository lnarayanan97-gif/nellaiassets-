import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  Heart, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  ExternalLink,
  PlusCircle,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  Lock,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import { PropertyListing, PropertyEnquiry, UserProfile, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { fetchUserProperties, fetchSellerEnquiries, fetchBuyerEnquiries, deletePropertyListing, updatePropertyStatus } from '../services/propertyService';
import { NellaiAssetsLogo } from './NellaiAssetsLogo';

interface DashboardProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectProperty: (prop: PropertyListing) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectProperty }) => {
  const { userProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'listings' | 'enquiries' | 'profile'>('listings');
  const [userListings, setUserListings] = useState<PropertyListing[]>([]);
  const [enquiries, setEnquiries] = useState<PropertyEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const role = userProfile?.role || 'buyer';

  useEffect(() => {
    loadDashboardData();
  }, [userProfile]);

  const loadDashboardData = async () => {
    if (!userProfile) return;
    setLoading(true);
    try {
      if (role === 'buyer') {
        const enqs = await fetchBuyerEnquiries(userProfile.uid);
        setEnquiries(enqs);
      } else {
        const props = await fetchUserProperties(userProfile.uid);
        setUserListings(props);
        const enqs = await fetchSellerEnquiries(userProfile.uid);
        setEnquiries(enqs);
      }
    } catch (err) {
      console.warn('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this property listing?')) {
      await deletePropertyListing(id);
      setUserListings(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleMarkSold = async (id: string) => {
    await updatePropertyStatus(id, 'sold');
    setUserListings(prev => prev.map(p => p.id === id ? { ...p, status: 'sold' } : p));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Profile Summary Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#123F2B] to-[#245C3C] text-white flex items-center justify-center font-bold font-serif text-2xl shadow-md border-2 border-[#E0B25B]/40">
              {userProfile?.displayName?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-serif font-black text-[#18352A]">
                  {userProfile?.displayName || 'User Account'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {role === 'seller' ? 'Property Owner / Seller' : role}
                </span>
                {userProfile?.isVerified && (
                  <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {userProfile?.email} • {userProfile?.phone} • {userProfile?.city || 'Tirunelveli'}, Tamil Nadu
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {role !== 'buyer' && (
              <button
                onClick={() => onNavigate('post-property')}
                className="px-4 py-2.5 rounded-xl bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-[#E0B25B]" />
                <span>Add Property (Tirunelveli)</span>
              </button>
            )}

            {role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2.5 rounded-xl bg-[#B8892D] hover:bg-[#9a7224] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Nellai Assets CRM</span>
              </button>
            )}
          </div>

        </div>

        {/* Dashboard Privacy Notice Banner */}
        <div className="mt-6 p-3.5 rounded-2xl bg-[#F8F9F6] border border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#123F2B]" />
            <span>
              <strong>Nellai Assets Privacy Assurance:</strong> Direct phone numbers are protected from public scraping. Inquiries are coordinated through our advisory desk.
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#123F2B] hidden md:inline">
            Tirunelveli Exclusive
          </span>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="mt-6 flex items-center space-x-2 border-b border-stone-200">
          {role !== 'buyer' && (
            <button
              onClick={() => setActiveTab('listings')}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'listings'
                  ? 'border-[#123F2B] text-[#123F2B]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              My Listings ({userListings.length})
            </button>
          )}

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'enquiries'
                ? 'border-[#123F2B] text-[#123F2B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {role === 'buyer' ? 'My Advisory Inquiries' : 'Buyer Leads & Site Visits'} ({enquiries.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#123F2B] text-[#123F2B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Profile & Privacy Settings
          </button>
        </div>
      </div>

      {/* TAB CONTENT: MY LISTINGS */}
      {activeTab === 'listings' && role !== 'buyer' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#18352A]">Your Tirunelveli Properties</h2>
              <p className="text-xs text-stone-500">Listings are verified by Nellai Assets before public broadcast.</p>
            </div>
            <button
              onClick={() => onNavigate('post-property')}
              className="text-xs font-bold text-[#123F2B] hover:underline"
            >
              + Post Another Tirunelveli Property
            </button>
          </div>

          {userListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map(prop => (
                <div key={prop.id} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
                  <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-stone-100">
                    <img src={prop.coverImage || prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 left-2 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
                      prop.status === 'approved' ? 'bg-emerald-600' : prop.status === 'sold' ? 'bg-stone-700' : 'bg-amber-600'
                    }`}>
                      {prop.status}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      {prop.area}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#18352A] line-clamp-1">{prop.title}</h3>
                    <p className="text-xs text-stone-500">{prop.area}, Tirunelveli • {prop.propertyType}</p>
                    <p className="font-black text-sm text-[#123F2B] mt-1">₹{prop.price.toLocaleString('en-IN')}</p>
                  </div>

                  {prop.adminRejectionReason && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-800">
                      <strong>Moderation Feedback:</strong> {prop.adminRejectionReason}
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onSelectProperty(prop)}
                      className="text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View Listing
                    </button>

                    {prop.status !== 'sold' && (
                      <button
                        onClick={() => handleMarkSold(prop.id)}
                        className="text-amber-800 hover:underline font-semibold cursor-pointer"
                      >
                        Mark as Sold
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteListing(prop.id)}
                      className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                      title="Delete listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-stone-200">
              <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800">You haven't listed any property yet</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Post your residential plot, villa, flat or commercial space in Tirunelveli.
              </p>
              <button
                onClick={() => onNavigate('post-property')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#123F2B] text-white font-bold text-xs cursor-pointer shadow-xs hover:bg-[#1a553a]"
              >
                Post Your First Listing
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ENQUIRIES / LEADS */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#18352A]">
              {role === 'buyer' ? 'Your Inquiries & Scheduled Consultations' : 'Incoming Inquiries (Managed via Nellai Assets Gateway)'}
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              {enquiries.length} Inquiries recorded
            </span>
          </div>

          {enquiries.length > 0 ? (
            <div className="space-y-3">
              {enquiries.map(enq => (
                <div key={enq.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#B8892D]">Property Inquiry</span>
                      <h3 className="font-bold text-sm text-[#18352A]">{enq.propertyTitle}</h3>
                      <p className="text-xs text-stone-500">{enq.propertyLocation}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Status: {(enq.leadStatus || enq.status).replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Privacy Guard Explanation */}
                  <div className="p-3 rounded-xl bg-[#F8F9F6] border border-stone-200/80 text-xs space-y-1.5">
                    {role === 'buyer' ? (
                      <p className="text-stone-700">
                        <strong>Nellai Assets Coordinator:</strong> {enq.assignedAdvisor || 'Sundar Rajan K (Assets Adviser)'} is reviewing your inquiry with the property owner. You will receive an official update or call at your registered number.
                      </p>
                    ) : (
                      <div className="space-y-1 text-stone-700">
                        <p className="font-semibold text-[#123F2B] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#123F2B]" />
                          Protected Buyer Lead — Screening in Progress
                        </p>
                        <p className="text-stone-600">
                          Buyer: <strong>{enq.buyerName}</strong> • {enq.requestSiteVisit ? 'Requested Site Inspection' : 'Information Request'}.
                        </p>
                        <p className="text-stone-500 text-[11px]">
                          Nellai Assets will pre-screen buyer budget and schedule inspection appointments directly with you to eliminate unsolicited spam.
                        </p>
                      </div>
                    )}

                    <div className="mt-2 p-2.5 rounded-lg bg-white border border-stone-200 text-stone-600 italic">
                      "{enq.message}"
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                    <span>Submitted: {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="font-semibold text-stone-600">Assigned Adviser: {enq.assignedAdvisor || 'Sundar Rajan K'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-stone-200">
              <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800">No enquiries recorded yet</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                {role === 'buyer'
                  ? 'When you enquire about Tirunelveli plots, villas, or lands, your requests appear here.'
                  : 'Prospective buyer leads screened by Nellai Assets will appear here.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs max-w-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-[#18352A]">Account & Contact Profile</h2>
              <p className="text-xs text-stone-500">Contact details are securely kept within Nellai Assets records.</p>
            </div>
            <NellaiAssetsLogo size="sm" showTagline={false} />
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block font-bold text-stone-500 uppercase text-[10px]">Registered Name</span>
              <p className="font-bold text-stone-900 text-sm mt-0.5">{userProfile?.displayName}</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block font-bold text-stone-500 uppercase text-[10px]">Email Address</span>
              <p className="font-semibold text-stone-800 text-sm mt-0.5">{userProfile?.email}</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block font-bold text-stone-500 uppercase text-[10px]">Mobile / WhatsApp (Private)</span>
              <p className="font-semibold text-stone-800 text-sm mt-0.5">{userProfile?.phone}</p>
              <p className="text-[10px] text-emerald-800 mt-1 flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" /> Shielded from public listing displays
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block font-bold text-stone-500 uppercase text-[10px]">Marketplace Role</span>
              <p className="font-bold text-[#123F2B] uppercase text-sm mt-0.5">{userProfile?.role}</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block font-bold text-stone-500 uppercase text-[10px]">Primary District Scope</span>
              <p className="font-semibold text-stone-800 text-sm mt-0.5">Tirunelveli District, Tamil Nadu</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
