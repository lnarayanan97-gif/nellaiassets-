import React, { useState } from 'react';
import { 
  ShieldCheck, 
  PhoneCall, 
  ChevronDown, 
  LayoutDashboard, 
  LogOut, 
  Heart, 
  PlusCircle, 
  Menu, 
  X,
  User,
  Compass,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { NellaiAssetsLogo } from './NellaiAssetsLogo';

interface HeaderProps {
  onNavigate: (view: string, param?: string) => void;
  activeView: string;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, activeView, onOpenAuth }) => {
  const { userProfile, logout, switchMockRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const officialContactPhone = '+91 93603 90690';
  const officialWhatsappUrl = 'https://wa.me/919360390690';

  const getDashboardLabel = (role?: UserRole) => {
    switch (role) {
      case 'admin': return 'Nellai Assets Control & CRM';
      case 'builder': return 'Builder Hub';
      case 'agent': return 'Agent Dashboard';
      case 'seller': return 'Seller Dashboard (Protected)';
      default: return 'Buyer Dashboard';
    }
  };

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Buy', view: 'browse', param: 'buy' },
    { label: 'Rent', view: 'browse', param: 'rent' },
    { label: 'Sell Property', view: 'post-property' },
    { label: 'Projects', view: 'projects' },
    { label: 'Locations', view: 'locations' },
    { label: 'About', view: 'about' },
    { label: 'Founder', view: 'founder' },
    { label: 'Contact', view: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs">
      
      {/* Top Banner Notice with Official Contact */}
      <div className="bg-[#123F2B] text-emerald-100/90 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center text-[#E0B25B] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Tirunelveli District Real Estate
            </span>
            <span className="text-emerald-300/40">|</span>
            <span>Your Assets Adviser: Verified Plots, Villas & Commercial Properties</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href={`tel:${officialContactPhone.replace(/\s+/g, '')}`} 
              className="hover:text-white flex items-center gap-1.5 transition-colors font-medium"
            >
              <PhoneCall className="w-3 h-3 text-[#E0B25B]" /> {officialContactPhone}
            </a>

            <span className="text-emerald-300/40">|</span>

            <a
              href={officialWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E0B25B] hover:text-amber-300 flex items-center gap-1 font-semibold"
            >
              <MessageSquare className="w-3 h-3" /> WhatsApp Nellai Assets
            </a>

            <span className="text-emerald-300/40">|</span>

            {/* Test Persona Role Switcher */}
            <div className="relative">
              <button 
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="text-[#E0B25B] hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
                title="Switch active role for instant review"
              >
                <span>Role: <strong className="uppercase underline">{userProfile?.role || 'Guest'}</strong></span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 text-stone-800 border border-stone-200">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-stone-400 border-b border-stone-100">
                    Switch Test Account
                  </div>
                  {(['buyer', 'seller', 'agent', 'builder', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchMockRole(r);
                        setRoleSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-stone-50 flex items-center justify-between ${
                        userProfile?.role === r ? 'font-bold text-[#123F2B] bg-emerald-50' : 'text-stone-700'
                      }`}
                    >
                      <span className="capitalize">{r}</span>
                      {userProfile?.role === r && <span className="text-[#123F2B]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Brand Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="cursor-pointer transition-transform hover:opacity-95 shrink-0"
          >
            <NellaiAssetsLogo size="md" showTagline={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => onNavigate(link.view, link.param)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    isActive 
                      ? 'text-[#123F2B] bg-emerald-50 font-extrabold' 
                      : link.label === 'Founder'
                      ? 'text-[#B8892D] hover:bg-amber-50'
                      : 'text-stone-600 hover:text-[#123F2B] hover:bg-stone-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Side: Post Property CTA & Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Primary CTA: Post Property */}
            <button
              onClick={() => onNavigate('post-property')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#123F2B] hover:bg-[#1a553a] text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#E0B25B]" />
              <span>Post Property</span>
            </button>

            {/* Saved properties button */}
            {userProfile && (
              <button
                onClick={() => onNavigate('saved')}
                className={`p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-[#123F2B] hover:bg-stone-50 transition-colors relative cursor-pointer ${
                  activeView === 'saved' ? 'bg-stone-100 text-[#123F2B]' : ''
                }`}
                title="View Shortlisted Properties"
              >
                <Heart className="w-4 h-4" />
                {userProfile.savedProperties && userProfile.savedProperties.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B8892D] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {userProfile.savedProperties.length}
                  </span>
                )}
              </button>
            )}

            {/* Authentication States */}
            {userProfile ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pr-3 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors cursor-pointer bg-stone-50/50"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#123F2B] text-white flex items-center justify-center font-serif font-bold text-xs">
                    {userProfile.displayName ? userProfile.displayName.charAt(0) : 'U'}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-stone-800 line-clamp-1">{userProfile.displayName}</p>
                    <p className="text-[10px] text-stone-400 uppercase font-semibold">{userProfile.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 text-stone-800 border border-stone-200 animate-in fade-in duration-100">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900">{userProfile.displayName}</p>
                      <p className="text-[11px] text-stone-500 truncate">{userProfile.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {userProfile.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-stone-400" />
                      <span>{getDashboardLabel(userProfile.role)}</span>
                    </button>

                    {userProfile.role === 'admin' && (
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-amber-800 font-bold hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#B8892D]" />
                        <span>Nellai Assets CRM</span>
                      </button>
                    )}

                    <div className="border-t border-stone-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 text-xs font-bold text-stone-700 hover:text-[#123F2B] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-2 text-xs font-bold text-[#123F2B] border border-[#123F2B] hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            )}

          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => onNavigate('post-property')}
              className="p-2 rounded-xl bg-[#123F2B] text-white text-xs font-bold"
              title="Post Property"
            >
              <PlusCircle className="w-4 h-4 text-[#E0B25B]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:text-[#123F2B] hover:bg-stone-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          
          <div className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-bold text-[#18352A]">Contact Nellai Assets:</span>
            <a href={`tel:${officialContactPhone.replace(/\s+/g, '')}`} className="text-emerald-800 font-bold underline">
              {officialContactPhone}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => {
                  onNavigate(link.view, link.param);
                  setMobileMenuOpen(false);
                }}
                className={`p-3 text-left rounded-xl font-bold transition-colors ${
                  activeView === link.view ? 'bg-emerald-50 text-[#123F2B]' : 'text-stone-700 bg-stone-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
            <a
              href={officialWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp Nellai Assets
            </a>

            {userProfile ? (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-[#123F2B] text-white text-xs font-bold rounded-xl"
                >
                  My Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-xs text-red-600 font-bold"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-stone-700 bg-stone-100 rounded-xl"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-[#123F2B] border border-[#123F2B] rounded-xl"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
};
