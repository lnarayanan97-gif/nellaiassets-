import React, { useState } from 'react';
import { 
  Building2, 
  Upload, 
  X, 
  Plus, 
  CheckCircle2, 
  MapPin, 
  IndianRupee, 
  AlertCircle,
  Sparkles,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { PropertyListing, PropertyType, ListingPurpose } from '../types';
import { savePropertyListing } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import { NellaiAssetsLogo } from './NellaiAssetsLogo';

interface PostPropertyProps {
  onSuccess: (newPropId: string) => void;
  onCancel: () => void;
}

const PROPERTY_TYPES: PropertyType[] = [
  'Residential Plot',
  'Agricultural Land',
  'Independent House',
  'Villa',
  'Apartment',
  'Commercial Property',
  'Commercial Land',
  'Farm Land',
  'Industrial Property',
  'Other'
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

export const PostProperty: React.FC<PostPropertyProps> = ({ onSuccess, onCancel }) => {
  const { userProfile } = useAuth();

  // Basic Information
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Residential Plot');
  const [listingPurpose, setListingPurpose] = useState<ListingPurpose>('For Sale');
  const [price, setPrice] = useState<number>(3500000);
  const [negotiable, setNegotiable] = useState(true);

  // Location (Tirunelveli Only)
  const [locationName, setLocationName] = useState('');
  const [area, setArea] = useState('Pettai');
  const [pincode, setPincode] = useState('627010');

  // Specs
  const [landAreaSqft, setLandAreaSqft] = useState<number>(2400);
  const [landAreaCent, setLandAreaCent] = useState<number>(5.5);
  const [builtUpAreaSqft, setBuiltUpAreaSqft] = useState<number>(0);
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [facing, setFacing] = useState<'East' | 'North' | 'South' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West'>('East');
  const [roadWidthFt, setRoadWidthFt] = useState<number>(30);
  const [ownershipType, setOwnershipType] = useState<'Freehold' | 'Leasehold' | 'Power of Attorney' | 'Co-operative'>('Freehold');
  const [approvalDetails, setApprovalDetails] = useState<'DTCP Approved' | 'CMDA Approved' | 'Panchayat Approved' | 'Corporation Approved' | 'A-Katha / Clear Patta' | 'Under Process' | 'Other'>('DTCP Approved');
  const [reraNumber, setReraNumber] = useState('');

  // Description & Amenities
  const [description, setDescription] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('Clear Title & Patta, 30ft Tar Road, Underground Drainage, Street Lighting');

  // Images state
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Private Seller Contact Info (Stored in database for Nellai Assets follow-up ONLY, never shown publicly)
  const [sellerName, setSellerName] = useState(userProfile?.displayName || 'Property Owner');
  const [sellerPhone, setSellerPhone] = useState(userProfile?.phone || '+91 94431 23456');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCentChange = (cents: number) => {
    setLandAreaCent(cents);
    setLandAreaSqft(Math.round(cents * 435.6));
  };

  const handleSqftChange = (sqft: number) => {
    setLandAreaSqft(sqft);
    setLandAreaCent(Number((sqft / 435.6).toFixed(2)));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleGenerateDescription = () => {
    const text = `Exclusive ${landAreaCent ? `${landAreaCent} Cents` : `${landAreaSqft} sq.ft`} ${propertyType.toLowerCase()} available ${listingPurpose.toLowerCase()} in prime ${locationName || area}, Tirunelveli. ${approvalDetails ? `Features verified ${approvalDetails} documentation with clear legal title.` : ''} Convenient ${roadWidthFt}ft road frontage facing ${facing}. Ideal for immediate construction or long-term high capital appreciation in developing Tirunelveli corridor. Contact Nellai Assets for preliminary title inspection and accompanied site visit.`;
    setDescription(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a descriptive property title.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const amenitiesList = amenitiesInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const pricePerSqft = landAreaSqft > 0 ? Math.round(price / landAreaSqft) : undefined;

      const propData: Partial<PropertyListing> = {
        title,
        propertyType,
        listingPurpose,
        price,
        pricePerSqft,
        negotiable,
        locationName,
        area,
        city: 'Tirunelveli',
        district: 'Tirunelveli',
        state: 'Tamil Nadu',
        pincode,
        latitude: 8.7139,
        longitude: 77.7471,
        landAreaSqft,
        landAreaCent,
        builtUpAreaSqft: builtUpAreaSqft || undefined,
        bedrooms: bedrooms || undefined,
        bathrooms: bathrooms || undefined,
        facing,
        roadWidthFt,
        ownershipType,
        approvalDetails,
        reraNumber: reraNumber || undefined,
        description,
        amenities: amenitiesList,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'],
        coverImage: images[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        userId: userProfile?.uid || 'guest-user',
        sellerName: sellerName || 'Verified Property Owner',
        sellerRole: userProfile?.role || 'seller',
        contactAdvisoryNotice: 'Protected by Nellai Assets — Request Callback or Site Visit',
        status: userProfile?.role === 'admin' ? 'approved' : 'pending_review',
        isVerified: userProfile?.role === 'admin',
        isFeatured: false,
      };

      const newId = await savePropertyListing(propData);
      onSuccess(newId);
    } catch (err) {
      console.error('Save property failed:', err);
      setErrorMsg('Failed to save listing. Please check inputs and retry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Form Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#123F2B]" />
              <span>Contact Privacy Guaranteed Listing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#18352A]">
              List Your Property in Tirunelveli
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Your personal phone number is strictly confidential. Nellai Assets qualifies buyers and coordinates verified site visits.
            </p>
          </div>

          <button
            onClick={onCancel}
            className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors"
          >
            Cancel & Return
          </button>
        </div>

        {/* Seller Privacy Assurance Box */}
        <div className="mt-5 p-4 rounded-2xl bg-[#F5F6F3] border border-emerald-100 flex items-start gap-3 text-xs text-stone-700">
          <Lock className="w-5 h-5 text-[#123F2B] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-[#18352A]">Receive Enquiries Securely Through Nellai Assets</h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              We never broadcast your personal phone number on public cards or search engines. Prospective buyers submit requests to Nellai Assets. Our advisory team screens buyer budgets, arranges accompanied site visits, and brings serious offers directly to you.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Listing Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: BASIC TYPE & PRICING */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#18352A] pb-3 border-b border-stone-100">
            1. Property Type & Pricing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Listing Purpose */}
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Listing Purpose *</label>
              <div className="grid grid-cols-3 gap-2">
                {(['For Sale', 'For Rent', 'Lease'] as ListingPurpose[]).map(purp => (
                  <button
                    key={purp}
                    type="button"
                    onClick={() => setListingPurpose(purp)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      listingPurpose === purp
                        ? 'bg-[#123F2B] text-white shadow-xs'
                        : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {purp}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Property Category *</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-stone-800 focus:outline-emerald-800"
              >
                {PROPERTY_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Listing Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. DTCP Approved 5.5 Cents Villa Plot near Cheranmahadevi Road, Pettai"
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl p-2.5 text-xs font-medium text-stone-800 focus:outline-emerald-800 focus:bg-white"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">
                Expected Price (in ₹ INR) *
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-emerald-800 focus:bg-white"
                />
              </div>
              <span className="block text-[11px] text-emerald-800 font-semibold mt-1">
                Amount: ₹{price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Price Negotiable */}
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="w-4 h-4 rounded text-[#123F2B] border-stone-300"
                />
                <span>Price is Negotiable through Adviser</span>
              </label>
            </div>

          </div>
        </div>

        {/* SECTION 2: LOCATION DETAILS (TIRUNELVELI ONLY) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#18352A] pb-3 border-b border-stone-100">
            2. Tirunelveli Location Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Tirunelveli Locality *</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-stone-800 focus:outline-emerald-800"
              >
                {TIRUNELVELI_LOCALITIES.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Locality / Colony / Landmark *</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Near CSI Church, Cheranmahadevi Road"
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl p-2.5 text-xs font-medium text-stone-800 focus:outline-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">City / District</label>
              <input
                type="text"
                disabled
                value="Tirunelveli District, Tamil Nadu"
                className="w-full bg-stone-100 border border-stone-200 rounded-xl p-2.5 text-xs font-bold text-stone-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Pincode *</label>
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="627002"
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl p-2.5 text-xs font-medium text-stone-800 focus:outline-emerald-800"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: SPECIFICATIONS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#18352A] pb-3 border-b border-stone-100">
            3. Specifications & Approvals
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Land Area in Cents</label>
              <input
                type="number"
                step="0.01"
                value={landAreaCent}
                onChange={(e) => handleCentChange(Number(e.target.value))}
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-stone-800 focus:outline-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Land Area in Sq.ft</label>
              <input
                type="number"
                value={landAreaSqft}
                onChange={(e) => handleSqftChange(Number(e.target.value))}
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-stone-800 focus:outline-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Facing Direction</label>
              <select
                value={facing}
                onChange={(e) => setFacing(e.target.value as any)}
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-stone-800 focus:outline-emerald-800"
              >
                <option value="East">East</option>
                <option value="North">North</option>
                <option value="North-East">North-East</option>
                <option value="South">South</option>
                <option value="West">West</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Road Width (Feet)</label>
              <input
                type="number"
                value={roadWidthFt}
                onChange={(e) => setRoadWidthFt(Number(e.target.value))}
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-stone-800 focus:outline-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Approval Status</label>
              <select
                value={approvalDetails}
                onChange={(e) => setApprovalDetails(e.target.value as any)}
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-stone-800 focus:outline-emerald-800"
              >
                <option value="DTCP Approved">DTCP Approved</option>
                <option value="CMDA Approved">CMDA Approved</option>
                <option value="Corporation Approved">Corporation Approved</option>
                <option value="A-Katha / Clear Patta">A-Katha / Clear Patta</option>
                <option value="Panchayat Approved">Panchayat Approved</option>
                <option value="Under Process">Under Process</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">RERA Registration (if any)</label>
              <input
                type="text"
                value={reraNumber}
                onChange={(e) => setReraNumber(e.target.value)}
                placeholder="TN/12/Layout/..."
                className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl p-2.5 text-xs font-medium text-stone-800 focus:outline-emerald-800"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: PHOTOS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#18352A] pb-3 border-b border-stone-100">
            4. Photos & Site Preview
          </h2>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste direct image URL..."
                className="flex-1 bg-[#F5F6F3] border border-stone-300 rounded-xl p-2.5 text-xs font-medium text-stone-800 focus:outline-emerald-800"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2.5 bg-[#123F2B] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-4/3 rounded-2xl overflow-hidden border border-stone-200 group">
                  <img src={img} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#123F2B] text-white">
                      Cover Photo
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 5: DESCRIPTION & AI GENERATOR */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-base font-bold text-[#18352A]">
              5. Description & Key Amenities
            </h2>
            <button
              type="button"
              onClick={handleGenerateDescription}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#B8892D] hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Draft Description</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1.5">Description *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe title status, nearby schools, water source, and road frontage..."
              className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl p-3 text-xs font-normal text-stone-800 focus:outline-emerald-800 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1.5">
              Amenities & Tags (comma separated)
            </label>
            <input
              type="text"
              value={amenitiesInput}
              onChange={(e) => setAmenitiesInput(e.target.value)}
              className="w-full bg-[#F5F6F3] border border-stone-300 rounded-xl p-2.5 text-xs font-medium text-stone-800 focus:outline-emerald-800"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4 text-[#E0B25B]" />
            <span>{saving ? 'Registering Listing...' : 'Submit Listing (Privacy Protected)'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
