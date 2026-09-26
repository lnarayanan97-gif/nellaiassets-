import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Send,
  Building2,
  Lock
} from 'lucide-react';
import { PropertyListing } from '../types';
import { NellaiAssetsLogo } from './NellaiAssetsLogo';
import { submitPropertyEnquiry } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyListing;
  initialType?: 'Enquiry' | 'Callback' | 'Site Visit' | 'WhatsApp';
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  property,
  initialType = 'Enquiry'
}) => {
  const { userProfile } = useAuth();
  
  const [leadType, setLeadType] = useState<'Enquiry' | 'Callback' | 'Site Visit'>(
    initialType === 'WhatsApp' ? 'Enquiry' : initialType
  );
  const [buyerName, setBuyerName] = useState(userProfile?.displayName || '');
  const [buyerPhone, setBuyerPhone] = useState(userProfile?.phone || '');
  const [buyerWhatsapp, setBuyerWhatsapp] = useState(userProfile?.whatsapp || userProfile?.phone || '');
  const [buyerEmail, setBuyerEmail] = useState(userProfile?.email || '');
  const [message, setMessage] = useState(
    `Hello Nellai Assets, I am interested in property ${property.id} (${property.title}) in ${property.area}, Tirunelveli. Please provide title verification details and arrange further steps.`
  );
  const [preferredContactTime, setPreferredContactTime] = useState<
    'Morning (9 AM - 12 PM)' | 'Afternoon (12 PM - 4 PM)' | 'Evening (4 PM - 8 PM)' | 'Anytime'
  >('Morning (9 AM - 12 PM)');
  const [siteVisitRequested, setSiteVisitRequested] = useState(initialType === 'Site Visit');
  const [preferredVisitDate, setPreferredVisitDate] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim()) return;

    setSubmitting(true);
    try {
      await submitPropertyEnquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyPrice: property.price,
        propertyLocation: `${property.area}, ${property.city}`,
        propertyCoverImage: property.coverImage || property.images[0],
        sellerId: property.userId,
        buyerId: userProfile?.uid,
        buyerName,
        buyerPhone,
        buyerWhatsapp: buyerWhatsapp || buyerPhone,
        buyerEmail,
        message,
        preferredContactTime,
        siteVisitRequested,
        preferredVisitDate: siteVisitRequested ? preferredVisitDate : undefined,
        leadType,
      });
      setSuccess(true);
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOfficialWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Nellai Assets,\n\nI am interested in this property.\n\nProperty:\n${property.title}\n\nProperty ID:\n${property.id}\n\nLocation:\n${property.area}, Tirunelveli\n\nI would like to know the price, availability and complete property details.\n\nName:\n${buyerName || 'Interested Buyer'}\n\nPlease contact me.`
    );
    window.open(`https://wa.me/919360390690?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-stone-100">
          <NellaiAssetsLogo size="sm" variant="dark" className="justify-center mb-2" />
          <h2 className="text-xl font-serif font-black text-[#18352A]">
            Enquire via Nellai Assets Advisory
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Your trusted property gateway in Tirunelveli District
          </p>
        </div>

        {/* Property Compact Preview */}
        <div className="my-4 p-3 rounded-xl bg-[#F5F6F3] border border-stone-200/80 flex items-center gap-3">
          <img
            src={property.coverImage || property.images[0]}
            alt={property.title}
            className="w-16 h-12 rounded-lg object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8892D]">
              Property ID: {property.id}
            </span>
            <h4 className="text-xs font-bold text-stone-800 truncate">{property.title}</h4>
            <p className="text-[11px] text-stone-500">{property.area}, Tirunelveli</p>
          </div>
        </div>

        {/* Success View */}
        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-emerald-950">
                Enquiry Registered with Nellai Assets
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto leading-relaxed">
                Your request has been logged into our Tirunelveli advisory system. An assigned representative will contact you during your preferred time window to coordinate document inspection and site visit.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-100 text-xs text-emerald-900 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-700 inline mr-1" />
              Contact Privacy Secured: Your phone number is strictly protected.
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleOfficialWhatsApp}
                className="flex-1 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#123F2B] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            {/* Request Type Selector */}
            <div>
              <label className="block font-bold text-stone-600 mb-1.5 uppercase tracking-wider text-[10px]">
                Enquiry Type *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLeadType('Enquiry');
                    setSiteVisitRequested(false);
                  }}
                  className={`py-2 rounded-lg font-bold text-center transition-all ${
                    leadType === 'Enquiry' && !siteVisitRequested
                      ? 'bg-[#123F2B] text-white'
                      : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  General Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLeadType('Callback');
                    setSiteVisitRequested(false);
                  }}
                  className={`py-2 rounded-lg font-bold text-center transition-all ${
                    leadType === 'Callback' && !siteVisitRequested
                      ? 'bg-[#123F2B] text-white'
                      : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Request Callback
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLeadType('Site Visit');
                    setSiteVisitRequested(true);
                  }}
                  className={`py-2 rounded-lg font-bold text-center transition-all ${
                    siteVisitRequested
                      ? 'bg-[#123F2B] text-white'
                      : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Schedule Visit
                </button>
              </div>
            </div>

            {/* Buyer Contact Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-stone-600 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Senthil Nathan"
                  className="w-full bg-[#F5F6F3] border border-stone-300 rounded-lg p-2 text-stone-800 focus:outline-emerald-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-600 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => {
                    setBuyerPhone(e.target.value);
                    if (!buyerWhatsapp) setBuyerWhatsapp(e.target.value);
                  }}
                  placeholder="+91 94431 00000"
                  className="w-full bg-[#F5F6F3] border border-stone-300 rounded-lg p-2 text-stone-800 focus:outline-emerald-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-stone-600 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  value={buyerWhatsapp}
                  onChange={(e) => setBuyerWhatsapp(e.target.value)}
                  placeholder="+91 94431 00000"
                  className="w-full bg-[#F5F6F3] border border-stone-300 rounded-lg p-2 text-stone-800 focus:outline-emerald-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-600 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="buyer@gmail.com"
                  className="w-full bg-[#F5F6F3] border border-stone-300 rounded-lg p-2 text-stone-800 focus:outline-emerald-800"
                />
              </div>
            </div>

            {/* Preferred Contact Time */}
            <div>
              <label className="block font-bold text-stone-600 mb-1">Preferred Callback Window</label>
              <select
                value={preferredContactTime}
                onChange={(e) => setPreferredContactTime(e.target.value as any)}
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-lg p-2 text-stone-800 focus:outline-emerald-800"
              >
                <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                <option value="Anytime">Anytime during working hours</option>
              </select>
            </div>

            {/* Site Visit Specific */}
            {siteVisitRequested && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Calendar className="w-4 h-4 text-[#B8892D]" />
                  <span>Request Accompanied Site Visit</span>
                </div>
                <input
                  type="date"
                  value={preferredVisitDate}
                  onChange={(e) => setPreferredVisitDate(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-lg p-1.5 text-stone-800"
                />
                <p className="text-[10px] text-amber-800">
                  A Nellai Assets adviser will coordinate with the property owner and accompany you for site inspection.
                </p>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block font-bold text-stone-600 mb-1">Message / Question</label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-lg p-2 text-stone-800 focus:outline-emerald-800 resize-none leading-relaxed"
              />
            </div>

            {/* Privacy Safeguard Notice */}
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2 text-[10px] text-emerald-900">
              <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Guaranteed:</strong> Your contact details are shared securely with Nellai Assets for property assistance. Neither seller nor buyer personal numbers are publicly broadcasted.
              </span>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Registering Enquiry...' : 'Submit Enquiry to Nellai Assets'}</span>
              </button>

              <button
                type="button"
                onClick={handleOfficialWhatsApp}
                className="w-full py-2.5 rounded-xl border border-[#25D366] text-[#123F2B] hover:bg-[#25D366]/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Instant WhatsApp Enquiry to +91 94431 23456</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
