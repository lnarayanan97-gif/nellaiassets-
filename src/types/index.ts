export type UserRole = 'buyer' | 'seller' | 'agent' | 'builder' | 'admin';

export type ListingStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'approved' 
  | 'rejected' 
  | 'sold' 
  | 'rented' 
  | 'expired' 
  | 'suspended';

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'site_visit_scheduled'
  | 'negotiation'
  | 'converted'
  | 'closed'
  | 'not_interested'
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Site Visit Scheduled'
  | 'Negotiation'
  | 'Converted'
  | 'Closed'
  | 'Not Interested';

export type PropertyType = 
  | 'Residential Plot'
  | 'Agricultural Land'
  | 'Independent House'
  | 'Villa'
  | 'Apartment'
  | 'Commercial Property'
  | 'Commercial Land'
  | 'Farm Land'
  | 'Industrial Property'
  | 'Other';

export type ListingPurpose = 'For Sale' | 'For Rent' | 'Lease';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone: string;
  whatsapp?: string;
  city: string;
  district: string;
  state: string;
  photoURL?: string;
  agencyName?: string;
  builderCompanyName?: string;
  experienceYears?: number;
  reraNumber?: string;
  isVerified: boolean;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  updatedAt?: string;
  savedProperties?: string[]; // IDs
  searchPreferences?: {
    preferredLocations?: string[];
    preferredTypes?: PropertyType[];
    minBudget?: number;
    maxBudget?: number;
  };
}

/**
 * Public Property Listing
 * PRIVACY BY DESIGN:
 * Never exposes raw seller phone number or email to public visitors/card/page JSON.
 * All enquiries and calls are routed through Nellai Assets.
 */
export interface PropertyListing {
  id: string;
  slug: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  listingPurpose: ListingPurpose;
  price: number; // in INR
  pricePerSqft?: number;
  negotiable?: boolean;
  
  // Location Hierarchy: Tamil Nadu -> Tirunelveli District -> Locality
  locationName: string; // locality or landmark (e.g. Near St. Xavier's, High Court Rd)
  area: string; // e.g. Palayamkottai, Pettai, Vannarpettai, Reddiyarpatti, Suthamalli
  city: 'Tirunelveli';
  district: 'Tirunelveli';
  state: 'Tamil Nadu';
  pincode: string;
  latitude: number;
  longitude: number;
  nearbyHighlights?: string[];

  // Dimensions & Specs
  landAreaSqft: number;
  landAreaCent?: number; // 1 cent = 435.6 sqft common in TN
  builtUpAreaSqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  facing?: 'North' | 'East' | 'South' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  roadWidthFt?: number;
  floorNumber?: number;
  totalFloors?: number;
  propertyAgeYears?: number;
  furnishingStatus?: 'Unfurnished' | 'Semi-Furnished' | 'Fully-Furnished';
  ownershipType?: 'Freehold' | 'Leasehold' | 'Power of Attorney' | 'Co-operative';
  approvalDetails?: 'DTCP Approved' | 'CMDA Approved' | 'Panchayat Approved' | 'Corporation Approved' | 'A-Katha / Clear Patta' | 'Under Process' | 'Other';
  reraNumber?: string;

  // Media
  images: string[];
  coverImage: string;
  videoUrl?: string;

  // Features & Amenities
  amenities: string[];

  // Seller Attribution (Privacy Protected by Nellai Assets)
  userId: string;
  sellerName: string;
  sellerRole: UserRole;
  sellerPhone?: string; // Kept in admin private field or optional compatibility
  sellerPrivateContact?: {
    phone: string;
    whatsapp?: string;
    email?: string;
  };
  contactAdvisoryNotice: string; // e.g., "Contact through Nellai Assets"

  // Status & Moderation
  status: ListingStatus;
  isFeatured?: boolean;
  isVerified?: boolean;
  viewsCount?: number;
  enquiriesCount?: number;
  adminRejectionReason?: string;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Lead / Property Enquiry Model
 * Managed exclusively through Nellai Assets
 */
export interface PropertyEnquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyLocation: string;
  propertyCoverImage?: string;
  sellerId: string;
  buyerId?: string;
  buyerName: string;
  buyerPhone: string;
  buyerWhatsapp?: string;
  buyerEmail?: string;
  message: string;
  preferredContactTime?: 'Morning (9 AM - 12 PM)' | 'Afternoon (12 PM - 4 PM)' | 'Evening (4 PM - 8 PM)' | 'Anytime';
  preferredTime?: string;
  siteVisitRequested?: boolean;
  requestSiteVisit?: boolean;
  preferredVisitDate?: string;
  leadType?: 'Enquiry' | 'Callback' | 'Site Visit' | 'WhatsApp';
  status: LeadStatus;
  leadStatus?: LeadStatus;
  assignedAdvisor?: string;
  assignedRepresentative?: string;
  followUpDate?: string;
  internalNotes?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface ProjectListing {
  id: string;
  title: string;
  developerName: string;
  developerId: string;
  location: string;
  city: 'Tirunelveli';
  district: 'Tirunelveli';
  reraNumber?: string;
  status: 'Upcoming' | 'Under Construction' | 'Ready to Occupy';
  unitsAvailable: number;
  minPrice: number;
  maxPrice: number;
  propertyTypes: PropertyType[];
  coverImage: string;
  images: string[];
  description: string;
  amenities: string[];
  possessionDate: string;
  createdAt: string;
}

export interface LocationItem {
  id: string;
  name: string;
  district: 'Tirunelveli';
  state: 'Tamil Nadu';
  pincode: string;
  tagline: string;
  imageUrl: string;
  propertyCount?: number;
  popularFor?: string;
}
