import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { getUserProfile, saveUserProfile } from '../services/propertyService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (data: {
    email: string;
    pass: string;
    displayName: string;
    role: UserRole;
    phone: string;
    whatsapp: string;
    city: string;
    district: string;
    agencyName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  switchMockRole: (role: UserRole) => void; // Development convenience switcher
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile when auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        let profile = await getUserProfile(user.uid);
        if (!profile) {
          // Check if this is the admin account or bootstrap profile
          const isAdmin = user.email === 'admin@nellaiassets.com' || user.email?.includes('admin');
          profile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'Nellai User',
            role: isAdmin ? 'admin' : 'buyer',
            phone: '+919443123456',
            whatsapp: '+919443123456',
            city: 'Tirunelveli',
            district: 'Tirunelveli',
            state: 'Tamil Nadu',
            isVerified: true,
            status: 'active',
            createdAt: new Date().toISOString(),
            savedProperties: ['prop-1', 'prop-2'],
          };
          await saveUserProfile(profile);
        }
        setUserProfile(profile);
      } else {
        // Fallback demo session so user can immediately experience the platform without requiring external email confirmation
        setUserProfile({
          uid: 'demo-buyer-1',
          email: 'investor@nellaiassets.com',
          displayName: 'Sundar Ramasamy',
          role: 'buyer',
          phone: '+91 94431 89765',
          whatsapp: '+91 94431 89765',
          city: 'Tirunelveli',
          district: 'Tirunelveli',
          state: 'Tamil Nadu',
          isVerified: true,
          status: 'active',
          createdAt: '2026-01-10T00:00:00.000Z',
          savedProperties: ['prop-1', 'prop-2'],
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (currentUser) {
      const p = await getUserProfile(currentUser.uid);
      if (p) setUserProfile(p);
    }
  };

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const p = await getUserProfile(cred.user.uid);
    if (p) setUserProfile(p);
  };

  const signup = async (data: {
    email: string;
    pass: string;
    displayName: string;
    role: UserRole;
    phone: string;
    whatsapp: string;
    city: string;
    district: string;
    agencyName?: string;
  }) => {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.pass);
    await updateProfile(cred.user, { displayName: data.displayName });
    
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: data.email,
      displayName: data.displayName,
      role: data.role,
      phone: data.phone,
      whatsapp: data.whatsapp,
      city: data.city || 'Tirunelveli',
      district: data.district || 'Tirunelveli',
      state: 'Tamil Nadu',
      agencyName: data.agencyName,
      isVerified: data.role === 'buyer', // sellers, agents, builders verified by admin
      status: 'active',
      createdAt: new Date().toISOString(),
      savedProperties: [],
    };
    
    await saveUserProfile(newProfile);
    setUserProfile(newProfile);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Switcher for rapid testing of roles during review
  const switchMockRole = (role: UserRole) => {
    if (!userProfile) return;
    setUserProfile({
      ...userProfile,
      role,
      displayName: role === 'admin' 
        ? 'Nellai Assets Admin' 
        : role === 'agent' 
        ? 'M. Sivasankaran (Agent)' 
        : role === 'builder'
        ? 'Tamirabarani Foundations (Builder)'
        : role === 'seller'
        ? 'Er. R. Sundarapandian (Owner)'
        : 'Sundar Ramasamy (Buyer)'
    });
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      login,
      signup,
      logout,
      resetPassword,
      refreshProfile,
      switchMockRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
