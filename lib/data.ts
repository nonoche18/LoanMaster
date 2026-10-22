import type {BankerProfile,BusinessProfile,DocumentRecord} from './models';
export const sampleProfile:BusinessProfile={company:'Northstar Precision Works',industry:'Manufacturing',location:'New York',years:14,revenue:12000000,relationship:'Existing client',currentBanker:'',collateral:'New CNC equipment; subject to valuation',period:'FY 2025',cashFlow:1200000,debtService:480000,cash:850000,request:{purpose:'Equipment',amount:750000,product:'Term loan',timing:'Within 3 months'}};
export const emptyProfile:BusinessProfile={company:'',industry:'',location:'',years:null,revenue:null,relationship:'Unknown',currentBanker:'',collateral:'',period:'',cashFlow:null,debtService:null,cash:null,request:{purpose:'Equipment',amount:null,product:'Term loan',timing:''}};
// Curated official-profile snapshot. Unknown revenue evidence remains null.
export interface BankerAdapter {list():BankerProfile[]}
export const publicBankerAdapter:BankerAdapter={list:()=>[
  {
    "role": "Business Banking Relationship Manager",
    "fictional": false,
    "location": "New York, NY",
    "states": [
      "New York"
    ],
    "address": "One Bryant Park, New York, NY 10036",
    "verified": "2026-10-21",
    "geographyBasis": "Published office state; not verified service territory",
    "id": "mohammed.habib",
    "name": "Mohammed Habib",
    "title": "Assistant Vice President",
    "phone": "917-838-2612",
    "industries": [
      "Emerging Growth Companies",
      "General industries",
      "Healthcare & Physician Practices",
      "Manufacturing",
      "Professional services",
      "Restaurant/Food Industry",
      "Technology Services"
    ],
    "revenue": [
      1000000,
      100000000
    ],
    "revenueLabel": "$1M\u2013$100M",
    "bio": "His official biography describes more than 15 years in banking, with commercial credit, cash management and international trade experience. Manufacturing is a listed industry; his published client revenue range is $1M\u2013$100M.",
    "source": "https://bankers.bankofamerica.com/mohammed.habib",
    "image": "https://bofagb.my-lightning.com/sfc/dist/version/renditionDownload?rendition=ORIGINAL_JPG&versionId=068Dn00000HRaMFIA1&operationContext=DELIVERY&contentId=069Dn00000HI7hqIAD&page=0&d=/a/Dn000000xOMh/_OyW62vF8WE.Usf211JzuE5sljoUxDPveh4vD5PlmIQ&oid=00DDn0000014WMFMA2&dpt=null&viewId=",
    "lendingEvidence": {
      "level": "commercial-credit",
      "summary": "Biography explicitly lists commercial credit experience; equipment-specific expertise is not stated."
    }
  },
  {
    "role": "Business Banking Relationship Manager",
    "fictional": false,
    "location": "New York, NY",
    "states": [
      "New York"
    ],
    "address": "One Bryant Park, New York, NY 10036",
    "verified": "2026-10-21",
    "geographyBasis": "Published office state; not verified service territory",
    "id": "muhammad.najieb",
    "name": "Muhammad Najieb",
    "title": "Assistant Vice President",
    "phone": "347-266-6975",
    "industries": [
      "Accounting and Law Firms",
      "Healthcare & Physician Practices",
      "Manufacturing",
      "Restaurant/Food Industry",
      "Technology Services"
    ],
    "revenue": [
      1000000,
      50000000
    ],
    "revenueLabel": "$1M\u2013$50M",
    "bio": "His official profile describes corporate banking, client management and strategic partnerships for businesses and institutions with $1M\u2013$50M revenue. Manufacturing is among his listed industries.",
    "source": "https://bankers.bankofamerica.com/muhammad.najieb",
    "image": "https://bofagb.my-lightning.com/sfc/dist/version/renditionDownload?rendition=ORIGINAL_JPG&versionId=068Dn00000ItJ2TIAV&operationContext=DELIVERY&contentId=069Dn00000HJeXJIA1&page=0&d=/a/Dn000000xPxe/zKY61BticXVhiUJ22BDncXtZR2AwGLzi3sW_v1jhYII&oid=00DDn0000014WMFMA2&dpt=null&viewId=",
    "lendingEvidence": {
      "level": "capital-access",
      "summary": "Biography describes capital access and corporate banking; equipment-specific or commercial-credit experience is not explicitly detailed."
    }
  },
  {
    "role": "Business Banking Relationship Manager",
    "fictional": false,
    "location": "New York, NY",
    "states": [
      "New York"
    ],
    "address": "One Bryant Park, New York, NY 10036",
    "verified": "2026-10-21",
    "geographyBasis": "Published office state; not verified service territory",
    "id": "edelmire.renelus",
    "name": "Edelmire Renelus",
    "title": "Vice President",
    "phone": "929-656-0618",
    "industries": [
      "Emerging Growth Companies",
      "General industries",
      "Not-for-profit"
    ],
    "revenue": [
      0,
      10000000
    ],
    "revenueLabel": "Startups\u2013$10M",
    "bio": "Her biography describes a portfolio spanning startups through businesses with up to $10M revenue, with treasury, credit and wealth-management collaboration. The $12M sample exceeds that published range; manufacturing is not a listed specialty.",
    "source": "https://bankers.bankofamerica.com/edelmire.renelus",
    "image": "https://bofagb.my-lightning.com/sfc/dist/version/renditionDownload?rendition=ORIGINAL_JPG&versionId=068Dn00000HPwp5IAD&operationContext=DELIVERY&contentId=069Dn00000HGb1pIAD&page=0&d=/a/Dn000000xNt6/vGihZ8soh58lbXxTg_4jyJRF6rwkC7LHYXlUhgsjSt8&oid=00DDn0000014WMFMA2&dpt=null&viewId=",
    "lendingEvidence": {
      "level": "credit-team",
      "summary": "Biography describes collaboration with credit teammates; direct product-specific lending experience is not stated."
    }
  }
]};
export const sampleDocuments:DocumentRecord[]=[
 {id:'financial',name:'northstar-fy2025-financials.txt',category:'Historical financial statements',period:'FY 2025',company:sampleProfile.company,version:1,status:'Reviewed',sample:true,selected:true},
 {id:'debt',name:'northstar-debt-schedule.txt',category:'Debt schedule',period:'FY 2025',company:sampleProfile.company,version:1,status:'Reviewed',sample:true,selected:true},
 {id:'interim',name:'northstar-interim-review.txt',category:'Interim P&L and balance sheet',period:'H1 2026',company:sampleProfile.company,version:1,status:'Needs review',sample:true,selected:false,fields:{cashFlow:1080000,source:'Sample interim review, line 6: FY 2025 comparative annual cash flow = $1,080,000; conflicts with FY 2025 statements.',confidence:'Sample only'}}
];
