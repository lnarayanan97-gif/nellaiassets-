import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroAndHome } from './components/HeroAndHome';
import { PropertySearch } from './components/PropertySearch';
import { PropertyDetails } from './components/PropertyDetails';
import { PostProperty } from './components/PostProperty';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { FounderProfile } from './components/FounderProfile';
import { PropertyListing, LocationItem } from './types';
import { 
  seedInitialDataIfNeeded, 
  fetchPublicProperties, 
  toggleUserFavorite 
} from './services/propertyService';
import { INITIAL_LOCATIONS, INITIAL_PROPERTIES } from './data/mockData';
import { 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Compass,
  Lock
} from 'lucide-react';
import { NellaiAssetsLogo } from './components/NellaiAssetsLogo';

function MainApp() {
  const { userProfile, refreshProfile } = useAuth();
  
  // Navigation View State
  const [activeView, setActiveView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.includes('founder') || window.location.pathname === '/founder/sundar-rajan-k') {
        return 'founder';
      }
    }
    return 'home';
  });

  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [searchFilters, setSearchFilters] = useState<{
    type?: string;
    location?: string;
    budget?: string;
    purpose?: string;
  }>({});

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Listings data
  const [properties, setProperties] = useState<PropertyListing[]>(INITIAL_PROPERTIES);
  const [locations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  const [loading, setLoading] = useState(true);

  // Sync browser URL with popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/founder/sundar-rajan-k' || path.includes('founder')) {
        setActiveView('founder');
      } else {
        setActiveView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize and fetch real listings from Firestore
  useEffect(() => {
    async function init() {
      try {
        await seedInitialDataIfNeeded();
        const liveProps = await fetchPublicProperties();
        if (liveProps && liveProps.length > 0) {
          setProperties(liveProps);
        }
      } catch (e) {
        console.warn('App initialization error:', e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'founder' || view === 'founder-profile' || view === 'founder/sundar-rajan-k') {
      if (window.location.pathname !== '/founder/sundar-rajan-k') {
        window.history.pushState(null, '', '/founder/sundar-rajan-k');
      }
      setActiveView('founder');
      return;
    }

    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }

    if (view === 'browse') {
      if (param === 'buy') setSearchFilters({ purpose: 'For Sale' });
      else if (param === 'rent') setSearchFilters({ purpose: 'For Rent' });
      else if (param === 'plot') setSearchFilters({ type: 'Residential Plot' });
      else if (param === 'house') setSearchFilters({ type: 'Independent House' });
      else if (param === 'agriculture') setSearchFilters({ type: 'Agricultural Land' });
      else if (param === 'commercial') setSearchFilters({ type: 'Commercial Property' });
      else if (param) setSearchFilters({ location: param });
      else setSearchFilters({});
    }
    setActiveView(view);
  };

  const handleSelectProperty = (prop: PropertyListing) => {
    setSelectedProperty(prop);
    setActiveView('property-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (filters: { type?: string; location?: string; budget?: string; purpose?: string }) => {
    setSearchFilters(filters);
    setActiveView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostSuccess = (newPropId: string) => {
    fetchPublicProperties().then(updated => {
      if (updated) setProperties(updated);
    });
    setActiveView('dashboard');
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleToggleFavorite = async (propId: string) => {
    if (!userProfile) {
      handleOpenAuth('login');
      return;
    }
    await toggleUserFavorite(userProfile.uid, propId);
    await refreshProfile();
  };

  // Find similar properties for details view
  const similarProperties = selectedProperty
    ? properties.filter(p => p.id !== selectedProperty.id && (p.area === selectedProperty.area || p.propertyType === selectedProperty.propertyType))
    : [];

  // Saved properties list
  const savedPropertiesList = properties.filter(p => userProfile?.savedProperties?.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F6] text-[#18352A]">
      
      {/* Universal Header with Official Logo */}
      <Header
        onNavigate={handleNavigate}
        activeView={activeView}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        
        {/* VIEW: HOME */}
        {activeView === 'home' && (
          <HeroAndHome
            properties={properties}
            locations={locations}
            onSelectProperty={handleSelectProperty}
            onNavigate={handleNavigate}
            onSearch={handleHeroSearch}
          />
        )}

        {/* VIEW: FOUNDER PROFILE (Sundar Rajan K, Founder - Nellai Assets) */}
        {(activeView === 'founder' || activeView === 'founder-profile' || activeView === 'founder/sundar-rajan-k') && (
          <FounderProfile
            onBack={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: SEARCH / BROWSE */}
        {activeView === 'browse' && (
          <PropertySearch
            properties={properties}
            onSelectProperty={handleSelectProperty}
            initialFilters={searchFilters}
          />
        )}

        {/* VIEW: PROPERTY DETAILS */}
        {activeView === 'property-details' && selectedProperty && (
          <PropertyDetails
            property={selectedProperty}
            onBack={() => setActiveView('browse')}
            onSelectProperty={handleSelectProperty}
            similarProperties={similarProperties}
          />
        )}

        {/* VIEW: POST PROPERTY */}
        {activeView === 'post-property' && (
          <PostProperty
            onSuccess={handlePostSuccess}
            onCancel={() => setActiveView('home')}
          />
        )}

        {/* VIEW: USER DASHBOARD */}
        {activeView === 'dashboard' && (
          <Dashboard
            onNavigate={handleNavigate}
            onSelectProperty={handleSelectProperty}
          />
        )}

        {/* VIEW: ADMIN CONTROL & CRM */}
        {activeView === 'admin' && (
          <AdminDashboard
            onSelectProperty={handleSelectProperty}
            onExitAdmin={() => setActiveView('home')}
          />
        )}

        {/* VIEW: SAVED PROPERTIES */}
        {activeView === 'saved' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-[#B8892D] uppercase tracking-wider">Shortlisted Collections</span>
                <h1 className="text-2xl font-serif font-black text-[#18352A]">Saved Tirunelveli Properties</h1>
                <p className="text-xs text-stone-500 mt-1">Properties shortlisted for comparative analysis and Nellai Assets site visits.</p>
              </div>
              <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg">
                {savedPropertiesList.length} Saved
              </span>
            </div>

            {savedPropertiesList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPropertiesList.map(prop => (
                  <div key={prop.id} onClick={() => handleSelectProperty(prop)} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs cursor-pointer hover:shadow-md transition-all">
                    <img src={prop.coverImage || prop.images[0]} alt={prop.title} className="w-full h-44 object-cover" />
                    <div className="p-4 space-y-2">
                      <p className="text-xs font-semibold text-stone-500">{prop.area}, Tirunelveli</p>
                      <h3 className="font-bold text-sm text-[#18352A] line-clamp-1">{prop.title}</h3>
                      <p className="font-black text-sm text-[#123F2B]">₹{prop.price.toLocaleString('en-IN')}</p>
                      <div className="pt-2 flex items-center justify-between text-xs text-emerald-800 font-semibold border-t border-stone-100">
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-bold text-stone-800">No saved properties yet</h3>
                <p className="text-xs text-stone-500 mt-1">Click the heart icon on any property card to save it for quick reference.</p>
                <button
                  onClick={() => handleNavigate('browse')}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#123F2B] text-white font-bold text-xs cursor-pointer"
                >
                  Browse Tirunelveli Marketplace
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW: PROJECTS (Tirunelveli Gated Communities) */}
        {activeView === 'projects' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="bg-linear-to-r from-[#123F2B] to-[#1E523A] text-white p-8 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden">
              <span className="text-[#E0B25B] text-xs font-bold uppercase tracking-wider">DTCP & RERA Approved Layouts</span>
              <h1 className="text-3xl font-serif font-black mt-1">Tirunelveli Master-Planned Enclaves</h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
                Discover verified gated layouts, township plots, and residential developments across Palayamkottai, Vannarpettai, Pettai, and Reddiyarpatti vetted by Nellai Assets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between">
                <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80" alt="Tamirabarani Green Enclave" className="w-full h-56 object-cover" />
                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Ready to Construct</span>
                      <h3 className="text-xl font-bold font-serif text-[#18352A] mt-1">Tamirabarani Green Enclave</h3>
                      <p className="text-xs text-stone-500">Palayamkottai Outer Ring Road, Tirunelveli</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">RERA / DTCP Approved</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    A 22-acre gated community featuring 140 premium residential plots with 40-foot blacktop tar roads, underground electricity cabling, landscaped community parks, and 24/7 security.
                  </p>
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Plots from</span>
                      <p className="text-base font-bold text-[#123F2B]">₹18 Lakhs onwards</p>
                    </div>
                    <button onClick={() => handleNavigate('browse', 'Palayamkottai')} className="px-4 py-2 bg-[#123F2B] text-white text-xs font-bold rounded-xl cursor-pointer">
                      View Layout Plots
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80" alt="Nellai Heights Luxury Flats" className="w-full h-56 object-cover" />
                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">Under Construction</span>
                      <h3 className="text-xl font-bold font-serif text-[#18352A] mt-1">Nellai Heights Luxury Flats</h3>
                      <p className="text-xs text-stone-500">South Bypass Road, Vannarpettai, Tirunelveli</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">Approved High-Rise</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Exclusive 2 & 3 BHK luxury residences with rooftop amenities, indoor badminton court, automatic lift backup, and direct arterial connectivity to Tirunelveli Junction.
                  </p>
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Pricing from</span>
                      <p className="text-base font-bold text-[#123F2B]">₹54 Lakhs onwards</p>
                    </div>
                    <button onClick={() => handleNavigate('browse', 'Vannarpettai')} className="px-4 py-2 bg-[#123F2B] text-white text-xs font-bold rounded-xl cursor-pointer">
                      View Available Units
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: TIRUNELVELI LOCALITIES */}
        {activeView === 'locations' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8892D]">Tirunelveli District Focus</span>
              <h1 className="text-3xl font-serif font-black text-[#18352A]">Explore Tirunelveli Localities</h1>
              <p className="text-xs sm:text-sm text-stone-500">Discover prime residential pockets, educational belts, and industrial corridors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map(loc => (
                <div key={loc.id} onClick={() => handleHeroSearch({ location: loc.name })} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-lg cursor-pointer transition-all">
                  <div className="relative h-44">
                    <img src={loc.imageUrl} alt={loc.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 text-white">
                      <h3 className="font-bold text-lg">{loc.name}</h3>
                      <p className="text-xs text-stone-300">Tirunelveli, Tamil Nadu - {loc.pincode}</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between text-xs">
                    <span className="text-stone-600 font-medium">{loc.tagline}</span>
                    <span className="font-bold text-[#123F2B]">{loc.propertyCount || 10}+ Verified Listings</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: ADVISORY MISSION & ABOUT */}
        {activeView === 'about' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <NellaiAssetsLogo size="lg" showTagline={true} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#18352A] pt-4">About Nellai Assets</h1>
              <p className="text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
                Nellai Assets was founded with a singular commitment: to make real-estate buying, selling, and investing in Tirunelveli entirely transparent, legally sound, and accessible to everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-stone-200 text-center space-y-2 shadow-2xs">
                <ShieldCheck className="w-8 h-8 text-[#123F2B] mx-auto" />
                <h3 className="font-bold text-sm text-stone-800">Patta & Legal Verification</h3>
                <p className="text-xs text-stone-500">Every listing undergoes revenue record check, parent document review, and guideline value vetting.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 text-center space-y-2 shadow-2xs">
                <Award className="w-8 h-8 text-[#B8892D] mx-auto" />
                <h3 className="font-bold text-sm text-stone-800">Your Assets Adviser</h3>
                <p className="text-xs text-stone-500">Founded by Sundar Rajan K to provide dedicated advisory services for local and NRI buyers.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 text-center space-y-2 shadow-2xs">
                <Lock className="w-8 h-8 text-[#123F2B] mx-auto" />
                <h3 className="font-bold text-sm text-stone-800">Total Contact Privacy</h3>
                <p className="text-xs text-stone-500">No unwanted cold calls. Inquiries are screened and coordinated professionally by Nellai Assets.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-200 space-y-4">
              <h2 className="text-xl font-serif font-bold text-[#18352A]">Why Tirunelveli District?</h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Tirunelveli is undergoing a historic transformation. With four-lane bypass expansions, educational prominence in Palayamkottai (the Oxford of South India), industrial estates in Gangaikondan and Pettai, and expanding water abundance along the perennial Tamirabarani river basin, real estate here represents both heritage wealth and modern capital appreciation.
              </p>
              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => handleNavigate('founder')}
                  className="px-6 py-3 rounded-2xl bg-[#123F2B] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#1a553a] transition-all cursor-pointer shadow-md"
                >
                  <Award className="w-4 h-4 text-[#E0B25B]" />
                  <span>Meet Founder: Sundar Rajan K (Your Assets Adviser)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: OFFICIAL CONTACT */}
        {activeView === 'contact' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <NellaiAssetsLogo size="lg" showTagline={true} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#18352A] pt-4">Contact Nellai Assets</h1>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#B8892D]">Your Assets Adviser • Tirunelveli District</p>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
                Connect with our advisory desk for property enquiries, seller listings, and accompanied site visits in Tirunelveli.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-5">
                <h3 className="font-serif font-bold text-lg text-[#18352A]">Official Contact Numbers</h3>
                
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#F8F9F6] border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-stone-400">Public Enquiry Helpline</span>
                      <a href="tel:+919360390690" className="text-base font-black text-[#123F2B] hover:underline">
                        +91 93603 90690
                      </a>
                    </div>
                    <a href="tel:+919360390690" className="p-2.5 rounded-xl bg-[#123F2B] text-white">
                      <Phone className="w-4 h-4 text-[#E0B25B]" />
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-emerald-800">Official WhatsApp Advisory</span>
                      <a href="https://wa.me/919360390690" target="_blank" rel="noopener noreferrer" className="text-base font-black text-emerald-950 hover:underline">
                        +91 93603 90690
                      </a>
                    </div>
                    <a href="https://wa.me/919360390690" target="_blank" rel="noopener noreferrer" className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs">
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F9F6] border border-stone-200">
                    <span className="block text-[10px] font-bold uppercase text-stone-400">Primary Office Region</span>
                    <p className="font-bold text-stone-800 text-sm mt-0.5">Tirunelveli District, Tamil Nadu, India</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleNavigate('founder')}
                    className="w-full py-3 rounded-xl bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <span>View Founder Profile (Sundar Rajan K)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E0B25B]" />
                  </button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#18352A]">Privacy & Anti-Spam Policy</h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Unlike traditional classifieds portals, Nellai Assets implements strict contact privacy:
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-stone-600">
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span><strong>No Public Phone Exposure:</strong> Neither seller nor buyer phone numbers are exposed on public listings.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span><strong>Screened Leads:</strong> Nellai Assets verifies buyer capacity and arranges accompanied site inspections.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span><strong>Safe WhatsApp Enquiries:</strong> WhatsApp messages are pre-formatted and sent to our central advisory desk (+91 93603 90690).</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <strong>Need property assistance?</strong> Message us on WhatsApp or call our Tirunelveli desk during business hours (9:00 AM - 7:00 PM).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: PRIVACY POLICY */}
        {activeView === 'privacy' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
            <h1 className="text-3xl font-serif font-bold text-[#18352A]">Privacy Policy</h1>
            <div className="bg-white p-8 rounded-3xl border border-stone-200 text-xs text-stone-700 space-y-4 leading-relaxed">
              <p>
                At Nellai Assets (Your Assets Adviser), we treat client privacy as our foundational principle. This policy governs how we protect buyers and property owners across Tirunelveli District.
              </p>
              <h3 className="font-bold text-sm text-[#18352A]">1. Strict Contact Privacy</h3>
              <p>
                We never publicly display property seller phone numbers or buyer contact numbers on property cards, listing pages, or public directories. All communications are coordinated securely through the Nellai Assets advisory desk (+91 93603 90690).
              </p>
              <h3 className="font-bold text-sm text-[#18352A]">2. Information Collected</h3>
              <p>
                When you submit an enquiry, request a callback, or schedule a site inspection, your name and phone number are stored strictly to coordinate the specific transaction.
              </p>
              <h3 className="font-bold text-sm text-[#18352A]">3. No Sale of User Data</h3>
              <p>
                We do not sell, rent, or trade your personal information to third-party telemarketers or external classified aggregators.
              </p>
            </div>
          </div>
        )}

        {/* VIEW: TERMS & CONDITIONS */}
        {activeView === 'terms' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
            <h1 className="text-3xl font-serif font-bold text-[#18352A]">Terms & Conditions</h1>
            <div className="bg-white p-8 rounded-3xl border border-stone-200 text-xs text-stone-700 space-y-4 leading-relaxed">
              <p>
                Welcome to Nellai Assets. By accessing our platform or engaging our property advisory services in Tirunelveli District, you agree to these terms.
              </p>
              <h3 className="font-bold text-sm text-[#18352A]">1. Advisory Role</h3>
              <p>
                Nellai Assets acts as a discovery, verification, and enquiry advisory bridge between buyers and property sellers. While we perform preliminary due diligence on DTCP approvals and revenue Patta documents, buyers are encouraged to perform independent sub-registrar legal search before final deed registration.
              </p>
              <h3 className="font-bold text-sm text-[#18352A]">2. Listing Accuracy</h3>
              <p>
                Sellers must furnish genuine ownership details and realistic measurements. Unverified or disputed properties will be rejected or suspended during our moderation process.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Universal Footer with Official Branding */}
      <Footer onNavigate={handleNavigate} />

      {/* Auth Modal with Official Branding */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
