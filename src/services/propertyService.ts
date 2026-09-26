import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PropertyListing, PropertyEnquiry, UserProfile, LocationItem, ListingStatus, LeadStatus } from '../types';
import { INITIAL_PROPERTIES, INITIAL_LOCATIONS } from '../data/mockData';

const PROPERTIES_COLLECTION = 'properties';
const USERS_COLLECTION = 'users';
const ENQUIRIES_COLLECTION = 'enquiries';
const LOCATIONS_COLLECTION = 'locations';

const INITIAL_DEMO_LEADS: PropertyEnquiry[] = [
  {
    id: 'LEAD-101',
    propertyId: 'NE-1001',
    propertyTitle: 'DTCP Approved 5.5 Cents Premium Plot in Nellai Emirates Town',
    propertyPrice: 3850000,
    propertyLocation: 'Pettai, Tirunelveli',
    sellerId: 'seller-verified-01',
    buyerName: 'Karthikeyan Narayanan',
    buyerPhone: '+91 98402 33445',
    buyerWhatsapp: '+91 98402 33445',
    buyerEmail: 'karthi.n@gmail.com',
    message: 'Interested in purchasing the 5.5 Cents plot in Nellai Emirates Town. Need to verify DTCP layout order copy and schedule a site visit this Saturday.',
    preferredContactTime: 'Morning (9 AM - 12 PM)',
    siteVisitRequested: true,
    preferredVisitDate: '2026-10-03',
    leadType: 'Site Visit',
    status: 'Qualified',
    assignedRepresentative: 'Sundar Rajan K (Founder)',
    followUpDate: '2026-09-30',
    internalNotes: [
      'Spoke with buyer: Verified budget readiness, works in Chennai, native of Tirunelveli looking for retirement plot.',
      'DTCP order TN/12/Layout/0284/2023 shared via official Nellai Assets advisory desk.'
    ],
    createdAt: '2026-09-24T10:15:00.000Z',
    updatedAt: '2026-09-25T11:00:00.000Z',
  },
  {
    id: 'LEAD-102',
    propertyId: 'NE-1002',
    propertyTitle: 'Architect-Designed 4 BHK Independent Duplex Villa on 40ft Avenue',
    propertyPrice: 13500000,
    propertyLocation: 'Maharajanagar, Tirunelveli',
    sellerId: 'seller-verified-02',
    buyerName: 'Dr. Meenakshi Sundaram',
    buyerPhone: '+91 94432 88990',
    buyerWhatsapp: '+91 94432 88990',
    buyerEmail: 'dr.meenakshi@nellaimed.org',
    message: 'Looking for a spacious ready-to-move villa near Pushpalata school for my family. Please arrange callback regarding Vaastu compliance and price negotiation.',
    preferredContactTime: 'Evening (4 PM - 8 PM)',
    siteVisitRequested: true,
    preferredVisitDate: '2026-10-01',
    leadType: 'Callback',
    status: 'Site Visit Scheduled',
    assignedRepresentative: 'Senior Property Adviser',
    followUpDate: '2026-10-01',
    internalNotes: [
      'Consultation completed: Buyer confirmed North facing entrance preference.',
      'Accompanied visit arranged with owner Er. Sundarapandian for Thursday 5 PM.'
    ],
    createdAt: '2026-09-23T14:30:00.000Z',
    updatedAt: '2026-09-25T16:00:00.000Z',
  },
  {
    id: 'LEAD-103',
    propertyId: 'NE-1006',
    propertyTitle: '3.2 Acres Fertile Organic Coconut Farm with Free Agri EB Power in Suthamalli',
    propertyPrice: 7680000,
    propertyLocation: 'Suthamalli, Tirunelveli',
    sellerId: 'seller-verified-04',
    buyerName: 'R. Muthukumar',
    buyerPhone: '+91 97891 22334',
    buyerWhatsapp: '+91 97891 22334',
    message: 'Seeking coconut farm with active EB connection for organic farming. Want to confirm Patta clear status and water source perpetually.',
    preferredContactTime: 'Afternoon (12 PM - 4 PM)',
    siteVisitRequested: false,
    leadType: 'Enquiry',
    status: 'New',
    assignedRepresentative: 'Sundar Rajan K (Founder)',
    internalNotes: [
      'New enquiry via Nellai Assets Web Portal.'
    ],
    createdAt: '2026-09-26T02:00:00.000Z',
    updatedAt: '2026-09-26T02:00:00.000Z',
  }
];

// Seed initial database records if empty
export async function seedInitialDataIfNeeded(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, PROPERTIES_COLLECTION));
    if (snap.empty) {
      console.log('Seeding initial Nellai Assets Tirunelveli properties to Firestore...');
      for (const prop of INITIAL_PROPERTIES) {
        await setDoc(doc(db, PROPERTIES_COLLECTION, prop.id), {
          ...prop,
          createdAt: prop.createdAt || new Date().toISOString(),
          updatedAt: prop.updatedAt || new Date().toISOString(),
        });
      }

      for (const loc of INITIAL_LOCATIONS) {
        await setDoc(doc(db, LOCATIONS_COLLECTION, loc.id), loc);
      }

      for (const lead of INITIAL_DEMO_LEADS) {
        await setDoc(doc(db, ENQUIRIES_COLLECTION, lead.id), lead);
      }
      console.log('Seeding complete.');
    }
  } catch (error) {
    console.warn('Initial seeding fallback to mock data:', error);
  }
}

// Fetch all approved properties for public marketplace
export async function fetchPublicProperties(): Promise<PropertyListing[]> {
  try {
    const q = query(
      collection(db, PROPERTIES_COLLECTION),
      where('status', '==', 'approved')
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as PropertyListing));
    }
  } catch (err) {
    console.warn('Firestore fetchPublicProperties error, fallback to initial data:', err);
  }
  return INITIAL_PROPERTIES;
}

// Fetch all properties (for Admin moderation)
export async function fetchAllPropertiesAdmin(): Promise<PropertyListing[]> {
  try {
    const snap = await getDocs(collection(db, PROPERTIES_COLLECTION));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as PropertyListing));
    }
  } catch (err) {
    console.warn('Firestore fetchAllPropertiesAdmin error:', err);
  }
  return INITIAL_PROPERTIES;
}

// Fetch properties listed by a specific user
export async function fetchUserProperties(userId: string): Promise<PropertyListing[]> {
  try {
    const q = query(
      collection(db, PROPERTIES_COLLECTION),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as PropertyListing));
    }
  } catch (err) {
    console.warn('Firestore fetchUserProperties error:', err);
  }
  return INITIAL_PROPERTIES.filter(p => p.userId === userId);
}

// Fetch single property by slug or id
export async function fetchPropertyByIdOrSlug(identifier: string): Promise<PropertyListing | null> {
  try {
    const directDoc = await getDoc(doc(db, PROPERTIES_COLLECTION, identifier));
    if (directDoc.exists()) {
      return { id: directDoc.id, ...directDoc.data() } as PropertyListing;
    }
    
    const q = query(
      collection(db, PROPERTIES_COLLECTION),
      where('slug', '==', identifier)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...d.data() } as PropertyListing;
    }
  } catch (err) {
    console.warn('Firestore fetchPropertyByIdOrSlug error:', err);
  }

  const match = INITIAL_PROPERTIES.find(p => p.id === identifier || p.slug === identifier);
  return match || null;
}

// Create or update a property
export async function savePropertyListing(property: Partial<PropertyListing>): Promise<string> {
  const isNew = !property.id;
  const propId = property.id || `NE-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const titleSlug = (property.title || 'nellai-property')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const slug = property.slug || `${titleSlug}-${propId.toLowerCase()}`;

  const dataToSave: PropertyListing = {
    id: propId,
    slug,
    title: property.title || 'Residential Property in Tirunelveli',
    description: property.description || '',
    propertyType: property.propertyType || 'Residential Plot',
    listingPurpose: property.listingPurpose || 'For Sale',
    price: property.price || 0,
    pricePerSqft: property.pricePerSqft,
    negotiable: property.negotiable ?? true,
    locationName: property.locationName || '',
    area: property.area || 'Palayamkottai',
    city: 'Tirunelveli',
    district: 'Tirunelveli',
    state: 'Tamil Nadu',
    pincode: property.pincode || '627002',
    latitude: property.latitude || 8.7139,
    longitude: property.longitude || 77.7471,
    nearbyHighlights: property.nearbyHighlights || [],
    landAreaSqft: property.landAreaSqft || 2400,
    landAreaCent: property.landAreaCent,
    builtUpAreaSqft: property.builtUpAreaSqft,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parkingSpaces: property.parkingSpaces,
    facing: property.facing || 'East',
    roadWidthFt: property.roadWidthFt || 30,
    floorNumber: property.floorNumber,
    totalFloors: property.totalFloors,
    propertyAgeYears: property.propertyAgeYears,
    furnishingStatus: property.furnishingStatus || 'Unfurnished',
    ownershipType: property.ownershipType || 'Freehold',
    approvalDetails: property.approvalDetails || 'DTCP Approved',
    reraNumber: property.reraNumber,
    images: property.images && property.images.length > 0 ? property.images : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'],
    coverImage: property.coverImage || property.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    amenities: property.amenities || [],
    userId: property.userId || 'guest-user',
    sellerName: property.sellerName || 'Verified Property Owner',
    sellerRole: property.sellerRole || 'seller',
    contactAdvisoryNotice: 'Protected by Nellai Assets — Request Callback or Site Visit',
    status: property.status || 'pending_review',
    isFeatured: property.isFeatured ?? false,
    isVerified: property.isVerified ?? false,
    viewsCount: property.viewsCount || 0,
    enquiriesCount: property.enquiriesCount || 0,
    createdAt: property.createdAt || now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, PROPERTIES_COLLECTION, propId), dataToSave, { merge: true });
  } catch (err) {
    console.warn('Error saving property to Firestore:', err);
  }
  return propId;
}

// Update property status (admin moderation)
export async function updatePropertyStatus(
  propertyId: string, 
  status: ListingStatus,
  reason?: string
): Promise<void> {
  try {
    const updateData: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (reason !== undefined) updateData.adminRejectionReason = reason;
    if (status === 'approved') updateData.isVerified = true;

    await updateDoc(doc(db, PROPERTIES_COLLECTION, propertyId), updateData);
  } catch (err) {
    console.warn('Error updating status in Firestore:', err);
  }
}

// Delete property
export async function deletePropertyListing(propertyId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PROPERTIES_COLLECTION, propertyId));
  } catch (err) {
    console.warn('Error deleting property in Firestore:', err);
  }
}

// Submit Enquiry / Lead
export async function submitPropertyEnquiry(
  enquiry: Omit<PropertyEnquiry, 'id' | 'createdAt' | 'status' | 'updatedAt'>
): Promise<string> {
  const enquiryId = `LEAD-${Date.now().toString().slice(-6)}`;
  const now = new Date().toISOString();
  
  const record: PropertyEnquiry = {
    ...enquiry,
    id: enquiryId,
    status: 'New',
    assignedRepresentative: 'Sundar Rajan K (Founder)',
    internalNotes: [`Inquiry registered via Nellai Assets Gateway at ${new Date().toLocaleTimeString()}`],
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, ENQUIRIES_COLLECTION, enquiryId), record);
    
    // Increment enquiriesCount on property
    if (enquiry.propertyId && enquiry.propertyId !== 'FOUNDER-ADVISORY') {
      const propRef = doc(db, PROPERTIES_COLLECTION, enquiry.propertyId);
      const snap = await getDoc(propRef);
      if (snap.exists()) {
        const current = snap.data().enquiriesCount || 0;
        await updateDoc(propRef, { enquiriesCount: current + 1 });
      }
    }
  } catch (err) {
    console.warn('Error submitting enquiry to Firestore:', err);
  }
  return enquiryId;
}

// Update Lead Status & CRM Workflow (Admin)
export async function updateLeadStatus(
  leadId: string, 
  status: LeadStatus, 
  assignedRepresentative?: string,
  followUpDate?: string
): Promise<void> {
  try {
    const updates: Record<string, any> = {
      status,
      leadStatus: status,
      updatedAt: new Date().toISOString()
    };
    if (assignedRepresentative) updates.assignedRepresentative = assignedRepresentative;
    if (followUpDate) updates.followUpDate = followUpDate;

    await updateDoc(doc(db, ENQUIRIES_COLLECTION, leadId), updates);
  } catch (err) {
    console.warn('Error updating lead status:', err);
  }
}

export async function updateLeadStatusAndNotes(
  leadId: string,
  newStatus: LeadStatus,
  internalNotes?: string[]
): Promise<void> {
  try {
    const updates: Record<string, any> = {
      leadStatus: newStatus,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    if (internalNotes) {
      updates.internalNotes = internalNotes;
    }
    await updateDoc(doc(db, ENQUIRIES_COLLECTION, leadId), updates);
  } catch (err) {
    console.warn('Error updating lead status and notes:', err);
  }
}

export async function assignLeadToAdvisor(
  leadId: string,
  advisorName: string
): Promise<void> {
  try {
    await updateDoc(doc(db, ENQUIRIES_COLLECTION, leadId), {
      assignedAdvisor: advisorName,
      assignedRepresentative: advisorName,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Error assigning advisor to lead:', err);
  }
}

// Add Internal Note to Lead (Admin)
export async function addLeadNote(leadId: string, noteText: string): Promise<void> {
  try {
    const ref = doc(db, ENQUIRIES_COLLECTION, leadId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const currentNotes = (snap.data().internalNotes as string[]) || [];
      const updatedNotes = [...currentNotes, `${noteText} (${new Date().toLocaleDateString()})`];
      await updateDoc(ref, { 
        internalNotes: updatedNotes,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Error adding lead note:', err);
  }
}

// Fetch enquiries for a specific seller
// NOTE: Raw buyer contact is protected; seller sees advisory coordination status
export async function fetchSellerEnquiries(sellerId: string): Promise<PropertyEnquiry[]> {
  try {
    const q = query(
      collection(db, ENQUIRIES_COLLECTION),
      where('sellerId', '==', sellerId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as PropertyEnquiry));
    }
  } catch (err) {
    console.warn('Error fetching seller enquiries:', err);
  }
  return INITIAL_DEMO_LEADS.filter(l => l.sellerId === sellerId);
}

// Fetch enquiries made by a buyer
export async function fetchBuyerEnquiries(buyerId: string): Promise<PropertyEnquiry[]> {
  try {
    const q = query(
      collection(db, ENQUIRIES_COLLECTION),
      where('buyerId', '==', buyerId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as PropertyEnquiry));
    }
  } catch (err) {
    console.warn('Error fetching buyer enquiries:', err);
  }
  return INITIAL_DEMO_LEADS.filter(l => l.buyerId === buyerId);
}

// Fetch all enquiries / Leads (Admin CRM)
export async function fetchAllEnquiriesAdmin(): Promise<PropertyEnquiry[]> {
  try {
    const snap = await getDocs(collection(db, ENQUIRIES_COLLECTION));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as PropertyEnquiry));
    }
  } catch (err) {
    console.warn('Error fetching admin enquiries:', err);
  }
  return INITIAL_DEMO_LEADS;
}

// Tirunelveli Locations Service
export async function fetchTirunelveliLocations(): Promise<LocationItem[]> {
  try {
    const snap = await getDocs(collection(db, LOCATIONS_COLLECTION));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as LocationItem));
    }
  } catch (err) {
    console.warn('Error fetching locations:', err);
  }
  return INITIAL_LOCATIONS;
}

export async function addTirunelveliLocation(loc: LocationItem): Promise<void> {
  try {
    await setDoc(doc(db, LOCATIONS_COLLECTION, loc.id), loc);
  } catch (err) {
    console.warn('Error adding location:', err);
  }
}

// User Profile Service
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const d = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (d.exists()) {
      return d.data() as UserProfile;
    }
  } catch (err) {
    console.warn('Error fetching user profile:', err);
  }
  return null;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await setDoc(doc(db, USERS_COLLECTION, profile.uid), profile, { merge: true });
  } catch (err) {
    console.warn('Error saving user profile:', err);
  }
}

// Toggle favourite
export async function toggleUserFavorite(uid: string, propertyId: string): Promise<string[]> {
  try {
    const profile = await getUserProfile(uid);
    if (profile) {
      const current = profile.savedProperties || [];
      const updated = current.includes(propertyId)
        ? current.filter(id => id !== propertyId)
        : [...current, propertyId];
      await updateDoc(doc(db, USERS_COLLECTION, uid), { savedProperties: updated });
      return updated;
    }
  } catch (err) {
    console.warn('Error toggling favourite:', err);
  }
  return [];
}
