import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  ArrowLeft, 
  CheckCircle2, 
  Award, 
  Compass, 
  Calendar,
  Send,
  Sparkles,
  ArrowRight,
  Lock
} from 'lucide-react';
import { FOUNDER_INFO } from '../data/founderData';
import { NellaiAssetsLogo } from './NellaiAssetsLogo';
import { submitPropertyEnquiry } from '../services/propertyService';

interface FounderProfileProps {
  onBack: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export const FounderProfile: React.FC<FounderProfileProps> = ({ onBack, onNavigate }) => {
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultArea, setConsultArea] = useState('Palayamkottai');
  const [consultType, setConsultType] = useState('DTCP Plot Purchase');
  const [consultMessage, setConsultMessage] = useState('I would like to schedule an advisory consultation regarding properties in Tirunelveli.');
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const officialPhone = '+91 93603 90690';
  const officialWhatsappUrl = 'https://wa.me/919360390690';

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName || !consultPhone) return;
    setSubmitting(true);
    try {
      await submitPropertyEnquiry({
        propertyId: 'FOUNDER-ADVISORY',
        propertyTitle: `Advisory Consultation Request: ${consultType} in ${consultArea}`,
        propertyPrice: 0,
        propertyLocation: `${consultArea}, Tirunelveli`,
        sellerId: 'founder-sundar-rajan',
        buyerName: consultName,
        buyerPhone: consultPhone,
        message: consultMessage,
        leadType: 'Enquiry'
      });
      setConsultSubmitted(true);
    } catch (err) {
      console.warn('Consult error:', err);
      setConsultSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/919360390690?text=${encodeURIComponent(
    `Hello Nellai Assets,\n\nI would like to speak with Sundar Rajan K (Your Assets Adviser) regarding property guidance in Tirunelveli.\n\nName: ${consultName || 'Interested Buyer/Seller'}\nLocation: ${consultArea}\nTopic: ${consultType}\n\nPlease contact me.`
  )}`;

  return (
    <div className="min-h-screen bg-[#FAFBF8] pb-16">
      
      {/* Top Breadcrumb & Return Nav */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#123F2B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="cursor-pointer hover:underline" onClick={() => onNavigate('home')}>Home</span>
            <span>/</span>
            <span className="font-semibold text-[#18352A]">Founder — Sundar Rajan K</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* Main Founder Hero Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Founder Portrait Column */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#F3F5F1] to-[#FAFBF8] p-6 sm:p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-stone-200/80">
              
              {/* Responsive Portrait Container preserving exact photograph without distortion */}
              <div className="relative w-64 sm:w-72 md:w-80 aspect-3/4 rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-stone-200/60 bg-stone-100">
                <img
                  src="/assets/founder/sundar-rajan-k.jpeg"
                  alt="Sundar Rajan K - Founder, Nellai Assets"
                  className="w-full h-full object-cover object-top block founder-image"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  referrerPolicy="no-referrer"
                />
                
                {/* Transparent Gradient Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 50%)' }}
                />

                {/* Dignified Badge Overlay */}
                <div className="absolute bottom-3 inset-x-3 bg-[#123F2B]/90 backdrop-blur-md text-white p-3 rounded-xl border border-emerald-500/20 text-center shadow-md z-10">
                  <p className="font-serif font-bold text-sm tracking-wide text-white">Sundar Rajan K</p>
                  <p className="text-[11px] text-[#E0B25B] font-semibold uppercase tracking-wider">Your Assets Adviser</p>
                </div>
              </div>

              {/* Direct Communication Quick Buttons */}
              <div className="mt-6 w-full max-w-xs space-y-2.5">
                <a
                  href={`tel:${officialPhone.replace(/\s+/g, '')}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E0B25B]" />
                  <span>Call {officialPhone}</span>
                </a>

                <a
                  href={officialWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Nellai Assets</span>
                </a>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-stone-500">
                <Lock className="w-3.5 h-3.5 text-[#123F2B]" />
                <span>Official Nellai Assets Advisory Desk</span>
              </div>

            </div>

            {/* Founder Biography & Introduction Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                
                <div className="flex items-center gap-3">
                  <NellaiAssetsLogo size="sm" showTagline={false} />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B8892D] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Founder Profile
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#18352A]">
                    Sundar Rajan K
                  </h1>
                  <p className="text-sm sm:text-base font-bold text-[#123F2B] mt-1">
                    Founder — Nellai Assets
                  </p>
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#B8892D] mt-0.5">
                    Your Assets Adviser
                  </p>
                </div>

                {/* Primary Introduction Quote */}
                <div className="p-4 rounded-2xl bg-[#F3F5F1] border-l-4 border-[#123F2B] text-stone-800 text-sm leading-relaxed font-medium">
                  "{FOUNDER_INFO.intro}"
                </div>

                {/* Professional Background Paragraphs */}
                <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {FOUNDER_INFO.bio.slice(1).map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Primary Dual CTAs */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <a
                    href="#advisory-form"
                    className="px-6 py-3 rounded-xl bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Talk to Nellai Assets</span>
                    <ArrowRight className="w-4 h-4 text-[#E0B25B]" />
                  </a>

                  <button
                    onClick={() => onNavigate('browse')}
                    className="px-6 py-3 rounded-xl border border-[#123F2B] text-[#123F2B] hover:bg-emerald-50 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore Properties</span>
                  </button>
                </div>

              </div>

              {/* Three Core Principles */}
              <div className="pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {FOUNDER_INFO.advisoryPillars.map((pillar, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#FAFBF8] border border-stone-200 space-y-1">
                    <p className="font-bold text-xs text-[#18352A]">{pillar.title}</p>
                    <p className="text-[11px] text-stone-500 leading-snug">{pillar.desc}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* Tirunelveli Localities Advisory Focus */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8892D]">Local Insight</span>
            <h2 className="text-2xl font-serif font-black text-[#18352A]">
              {FOUNDER_INFO.tirunelveliFocus.heading}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-3xl leading-relaxed">
              {FOUNDER_INFO.tirunelveliFocus.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FOUNDER_INFO.tirunelveliFocus.keyAreas.map((area, idx) => (
              <div 
                key={idx} 
                onClick={() => onNavigate('browse', area.name.split(' ')[0])}
                className="p-4 rounded-2xl bg-[#F3F5F1] hover:bg-white border border-stone-200 transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#18352A] group-hover:text-[#123F2B]">{area.name}</h3>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#123F2B] transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{area.advantage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory Consultation Form (Talk to Nellai Assets) */}
        <div id="advisory-form" className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8892D]">Advisory Request</span>
              <h2 className="text-2xl font-serif font-black text-[#18352A] mt-0.5">
                Talk to Nellai Assets
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Schedule a property consultation with Sundar Rajan K and our Tirunelveli advisory team.
              </p>
            </div>

            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 self-start sm:self-auto transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Directly</span>
            </a>
          </div>

          {consultSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-lg text-emerald-900">Advisory Request Received</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Thank you, <strong>{consultName}</strong>. Our advisory desk under Sundar Rajan K will contact you at <strong>{consultPhone}</strong> to coordinate your Tirunelveli property requirement.
              </p>
              <button
                onClick={() => setConsultSubmitted(false)}
                className="mt-3 px-5 py-2 rounded-xl bg-[#123F2B] text-white text-xs font-bold cursor-pointer"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleConsultSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-[#FAFBF8] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-[#123F2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={consultPhone}
                    onChange={(e) => setConsultPhone(e.target.value)}
                    placeholder="+91 93603 00000"
                    className="w-full bg-[#FAFBF8] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-[#123F2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Preferred Locality</label>
                  <select
                    value={consultArea}
                    onChange={(e) => setConsultArea(e.target.value)}
                    className="w-full bg-[#FAFBF8] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-[#123F2B]"
                  >
                    <option value="Palayamkottai">Palayamkottai</option>
                    <option value="Vannarpettai">Vannarpettai / South Bypass</option>
                    <option value="Pettai">Pettai</option>
                    <option value="Maharajanagar">Maharajanagar</option>
                    <option value="Thachanallur">Thachanallur</option>
                    <option value="Reddiyarpatti">Reddiyarpatti</option>
                    <option value="Melapalayam">Melapalayam</option>
                    <option value="Suthamalli">Suthamalli</option>
                    <option value="Other Tirunelveli">Other Tirunelveli Localities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Advisory Requirement</label>
                  <select
                    value={consultType}
                    onChange={(e) => setConsultType(e.target.value)}
                    className="w-full bg-[#FAFBF8] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-[#123F2B]"
                  >
                    <option value="DTCP Plot Purchase">DTCP Plot Purchase</option>
                    <option value="Independent House / Villa">Independent House / Villa</option>
                    <option value="Farmland / Agro Land">Farmland / Agro Investment</option>
                    <option value="Sell My Property Safely">Sell My Property Safely</option>
                    <option value="Commercial Space">Commercial Space / Highway Plot</option>
                    <option value="Patta & Document Guidance">Patta & Document Verification Guidance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Message or Specific Requirements</label>
                <textarea
                  rows={3}
                  value={consultMessage}
                  onChange={(e) => setConsultMessage(e.target.value)}
                  className="w-full bg-[#FAFBF8] border border-stone-300 rounded-xl p-3.5 text-xs text-stone-900 outline-none focus:ring-1 focus:ring-[#123F2B]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#123F2B]" />
                  Your phone number is strictly protected and never shared publicly.
                </span>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-[#E0B25B]" />
                  <span>{submitting ? 'Submitting...' : 'Submit Advisory Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
