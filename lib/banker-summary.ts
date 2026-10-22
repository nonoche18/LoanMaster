import type {BankerProfile,BusinessProfile} from './models';
import {money} from './domain';

/** Human-readable, source-grounded prototype copy; no live AI service is called. */
export function bankerSummary(p:BusinessProfile,b:BankerProfile):string[]{
 const company=p.company||'your business';
 const industryKnown=!!p.industry&&b.industries!==null;
 const industryFit=!!b.industries?.includes(p.industry);
 const revenueKnown=p.revenue!==null&&b.revenue!==null;
 const revenueFit=revenueKnown&&p.revenue!>=b.revenue![0]&&p.revenue!<=b.revenue![1];
 const locationFit=!!p.location&&!!b.states?.includes(p.location);
 const first=b.name.split(' ')[0];
 const strengths:Record<string,string>={
  'mohammed.habib':`${first} brings experience in commercial credit, cash management and international trade. For a business considering a new loan, that background makes him a useful person to talk with about how borrowing would fit alongside day-to-day cash needs.`,
  'muhammad.najieb':`${first} describes a background in corporate banking and helping businesses access capital. His focus on understanding a company’s priorities offers a useful starting point for a conversation about what you want the financing to achieve and which options are worth exploring.`,
  'edelmire.renelus':`${first} works with businesses from their startup stage through growth and describes working closely with credit and treasury colleagues. That collaborative approach could be useful when you need help understanding which questions to ask and who should be involved in your financing conversation.`
 };
 const fit=industryKnown&&revenueKnown
  ? industryFit&&revenueFit
   ? `${company} has a clear reason to start a conversation with ${first}: ${p.industry.toLowerCase()} is part of the experience described on the profile, and your ${money(p.revenue)} in annual revenue falls within the published client range.`
   : `${first} may still be worth a conversation, but there are a few things to confirm for ${company}. ${!revenueFit?`Your ${money(p.revenue)} in annual revenue sits outside the client range described on the profile. `:''}${!industryFit?`The profile does not specifically describe work with ${p.industry.toLowerCase()} businesses, so ask about experience with companies like yours.`:''}`
  : `Before deciding how well ${first} fits ${company}, add your industry and annual revenue. Those details help connect the banker’s background to the needs of your business.`;
 const location=locationFit?` With an office in ${b.location}, there is also a local connection to explore; confirm that the banker serves your area.`:'';
 const request=p.request.amount===null?'your planned financing':`your ${money(p.request.amount)} financing request`;
 const next=p.request.purpose==='Equipment'
  ? `To make the first conversation useful, bring the equipment quote, a short explanation of what the purchase will help your business do, recent financial statements and a list of existing loan payments. Ask how ${request} could be structured, what repayments might look like and what information the bank would need next.`
  : `To make the first conversation useful, bring recent financial statements, your existing debt payments and a simple picture of when customers pay you and when your own bills fall due. Explain what ${request} needs to cover, then ask which structure fits that timing and what information the bank would need next.`;
 return [fit+location,strengths[b.id]??`${first} can be a starting point for discussing your financing plans. Review the official profile together with your company’s needs.`,next+' This is a starting point for preparation; the banker will need to confirm the product fit and application requirements.'];
}
