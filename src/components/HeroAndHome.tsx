import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  PhoneCall,
  Users,
  Award,
  Layers,
  Calendar,
  Lock,
  MessageSquare
} from 'lucide-react';
import { PropertyListing, LocationItem } from '../types';
import { PropertyCard } from './PropertyCard';
import { FOUNDER_INFO } from '../data/founderData';
import { NellaiAssetsLogo } from './NellaiAssetsLogo';
import { EnquiryModal } from './EnquiryModal';

interface HeroAndHomeProps {
  properties: PropertyListing[];
  locations: LocationItem[];
  onSelectProperty: (prop: PropertyListing) => void;
  onNavigate: (view: string, param?: string) => void;
  onSearch: (filters: { type?: string; location?: string; budget?: string; purpose?: string }) => void;
}

export const HeroAndHome: React.FC<HeroAndHomeProps> = ({
  properties,
  locations,
  onSelectProperty,
  onNavigate,
  onSearch
}) => {
  const [activeTab, setActiveTab] = useState<'For Sale' | 'For Rent'>('For Sale');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedBudget, setSelectedBudget] = useState<string>('All');

  // Quick enquiry modal state
  const [selectedPropForEnquiry, setSelectedPropForEnquiry] = useState<PropertyListing | null>(null);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      purpose: activeTab,
      type: selectedType === 'All' ? undefined : selectedType,
      location: selectedLocation === 'All' ? undefined : selectedLocation,
      budget: selectedBudget === 'All' ? undefined : selectedBudget,
    });
  };

  const featuredListings = properties.filter(p => p.isFeatured && p.status === 'approved').slice(0, 3);
  const latestListings = properties.filter(p => p.status === 'approved').slice(0, 6);

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION (TIRUNELVELI ONLY FOCUS) */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#0B2519] via-[#123F2B] to-[#184833] text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E0B25B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        {/* Glow Spheres */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#B8892D]/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F4D068] text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tirunelveli District’s Property Discovery & Advisory Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight max-w-4xl mx-auto text-white">
            Find the Right Property. <br className="hidden sm:inline" />
            <span className="text-[#E0B25B] italic font-serif">Build Your Future.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-emerald-100/90 max-w-3xl mx-auto font-normal leading-relaxed">
            Your Assets Adviser for verified DTCP plots, independent villas, farmland, and commercial spaces across Palayamkottai, Pettai, Vannarpettai, Melapalayam, Reddiyarpatti, and Tirunelveli.
          </p>

          {/* Search Card Container */}
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-5 sm:p-7 text-stone-800 border border-stone-200/80">
            
            {/* Tabs for Buy / Rent */}
            <div className="flex items-center space-x-2 border-b border-stone-200 pb-3 mb-5">
              <button
                type="button"
                onClick={() => setActiveTab('For Sale')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === 'For Sale'
                    ? 'bg-[#123F2B] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Buy in Tirunelveli
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('For Rent')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === 'For Rent'
                    ? 'bg-[#123F2B] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Rent & Commercial Lease
              </button>
            </div>

            {/* Structured Search Form (Tirunelveli Hierarchy Only) */}
            <form onSubmit={handleHeroSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              
              {/* Type Select */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Property Category
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-800 focus:outline-emerald-800 focus:bg-white"
                >
                  <option value="All">All Property Types</option>
                  <option value="Residential Plot">DTCP Residential Plot</option>
                  <option value="Independent House">Independent House / Villa</option>
                  <option value="Apartment">Apartment Flat</option>
                  <option value="Agricultural Land">Agricultural Farmland</option>
                  <option value="Commercial Property">Commercial Property</option>
                </select>
              </div>

              {/* Location Select (Strictly Tirunelveli Localities) */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Tirunelveli Locality
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-800 focus:outline-emerald-800 focus:bg-white"
                >
                  <option value="All">All Tirunelveli Localities</option>
                  <option value="Palayamkottai">Palayamkottai</option>
                  <option value="Pettai">Pettai</option>
                  <option value="Vannarpettai">Vannarpettai & South Bypass</option>
                  <option value="Maharajanagar">Maharajanagar</option>
                  <option value="Thachanallur">Thachanallur</option>
                  <option value="Melapalayam">Melapalayam</option>
                  <option value="Reddiyarpatti">Reddiyarpatti Foothills</option>
                  <option value="Suthamalli">Suthamalli River Corridor</option>
                  <option value="Tirunelveli Junction">Tirunelveli Junction</option>
                </select>
              </div>

              {/* Budget Select */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Budget Range
                </label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-800 focus:outline-emerald-800 focus:bg-white"
                >
                  <option value="All">Any Budget</option>
                  <option value="under-25l">Under ₹25 Lakhs</option>
                  <option value="25l-50l">₹25 Lakhs - ₹50 Lakhs</option>
                  <option value="50l-1cr">₹50 Lakhs - ₹1 Crore</option>
                  <option value="above-1cr">Above ₹1 Crore</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-[42px] bg-[#B8892D] hover:bg-[#a67924] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </button>
              </div>

            </form>

            {/* Quick Popular Searches in Tirunelveli */}
            <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center gap-2 flex-wrap text-xs text-stone-500">
              <span className="font-bold text-stone-700">Trending in Tirunelveli:</span>
              <button 
                type="button" 
                onClick={() => onSearch({ type: 'Residential Plot', location: 'Pettai' })}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
              >
                Nellai Emirates Town (Pettai)
              </button>
              <button 
                type="button" 
                onClick={() => onSearch({ type: 'Residential Plot', location: 'Palayamkottai' })}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
              >
                DTCP Plots in Palayamkottai
              </button>
              <button 
                type="button" 
                onClick={() => onSearch({ type: 'Independent House', location: 'Maharajanagar' })}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
              >
                Villas in Maharajanagar
              </button>
              <button 
                type="button" 
                onClick={() => onSearch({ type: 'Agricultural Land', location: 'Suthamalli' })}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
              >
                Suthamalli River Farmland
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* THE NELLAI ASSETS ADVISORY JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-stone-200/90 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8892D]">
              Our Managed Marketplace Model
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#18352A] mt-1">
              Discover ➔ Enquire ➔ Get Assisted ➔ Visit ➔ Decide
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Nellai Assets is actively involved at every stage to verify titles and protect both parties.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            
            <div className="p-4 rounded-2xl bg-[#F5F6F3] border border-stone-200/80 space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#123F2B] text-[#F4D068] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-xs text-[#18352A]">Discover Properties</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Explore verified DTCP plots, independent villas, and farmlands in Tirunelveli.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F6F3] border border-stone-200/80 space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#123F2B] text-[#F4D068] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-xs text-[#18352A]">Enquire Privately</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Connect via Nellai Assets. Personal phone numbers remain completely confidential.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F6F3] border border-stone-200/80 space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#123F2B] text-[#F4D068] font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-xs text-[#18352A]">Advisory & Qualification</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Our local advisory desk verifies Patta, EC, and approval documents with you.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F6F3] border border-stone-200/80 space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#123F2B] text-[#F4D068] font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h4 className="font-bold text-xs text-[#18352A]">Accompanied Site Visit</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                A Nellai Assets adviser accompanies you to inspect ground boundaries and road access.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#123F2B] text-white font-bold text-xs flex items-center justify-center">
                5
              </span>
              <h4 className="font-bold text-xs text-emerald-950">Secure Decision</h4>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Transparent owner coordination, fair market valuation, and safe sub-registrar transfer.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* COMPACT FOUNDER & ADVISER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Founder Photo */}
            <div className="lg:col-span-4 relative rounded-2xl overflow-hidden shadow-lg aspect-4/5 max-w-sm mx-auto lg:max-w-none bg-stone-100">
              <img
                src="/assets/founder/sundar-rajan-k.jpeg"
                alt="Sundar Rajan K - Founder, Nellai Assets"
                className="w-full h-full object-cover object-top block founder-image"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                referrerPolicy="no-referrer"
              />
              <div 
                className="absolute inset-0 pointer-events-none" 
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 60%)' }} 
              />
              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4D068] bg-[#123F2B]/90 px-2.5 py-0.5 rounded">
                  {FOUNDER_INFO.title}
                </span>
                <h3 className="font-serif font-black text-xl mt-1">{FOUNDER_INFO.name}</h3>
                <p className="text-xs text-stone-300">{FOUNDER_INFO.role}</p>
              </div>
            </div>

            {/* Founder Message & Credentials */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#B8892D]">
                  Leadership & Mission
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#18352A] mt-1">
                  "Real-Estate in Tirunelveli Demands Absolute Title Scrutiny and Ethical Guidance."
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                At Nellai Assets, we built this platform exclusively for Tirunelveli District. We do not operate as an impersonal classifieds board where phone numbers are leaked and buyers are left unassisted. Every plot in Pettai, villa in Maharajanagar, and farmland in Suthamalli is backed by preliminary revenue diligence and managed support.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-[#F5F6F3] border border-stone-200/80">
                  <span className="block text-[10px] font-bold uppercase text-stone-400">Sole Focus</span>
                  <span className="text-xs font-bold text-[#123F2B]">Tirunelveli District</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F6F3] border border-stone-200/80">
                  <span className="block text-[10px] font-bold uppercase text-stone-400">Privacy Standard</span>
                  <span className="text-xs font-bold text-[#123F2B]">Zero Number Broadcast</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F6F3] border border-stone-200/80">
                  <span className="block text-[10px] font-bold uppercase text-stone-400">Advisory Desk</span>
                  <span className="text-xs font-bold text-[#123F2B]">Accompanied Visits</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('founder')}
                  className="px-5 py-2.5 rounded-xl bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Read Founder Profile & Mission</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('founder')}
                  className="px-5 py-2.5 rounded-xl border border-[#B8892D] text-[#B8892D] hover:bg-amber-50 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Advisory with Sundar Rajan K</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES IN TIRUNELVELI */}
      {featuredListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8892D]">Pre-Screened Titles</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#18352A]">Featured Tirunelveli Listings</h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">Verified DTCP layouts, duplex homes and prime highway plots</p>
            </div>
            <button
              onClick={() => onNavigate('browse')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#123F2B] hover:text-[#B8892D] transition-colors"
            >
              <span>Explore All Tirunelveli Listings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map(prop => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={onSelectProperty}
                onQuickEnquire={(p) => setSelectedPropForEnquiry(p)}
              />
            ))}
          </div>
        </section>
      )}

      {/* POPULAR TIRUNELVELI LOCALITIES */}
      <section className="bg-[#F5F6F3] py-16 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8892D]">Tirunelveli District Localities</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#18352A] mt-1">Explore by Primary Localities</h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Browse approved layouts and residential pockets across Tirunelveli.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {locations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => onSearch({ location: loc.name })}
                className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-900 cursor-pointer shadow-2xs hover:shadow-xl transition-all"
              >
                <img
                  src={loc.imageUrl}
                  alt={loc.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm leading-tight text-white group-hover:text-[#F4D068] transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-[10px] text-stone-300 font-medium truncate">
                    {loc.popularFor || 'Verified Plots & Homes'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENTLY LISTED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8892D]">Tirunelveli Marketplace</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#18352A]">Recently Verified Properties</h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">Direct from owners, promoters, and builders</p>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#123F2B] hover:text-[#B8892D] transition-colors"
          >
            <span>View All ({properties.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestListings.map(prop => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onSelect={onSelectProperty}
              onQuickEnquire={(p) => setSelectedPropForEnquiry(p)}
            />
          ))}
        </div>
      </section>

      {/* WHY OWNERS, AGENTS & BUILDERS CHOOSE NELLAI ASSETS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8892D]">Confidential & Qualified</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#18352A] mt-1">Why Sellers Partner with Nellai Assets</h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Receive serious qualified enquiries without exposing your personal phone number to telemarketers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Individual Owners */}
          <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-2xs hover:border-[#123F2B] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#123F2B] flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#18352A]">For Individual Owners</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Sell ancestral plots, independent villas, or farmland without unsolicited phone harassment. Nellai Assets filters buyers and coordinates accompanied site visits.
              </p>
              <ul className="space-y-2 text-xs text-stone-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Zero phone number exposure
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Qualified buyer screening
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Assisted sub-registrar transfer
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('post-property')}
              className="mt-6 w-full py-2.5 rounded-xl border border-[#123F2B] text-[#123F2B] hover:bg-[#123F2B] hover:text-white font-bold text-xs transition-colors"
            >
              List Property with Privacy
            </button>
          </div>

          {/* Agents */}
          <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-2xs hover:border-[#B8892D] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#B8892D] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#18352A]">For Registered Agents</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Elevate your professional reputation in Tirunelveli. Showcase your verified inventory with official advisory co-branding and centralized lead handling.
              </p>
              <ul className="space-y-2 text-xs text-stone-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B8892D] shrink-0" /> Dedicated agent inventory panel
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B8892D] shrink-0" /> High-intent local buyer leads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B8892D] shrink-0" /> Clear DTCP verification badges
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('post-property')}
              className="mt-6 w-full py-2.5 rounded-xl border border-[#B8892D] text-[#B8892D] hover:bg-[#B8892D] hover:text-white font-bold text-xs transition-colors"
            >
              Register as Partner Agent
            </button>
          </div>

          {/* Builders & Developers */}
          <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-2xs hover:border-[#123F2B] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#123F2B] flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#18352A]">For Builders & Promoters</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Launch township layouts and gated communities with institution-grade positioning. Reach NRI Tirunelveli diaspora and local families.
              </p>
              <ul className="space-y-2 text-xs text-stone-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Project microsite & unit inventory
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Bulk site visit scheduling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> RERA compliance certification
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="mt-6 w-full py-2.5 rounded-xl border border-[#123F2B] text-[#123F2B] hover:bg-[#123F2B] hover:text-white font-bold text-xs transition-colors"
            >
              Showcase Gated Township
            </button>
          </div>

        </div>
      </section>

      {/* QUICK ENQUIRY MODAL */}
      {selectedPropForEnquiry && (
        <EnquiryModal
          isOpen={!!selectedPropForEnquiry}
          onClose={() => setSelectedPropForEnquiry(null)}
          property={selectedPropForEnquiry}
          initialType="Enquiry"
        />
      )}

    </div>
  );
};
