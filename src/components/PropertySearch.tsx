import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Check, 
  Sparkles,
  MapPin,
  Building
} from 'lucide-react';
import { PropertyListing, PropertyType } from '../types';
import { PropertyCard } from './PropertyCard';
import { EnquiryModal } from './EnquiryModal';

interface PropertySearchProps {
  properties: PropertyListing[];
  onSelectProperty: (prop: PropertyListing) => void;
  initialFilters?: {
    type?: string;
    location?: string;
    budget?: string;
    purpose?: string;
  };
}

const PROPERTY_TYPES: PropertyType[] = [
  'Residential Plot',
  'Agricultural Land',
  'Independent House',
  'Villa',
  'Apartment',
  'Commercial Property',
  'Commercial Land',
  'Farm Land'
];

const TIRUNELVELI_LOCALITIES = [
  'Palayamkottai',
  'Pettai',
  'Vannarpettai',
  'Maharajanagar',
  'Thachanallur',
  'Melapalayam',
  'Reddiyarpatti',
  'Suthamalli',
  'Tirunelveli Junction'
];

export const PropertySearch: React.FC<PropertySearchProps> = ({
  properties,
  onSelectProperty,
  initialFilters
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>(initialFilters?.purpose || 'All');
  const [selectedType, setSelectedType] = useState<string>(initialFilters?.type || 'All');
  const [selectedLocation, setSelectedLocation] = useState<string>(initialFilters?.location || 'All');
  const [maxPrice, setMaxPrice] = useState<number>(15000000);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [facingFilter, setFacingFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc'>('newest');
  
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [enquiryProp, setEnquiryProp] = useState<PropertyListing | null>(null);

  // Filter and sort logic
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesLoc = p.area.toLowerCase().includes(q) || p.locationName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }

      if (selectedPurpose !== 'All' && p.listingPurpose !== selectedPurpose) {
        return false;
      }

      if (selectedType !== 'All' && p.propertyType !== selectedType) {
        return false;
      }

      if (selectedLocation !== 'All') {
        if (!p.area.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      if (p.price > maxPrice) {
        return false;
      }

      if (facingFilter !== 'All' && p.facing !== facingFilter) {
        return false;
      }

      if (onlyVerified && !p.isVerified) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'area-asc') return a.landAreaSqft - b.landAreaSqft;
      if (sortBy === 'area-desc') return b.landAreaSqft - a.landAreaSqft;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    properties, 
    searchTerm, 
    selectedPurpose, 
    selectedType, 
    selectedLocation, 
    maxPrice, 
    facingFilter, 
    onlyVerified, 
    sortBy
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedPurpose('All');
    setSelectedType('All');
    setSelectedLocation('All');
    setMaxPrice(15000000);
    setOnlyVerified(false);
    setFacingFilter('All');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Search Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#B8892D]" />
              <span>Tirunelveli District Exclusive Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#18352A]">
              Explore Properties in Tirunelveli
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Verified DTCP layouts, independent homes, farmlands, and commercial showrooms.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 bg-[#F5F6F3] px-3.5 py-2 rounded-xl border border-stone-200">
            <Sparkles className="w-4 h-4 text-[#B8892D]" />
            <span>Showing <strong className="text-[#123F2B] font-bold">{filteredProperties.length}</strong> available listings</span>
          </div>
        </div>

        {/* Global Keyword & Purpose Row */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by locality, ID, or landmark (e.g. Pettai, NE-1001, Patta plot)..."
              className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-emerald-800 focus:bg-white"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-800 focus:outline-emerald-800 focus:bg-white"
            >
              <option value="All">All Listing Types</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent / Lease</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-800 focus:outline-emerald-800 focus:bg-white"
            >
              <option value="newest">Sort: Newly Listed First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="area-desc">Area: Largest First</option>
              <option value="area-asc">Area: Smallest First</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Content Layout (Desktop Sidebar Filters + Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2 font-bold text-xs text-[#18352A]">
              <Filter className="w-4 h-4 text-[#123F2B]" />
              <span>Tirunelveli Filters</span>
            </div>
            <button 
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Property Category */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Property Category
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedType('All')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedType === 'All' ? 'bg-[#123F2B] text-white' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>All Categories</span>
                {selectedType === 'All' && <Check className="w-3.5 h-3.5" />}
              </button>
              {PROPERTY_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedType === type ? 'bg-[#123F2B] text-white' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{type}</span>
                  {selectedType === type && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Locality in Tirunelveli */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Tirunelveli Locality
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-emerald-800"
            >
              <option value="All">All Localities</option>
              {TIRUNELVELI_LOCALITIES.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              <span>Max Budget</span>
              <span className="text-[#123F2B] font-bold">
                {maxPrice >= 10000000 
                  ? `₹${(maxPrice / 10000000).toFixed(2)} Cr`
                  : `₹${(maxPrice / 100000).toFixed(0)} Lakhs`}
              </span>
            </div>
            <input
              type="range"
              min="500000"
              max="20000000"
              step="500000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#123F2B] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-stone-400 font-bold mt-1">
              <span>₹5 L</span>
              <span>₹1 Cr</span>
              <span>₹2 Cr+</span>
            </div>
          </div>

          {/* Facing */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Facing Direction
            </label>
            <select
              value={facingFilter}
              onChange={(e) => setFacingFilter(e.target.value)}
              className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-emerald-800"
            >
              <option value="All">Any Direction</option>
              <option value="East">East Facing (Vaastu)</option>
              <option value="North">North Facing</option>
              <option value="North-East">North-East (Ishanya)</option>
              <option value="South">South Facing</option>
              <option value="West">West Facing</option>
            </select>
          </div>

          {/* Verified Only */}
          <div className="pt-2 border-t border-stone-100">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-4 h-4 rounded text-[#123F2B] focus:ring-emerald-800 border-stone-300"
              />
              <span className="text-xs font-bold text-stone-700">Pre-Verified by Nellai Assets</span>
            </label>
          </div>

        </aside>

        {/* MOBILE FILTER TOGGLE */}
        <div className="lg:hidden col-span-1 mb-2">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="w-full py-2.5 px-4 bg-white border border-stone-300 rounded-2xl text-stone-800 font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#123F2B]" />
            <span>Open Tirunelveli Filters & Budget</span>
          </button>
        </div>

        {/* PROPERTIES RESULTS GRID */}
        <div className="lg:col-span-3">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map(prop => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onSelect={onSelectProperty}
                  onQuickEnquire={(p) => setEnquiryProp(p)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-800">No properties found matching criteria</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 leading-relaxed">
                Try widening your budget slider or choosing another locality such as Palayamkottai, Pettai, or Vannarpettai.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 px-5 py-2 rounded-xl bg-[#123F2B] text-white text-xs font-bold hover:bg-emerald-900 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* QUICK ENQUIRY MODAL */}
      {enquiryProp && (
        <EnquiryModal
          isOpen={!!enquiryProp}
          onClose={() => setEnquiryProp(null)}
          property={enquiryProp}
          initialType="Enquiry"
        />
      )}

      {/* MOBILE DRAWER MODAL */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="font-bold text-base text-stone-800">Tirunelveli Filters</span>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-6 h-6 text-stone-500" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Category</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 text-xs border rounded-xl bg-stone-50"
              >
                <option value="All">All Categories</option>
                {PROPERTY_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Locality</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2 text-xs border rounded-xl bg-stone-50"
              >
                <option value="All">All Localities</option>
                {TIRUNELVELI_LOCALITIES.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 text-xs border rounded-xl font-bold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 text-xs bg-[#123F2B] text-white rounded-xl font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
