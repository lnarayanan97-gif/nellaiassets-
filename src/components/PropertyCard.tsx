import React from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  Heart, 
  ShieldCheck, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { PropertyListing } from '../types';
import { useAuth } from '../context/AuthContext';

interface PropertyCardProps {
  property: PropertyListing;
  onSelect: (prop: PropertyListing) => void;
  onToggleFavorite?: (propId: string) => void;
  onQuickEnquire?: (prop: PropertyListing) => void;
  isFavorited?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onSelect, 
  onToggleFavorite,
  onQuickEnquire,
  isFavorited = false 
}) => {
  const { userProfile } = useAuth();

  const formatPrice = (val: number, purpose: string) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    if (purpose === 'For Rent' || purpose === 'Lease') {
      return `₹${val.toLocaleString('en-IN')}/mo`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const isFav = isFavorited || userProfile?.savedProperties?.includes(property.id);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-800/30 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Media Container */}
      <div 
        className="relative aspect-16/10 overflow-hidden bg-stone-100 cursor-pointer" 
        onClick={() => onSelect(property)}
      >
        <img
          src={property.coverImage || property.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/25 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-[#123F2B] text-white shadow-sm">
              {property.listingPurpose}
            </span>
            {property.isVerified && (
              <span className="px-2 py-0.8 rounded-md text-[11px] font-semibold bg-emerald-600 text-white flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3 h-3 text-[#E0B25B]" /> Verified
              </span>
            )}
            {property.approvalDetails && (
              <span className="px-2 py-0.8 rounded-md text-[10px] font-semibold bg-amber-600/95 text-white shadow-sm">
                {property.approvalDetails}
              </span>
            )}
          </div>

          {/* Favorite Button */}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(property.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isFav 
                  ? 'bg-rose-500 text-white shadow-md' 
                  : 'bg-white/80 hover:bg-white text-stone-700 hover:text-rose-500'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Price & Location Preview on Banner bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white pointer-events-none">
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-md text-[#F4D068]">
              {formatPrice(property.price, property.listingPurpose)}
            </span>
            {property.pricePerSqft && (
              <span className="block text-[11px] font-medium text-stone-200 drop-shadow-xs">
                ₹{property.pricePerSqft.toLocaleString('en-IN')}/sq.ft
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold bg-black/50 backdrop-blur-sm px-2.5 py-0.8 rounded text-stone-100">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Location & ID Line */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#B8892D] shrink-0" />
              <span className="font-bold text-stone-700">{property.area}, Tirunelveli</span>
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              {property.id}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(property)}
            className="font-serif font-bold text-base text-[#18352A] group-hover:text-[#123F2B] transition-colors line-clamp-2 leading-snug cursor-pointer mb-2.5"
          >
            {property.title}
          </h3>

          {/* Key Specs Row */}
          <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 bg-[#F5F6F3] rounded-xl text-xs text-stone-600 mb-2 border border-stone-200/60">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[9px] uppercase font-bold text-stone-400">Area</span>
              <span className="font-bold text-stone-800 text-[11px]">
                {property.landAreaCent ? `${property.landAreaCent} Cents` : `${property.landAreaSqft} sq.ft`}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center border-x border-stone-200">
              <span className="text-[9px] uppercase font-bold text-stone-400">Facing</span>
              <span className="font-bold text-stone-800 text-[11px]">{property.facing || 'East'}</span>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[9px] uppercase font-bold text-stone-400">Road</span>
              <span className="font-bold text-stone-800 text-[11px]">{property.roadWidthFt ? `${property.roadWidthFt}ft` : '30ft'}</span>
            </div>
          </div>

          {/* Advisory & Privacy Assurance Pill */}
          <div className="text-[10px] text-emerald-900 bg-emerald-50/80 px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3 h-3 text-[#123F2B] shrink-0" />
            <span className="truncate">Contact through Nellai Assets Advisory Desk</span>
          </div>
        </div>

        {/* Footer CTAs (Zero phone number leakage) */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          {onQuickEnquire && (
            <button
              onClick={() => onQuickEnquire(property)}
              className="flex-1 py-2 px-2.5 rounded-lg border border-[#B8892D] text-[#B8892D] hover:bg-amber-50 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#B8892D]" />
              <span>Enquire</span>
            </button>
          )}

          <button
            onClick={() => onSelect(property)}
            className="flex-1 py-2 px-3 rounded-lg bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
          >
            <span>Get Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
