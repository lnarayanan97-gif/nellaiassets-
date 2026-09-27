export interface FounderData {
  name: string;
  role: string;
  title: string;
  organization: string;
  tagline: string;
  location: string;
  photoUrl: string;
  intro: string;
  bio: string[];
  mission: string;
  tirunelveliFocus: {
    heading: string;
    description: string;
    keyAreas: { name: string; advantage: string }[];
  };
  advisoryPillars: { title: string; desc: string }[];
  contactDetails: {
    officialPhone: string;
    officialWhatsapp: string;
    officialWhatsappUrl: string;
    officialEmail: string;
    officeAddress: string;
  };
}

export const FOUNDER_INFO: FounderData = {
  name: 'Sundar Rajan K',
  role: 'Founder — Nellai Assets',
  title: 'Your Assets Adviser',
  organization: 'Nellai Assets',
  tagline: 'Your Assets Adviser for Tirunelveli Real Estate',
  location: 'Tirunelveli District, Tamil Nadu, India',
  // Official uploaded portrait photograph of Sundar Rajan K
  photoUrl: `${import.meta.env.BASE_URL}assets/founder/sundar-rajan-k.jpeg`,
  intro: 'Helping buyers and property owners navigate the Tirunelveli real-estate market with local insight, property guidance and personalized assistance.',
  bio: [
    'Helping buyers and property owners navigate the Tirunelveli real-estate market with local insight, property guidance and personalized assistance.',
    'Nellai Assets was founded to serve as a trustworthy advisory bridge between buyers and property owners in Tirunelveli District. Our approach ensures buyers discover verified plots, villas, and lands, while property owners receive serious, pre-screened enquiries without public exposure of personal contact numbers.',
    'From Palayamkottai and Vannarpettai to Pettai, Maharajanagar, and expanding suburban corridors, our advisory focuses on clear revenue records, realistic ground valuations, and guided site inspections.'
  ],
  mission: 'To make property buying, selling, and advisory in Tirunelveli simple, transparent, and respectful of client privacy.',
  tirunelveliFocus: {
    heading: 'Dedicated to Tirunelveli District',
    description: 'Our advisory focuses on the distinct localities and expanding corridors of Tirunelveli District, ensuring buyers and sellers benefit from grounded local knowledge.',
    keyAreas: [
      {
        name: 'Palayamkottai',
        advantage: 'The educational hub of South India — established residential neighborhoods and high rental demand.'
      },
      {
        name: 'Vannarpettai & South Bypass',
        advantage: 'Prime commercial district with premier corporate showrooms and arterial road connectivity.'
      },
      {
        name: 'Pettai',
        advantage: 'Commercial and residential hub with long-standing business heritage and accessible plot layouts.'
      },
      {
        name: 'Maharajanagar',
        advantage: 'Well-planned residential colony known for broad avenues, parks, and quiet family living.'
      },
      {
        name: 'Thachanallur',
        advantage: 'Key transit corridor connecting Tirunelveli Junction with national highway routes.'
      },
      {
        name: 'Reddiyarpatti',
        advantage: 'Rapidly emerging residential sector with gated layouts and views of the Western Ghats.'
      },
      {
        name: 'Melapalayam & Suthamalli',
        advantage: 'Vibrant cultural centers and greenfield corridors with strong local community demand.'
      }
    ]
  },
  advisoryPillars: [
    {
      title: 'Complete Contact Privacy',
      desc: 'Neither buyer nor seller phone numbers are exposed publicly. All discovery and consultations are coordinated safely through Nellai Assets.'
    },
    {
      title: 'Local Market Insight',
      desc: 'Practical ground knowledge of Tirunelveli localities, guideline values, and property approvals.'
    },
    {
      title: 'Guided Visits & Assistance',
      desc: 'Personalized coordination for site inspections, seller meetings, and transparent discussions.'
    }
  ],
  contactDetails: {
    officialPhone: '+91 93603 90690',
    officialWhatsapp: '+91 93603 90690',
    officialWhatsappUrl: 'https://wa.me/919360390690',
    officialEmail: 'info@nellaiassets.com',
    officeAddress: 'Tirunelveli, Tamil Nadu, India'
  }
};
