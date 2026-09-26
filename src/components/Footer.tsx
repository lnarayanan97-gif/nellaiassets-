import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Award,
  MessageSquare
} from 'lucide-react';
import { NellaiAssetsLogo } from './NellaiAssetsLogo';
import { FOUNDER_INFO } from '../data/founderData';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const officialPhone = '+91 93603 90690';
  const officialWhatsappUrl = 'https://wa.me/919360390690';

  return (
    <footer className="bg-[#123F2B] text-white pt-16 pb-12 border-t border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-5">
            <NellaiAssetsLogo size="lg" variant="white" showTagline={true} />
            
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-sm">
              Helping buyers and property owners navigate the Tirunelveli real-estate market with local insight, property guidance and personalized assistance.
            </p>

            {/* Official Contact Pill */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#E0B25B]">Public Enquiry:</span>
                <a href={`tel:${officialPhone.replace(/\s+/g, '')}`} className="text-white font-bold text-sm hover:text-[#E0B25B] transition-colors">
                  {officialPhone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E0B25B] shrink-0" />
                <span className="text-xs text-emerald-100/90">Tirunelveli, Tamil Nadu, India</span>
              </div>

              <a
                href={officialWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Nellai Assets</span>
              </a>
            </div>
          </div>

          {/* Column 2: Properties & Navigation */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#E0B25B]">
              Marketplace
            </h3>
            <ul className="space-y-2.5 text-xs text-emerald-100/70 font-medium">
              <li>
                <button onClick={() => onNavigate('browse', 'buy')} className="hover:text-white transition-colors cursor-pointer">
                  Buy Property
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('post-property')} className="hover:text-white transition-colors cursor-pointer">
                  Sell Property
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', 'plot')} className="hover:text-white transition-colors cursor-pointer">
                  Residential Plots
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', 'house')} className="hover:text-white transition-colors cursor-pointer">
                  Villas & Independent Houses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse', 'agriculture')} className="hover:text-white transition-colors cursor-pointer">
                  Farmland & Agro Assets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('projects')} className="hover:text-white transition-colors cursor-pointer">
                  Ongoing Projects
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Tirunelveli Localities */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#E0B25B]">
              Locations
            </h3>
            <ul className="space-y-2.5 text-xs text-emerald-100/70 font-medium">
              {['Palayamkottai', 'Pettai', 'Vannarpettai', 'Maharajanagar', 'Thachanallur', 'Reddiyarpatti'].map((loc) => (
                <li key={loc}>
                  <button 
                    onClick={() => onNavigate('browse', loc)} 
                    className="hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full text-left"
                  >
                    <span>{loc}</span>
                    <span className="text-[10px] text-emerald-300/40">Plots</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Advisory & Founder */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#E0B25B]">
              Advisory Desk
            </h3>
            
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-300">Founder & Adviser</span>
              <p className="font-bold text-white text-xs">{FOUNDER_INFO.name}</p>
              <p className="text-[11px] text-emerald-200/70">Founder — Nellai Assets</p>
              <button
                onClick={() => onNavigate('founder')}
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#E0B25B] hover:text-amber-300 underline cursor-pointer"
              >
                <span>View Founder Profile</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <ul className="space-y-2 text-xs text-emerald-100/70 font-medium pt-1">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Nellai Assets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact Advisory Desk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Contact Privacy Assurance */}
        <div className="pt-8 border-t border-emerald-900/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-100/60">
          <p>© {new Date().getFullYear()} Nellai Assets. Your Assets Adviser. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span className="flex items-center gap-1 text-[#E0B25B]">
              <ShieldCheck className="w-3.5 h-3.5" /> Tirunelveli District Focus
            </span>
            <span className="text-emerald-400/40">•</span>
            <span>Buyer & Seller Contact Privacy Protected</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
