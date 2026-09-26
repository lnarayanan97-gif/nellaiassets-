import React, { useState } from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  CheckCircle2, 
  Heart, 
  Phone, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  Calendar, 
  ArrowLeft,
  Eye,
  Send,
  Building,
  Flag,
  ChevronRight,
  ExternalLink,
  Award,
  Sparkles,
  Lock,
  Clock,
  Compass
} from 'lucide-react';
import { PropertyListing } from '../types';
import { submitPropertyEnquiry } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import { NellaiAssetsLogo } from './NellaiAssetsLogo';
import { EnquiryModal } from './EnquiryModal';

interface PropertyDetailsProps {
  property: PropertyListing;
  onBack: () => void;
  onSelectProperty: (prop: PropertyListing) => void;
  similarProperties: PropertyListing[];
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  onBack,
  onSelectProperty,
  similarProperties
}) => {
  const { userProfile } = useAuth();
  const [selectedImage, setSelectedImage] = useState(property.coverImage || property.images[0]);
  
  // Enquiry state
  const [buyerName, setBuyerName] = useState(userProfile?.displayName || '');
  const [buyerPhone, setBuyerPhone] = useState(userProfile?.phone || '');
  const [buyerEmail, setBuyerEmail] = useState(userProfile?.email || '');
  const [preferredContactTime, setPreferredContactTime] = useState<
    'Morning (9 AM - 12 PM)' | 'Afternoon (12 PM - 4 PM)' | 'Evening (4 PM - 8 PM)' | 'Anytime'
  >('Morning (9 AM - 12 PM)');
  const [siteVisitRequested, setSiteVisitRequested] = useState(false);
  const [preferredVisitDate, setPreferredVisitDate] = useState('');
  const [buyerMessage, setBuyerMessage] = useState(
    `Hello Nellai Assets, I am interested in property ${property.id} (${property.title}) in ${property.area}, Tirunelveli. Please provide title verification details and arrange a site visit.`
  );
  
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modal state for site visit or callback
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'Enquiry' | 'Callback' | 'Site Visit'>('Enquiry');

  const formatPrice = (val: number, purpose: string) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    if (purpose === 'For Rent' || purpose === 'Lease') {
      return `₹${val.toLocaleString('en-IN')}/month`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) return;

    setSubmitting(true);
    try {
      await submitPropertyEnquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyPrice: property.price,
        propertyLocation: `${property.area}, Tirunelveli`,
        propertyCoverImage: property.coverImage || property.images[0],
        sellerId: property.userId,
        buyerId: userProfile?.uid,
        buyerName,
        buyerPhone,
        buyerWhatsapp: buyerPhone,
        buyerEmail,
        message: buyerMessage,
        leadType: siteVisitRequested ? 'Site Visit' : 'Enquiry',
        preferredContactTime,
        siteVisitRequested,
        preferredVisitDate: siteVisitRequested ? preferredVisitDate : undefined,
      });
      setEnquirySuccess(true);
    } catch (err) {
      console.error('Enquiry submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const officialPhone = '+91 93603 90690';
  const officialWhatsappUrl = 'https://wa.me/919360390690';

  // Official Nellai Assets WhatsApp Flow with exact requested message format
  const handleWhatsAppNellaiAssets = () => {
    const text = encodeURIComponent(
      `Hello Nellai Assets,\n\nI am interested in this property.\n\nProperty:\n${property.title}\n\nProperty ID:\n${property.id}\n\nLocation:\n${property.area}, Tirunelveli\n\nI would like to know the price, availability and complete property details.\n\nName:\n${buyerName || 'Interested Buyer'}\n\nPlease contact me.`
    );
    window.open(`https://wa.me/919360390690?text=${text}`, '_blank');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const openActionModal = (type: 'Enquiry' | 'Callback' | 'Site Visit') => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#123F2B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tirunelveli Properties</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Property'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Media & Specs (8 cols), Right Advisory Card & Enquiry (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: 8 COLS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Media Showcase */}
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs">
            <div className="relative aspect-16/9 bg-stone-900 overflow-hidden">
              <img
                src={selectedImage}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-[#123F2B] text-white shadow-md">
                  {property.listingPurpose}
                </span>
                {property.isVerified && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white flex items-center gap-1 shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E0B25B]" /> Verified by Nellai Assets
                  </span>
                )}
              </div>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-black/70 text-[#F4D068] backdrop-blur-md shadow-md">
                  {property.id}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {property.images && property.images.length > 1 && (
              <div className="p-3 bg-stone-50 border-t border-stone-200 flex gap-2 overflow-x-auto">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === img ? 'border-[#123F2B] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Key Highlights Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-2">
                <MapPin className="w-4 h-4 text-[#B8892D]" />
                <span>{property.locationName ? `${property.locationName}, ` : ''}{property.area}, Tirunelveli District - {property.pincode}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#18352A] leading-tight">
                {property.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-baseline gap-4 pb-4 border-b border-stone-100">
                <span className="text-3xl font-black text-[#123F2B]">
                  {formatPrice(property.price, property.listingPurpose)}
                </span>
                {property.pricePerSqft && (
                  <span className="text-sm font-semibold text-stone-500">
                    (₹{property.pricePerSqft.toLocaleString('en-IN')} per sq.ft)
                  </span>
                )}
                {property.negotiable && (
                  <span className="text-xs px-2.5 py-1 rounded bg-amber-50 text-amber-900 font-semibold border border-amber-200">
                    Price Negotiable via Adviser
                  </span>
                )}
              </div>
            </div>

            {/* Quick Specs Matrix */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Property Specifications & Approvals
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                <div className="p-3 rounded-xl bg-[#F5F6F3] border border-stone-200/60">
                  <span className="block text-[10px] font-bold uppercase text-stone-400">Total Land Area</span>
                  <span className="text-sm font-bold text-stone-800">
                    {property.landAreaCent ? `${property.landAreaCent} Cents` : `${property.landAreaSqft} sq.ft`}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F5F6F3] border border-stone-200/60">
                  <span className="block text-[10px] font-bold uppercase text-stone-400">Facing Direction</span>
                  <span className="text-sm font-bold text-stone-800">{property.facing || 'East'}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F5F6F3] border border-stone-200/60">
                  <span className="block text-[10px] font-bold uppercase text-stone-400">Road Frontage</span>
                  <span className="text-sm font-bold text-stone-800">{property.roadWidthFt ? `${property.roadWidthFt} Feet` : '30 Feet'}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F5F6F3] border border-stone-200/60">
                  <span className="block text-[10px] font-bold uppercase text-stone-400">Approval Type</span>
                  <span className="text-sm font-bold text-stone-800 truncate" title={property.approvalDetails}>
                    {property.approvalDetails || 'A-Katha / Patta'}
                  </span>
                </div>

                {property.bedrooms && (
                  <div className="p-3 rounded-xl bg-[#F5F6F3] border border-stone-200/60">
                    <span className="block text-[10px] font-bold uppercase text-stone-400">Bedrooms</span>
                    <span className="text-sm font-bold text-stone-800">{property.bedrooms} BHK</span>
                  </div>
                )}

                {property.bathrooms && (
                  <div className="p-3 rounded-xl bg-[#F5F6F3] border border-stone-200/60">
                    <span className="block text-[10px] font-bold uppercase text-stone-400">Bathrooms</span>
                    <span className="text-sm font-bold text-stone-800">{property.bathrooms} Baths</span>
                  </div>
                )}

                {property.reraNumber && (
                  <div className="p-3 rounded-xl bg-[#F5F6F3] border border-stone-200/60 sm:col-span-2">
                    <span className="block text-[10px] font-bold uppercase text-stone-400">RERA Registration No.</span>
                    <span className="text-xs font-bold text-emerald-800 truncate" title={property.reraNumber}>
                      {property.reraNumber}
                    </span>
                  </div>
                )}

              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Property Overview
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line font-normal">
                {property.description}
              </p>
            </div>

            {/* Amenities & Highlights */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Key Amenities & Site Features
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {property.amenities.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/60 text-xs font-semibold text-emerald-950 border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Highlights */}
            {property.nearbyHighlights && property.nearbyHighlights.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Tirunelveli Locality Proximity
                </h3>
                <div className="space-y-2">
                  {property.nearbyHighlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                      <span className="w-2 h-2 rounded-full bg-[#B8892D]"></span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Managed Advisory Workflow Box */}
            <div className="p-5 rounded-2xl bg-[#F5F6F3] border border-stone-200/80 space-y-3">
              <div className="flex items-center gap-2 text-[#123F2B] font-bold text-sm">
                <Award className="w-4 h-4 text-[#B8892D]" />
                <span>The Nellai Assets Advisory Process</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Nellai Assets verifies the Patta and town planning approvals for this property. When you enquire, our Tirunelveli advisory team reviews the records with you, arranges an accompanied physical site visit, and assists in structured negotiation with the owner.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-semibold text-emerald-900 pt-1">
                <span className="flex items-center gap-1">✓ No spam or number broadcast</span>
                <span className="flex items-center gap-1">✓ Clear Patta diligence</span>
                <span className="flex items-center gap-1">✓ Accompanied site visits</span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: 4 COLS (NELLAI ASSETS ADVISORY GATEWAY) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Nellai Assets Adviser Card (Zero Raw Seller Phone Numbers) */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Official Advisory Gateway
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Privacy Protected
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#123F2B] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                <Building className="w-6 h-6 text-[#E0B25B]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#18352A]">Nellai Assets Advisory</h4>
                <p className="text-xs text-stone-500">Tirunelveli District Desk</p>
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Title Pre-Verified
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F5F6F3] text-xs text-stone-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-400">Listing Attribution:</span>
                <strong className="text-stone-800">{property.sellerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Ownership:</span>
                <span className="font-medium text-stone-700">{property.ownershipType || 'Freehold Patta'}</span>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="space-y-2.5">
              <button
                onClick={() => openActionModal('Callback')}
                className="w-full py-3 rounded-xl bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#E0B25B]" />
                <span>Talk to a Property Adviser</span>
              </button>

              <button
                onClick={() => openActionModal('Site Visit')}
                className="w-full py-3 rounded-xl bg-[#B8892D] hover:bg-[#a67a25] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Accompanied Site Visit</span>
              </button>

              <button
                onClick={handleWhatsAppNellaiAssets}
                className="w-full py-2.5 rounded-xl border border-[#25D366] text-[#123F2B] hover:bg-[#25D366]/10 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Nellai Assets (+91 93603 90690)</span>
              </button>
            </div>

            <div className="pt-2 text-[10px] text-stone-400 text-center leading-snug">
              Nellai Assets coordinates all calls, documents & visits. Personal phone numbers remain strictly confidential.
            </div>
          </div>

          {/* Embedded On-Page Enquiry Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#18352A]">
              Get Full Property Pack & Callback
            </h3>
            <p className="text-xs text-stone-500">
              Receive DTCP order numbers, road plan details, and schedule a site inspection.
            </p>

            {enquirySuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                <h4 className="font-serif font-bold text-sm text-emerald-950">Enquiry Dispatched!</h4>
                <p className="text-xs text-emerald-800">
                  Your enquiry is registered under lead reference with Nellai Assets. Our adviser will reach out during your preferred window.
                </p>
                <button
                  onClick={() => setEnquirySuccess(false)}
                  className="text-xs font-bold text-emerald-950 underline pt-1"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. S. Arumugam"
                    className="w-full bg-[#F5F6F3] border border-stone-300 rounded-lg p-2 text-stone-800 focus:outline-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-600 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+91 94431 00000"
                    className="w-full bg-[#F5F6F3] border border-stone-300 rounded-lg p-2 text-stone-800 focus:outline-emerald-800"
                  />
                </div>

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

                <div>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                    <input
                      type="checkbox"
                      checked={siteVisitRequested}
                      onChange={(e) => setSiteVisitRequested(e.target.checked)}
                      className="w-4 h-4 rounded text-[#123F2B] border-stone-300"
                    />
                    <span>Schedule an accompanied site visit</span>
                  </label>
                </div>

                {siteVisitRequested && (
                  <div>
                    <label className="block font-bold text-stone-600 mb-1">Preferred Visit Date</label>
                    <input
                      type="date"
                      value={preferredVisitDate}
                      onChange={(e) => setPreferredVisitDate(e.target.value)}
                      className="w-full bg-[#F5F6F3] border border-stone-300 rounded-lg p-2 text-stone-800"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-stone-600 mb-1">Message</label>
                  <textarea
                    rows={2}
                    value={buyerMessage}
                    onChange={(e) => setBuyerMessage(e.target.value)}
                    className="w-full bg-[#F5F6F3] border border-stone-300 rounded-lg p-2 text-stone-800 focus:outline-emerald-800 resize-none"
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50 text-[10px] text-emerald-900 border border-emerald-100 flex items-start gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    Your contact details are shared securely with Nellai Assets for property assistance.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Registering...' : 'Enquire with Nellai Assets'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* SIMILAR PROPERTIES IN TIRUNELVELI */}
      {similarProperties.length > 0 && (
        <div className="pt-10 border-t border-stone-200">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#18352A] mb-6">
            Similar Properties in {property.area}, Tirunelveli
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.slice(0, 3).map((sim) => (
              <div
                key={sim.id}
                onClick={() => onSelectProperty(sim)}
                className="bg-white rounded-2xl border border-stone-200 p-3 shadow-2xs hover:shadow-md cursor-pointer transition-all flex gap-3"
              >
                <img
                  src={sim.coverImage || sim.images[0]}
                  alt={sim.title}
                  className="w-24 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-stone-400">{sim.id}</span>
                  <h4 className="font-bold text-xs text-stone-800 truncate">{sim.title}</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{sim.area}, Tirunelveli</p>
                  <p className="font-bold text-xs text-[#123F2B] mt-1">{formatPrice(sim.price, sim.listingPurpose)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Enquiry Modal */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        property={property}
        initialType={modalType}
      />

    </div>
  );
};
