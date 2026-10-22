import type {BankerProfile,BusinessProfile,DocumentRecord,Evidence,FinancialScenario,HandoffPackage,LoanResult,MatchResult,ReadinessFinding} from './models';
export const money=(n:number|null|undefined)=>n==null?'Not yet known':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
export function payment(principal:number, rate:number, years:number):number {
 if (![principal,rate,years].every(Number.isFinite)||principal<0||rate<0||years<=0) throw new Error('Use a nonnegative principal/rate and positive term.');
 const n=years*12,r=rate/1200;
 return r===0?principal/n:principal*r/(-Math.expm1(-n*Math.log1p(r)));
}
export function calculate(s:FinancialScenario):LoanResult|null {
 if(s.principal==null||s.cashFlow==null||s.existingDebt==null)return null;
 if(s.existingDebt<0||s.cashFlow<0)throw new Error('Financial amounts must be nonnegative.');
 const monthly=payment(s.principal,s.rate,s.years),annual=monthly*12,total=monthly*s.years*12;
 const denominator=s.existingDebt+annual;
 return {monthly,annual,total,interest:total-s.principal,dscr:denominator>0?s.cashFlow/denominator:null};
}
export function capacity(cashFlow:number|null,debt:number|null,rate:number,years:number,dscr:number):number|null {
 if(cashFlow==null||debt==null)return null;
 if(!Number.isFinite(dscr)||dscr<=0||cashFlow<0||debt<0)throw new Error('Coverage must be positive; cash flow and debt cannot be negative.');
 const budget=Math.max(0,cashFlow/dscr-debt)/12;
 return budget/payment(1,rate,years);
}
export function capacityRange(s:FinancialScenario){const low=capacity(s.cashFlow,s.existingDebt,s.rate,s.years,s.maxDscr),high=capacity(s.cashFlow,s.existingDebt,s.rate,s.years,s.minDscr);return low==null||high==null?null:{low,high};}
export function match(p:BusinessProfile,b:BankerProfile):MatchResult {
 const knownIndustry=!!p.industry&&b.industries!==null,knownGeo=!!p.location&&b.states!==null,knownRevenue=p.revenue!==null&&b.revenue!==null;
 const industryMatch=!!b.industries?.includes(p.industry),geoMatch=!!b.states?.includes(p.location),revenueMatch=knownRevenue&&p.revenue!>=b.revenue![0]&&p.revenue!<=b.revenue![1];
 // Team-designed evidence rubric. Partial credit measures specificity, not banker ability.
 const lendingFraction=b.lendingEvidence?({'commercial-credit':.75,'capital-access':.5,'credit-team':.25}[b.lendingEvidence.level]):0;
 const rows:[Evidence['criterion'],boolean,boolean,number,number,string][]=[
 ['industry',knownIndustry,industryMatch,35,industryMatch?35:0,knownIndustry?`${p.industry}: ${industryMatch?'explicitly listed':'not listed; absence is not proof of no experience'}`:'Industry evidence unavailable'],
 ['geography',knownGeo,geoMatch,20,geoMatch?15:0,knownGeo?`${p.location}: ${geoMatch?'same':'different'} published office state. Same-state office earns 15/20; service territory is not confirmed.`:'Office location evidence unavailable'],
 ['revenue',knownRevenue,revenueMatch,25,revenueMatch?25:0,knownRevenue?`${money(p.revenue)} compared with published ${b.revenueLabel??`${money(b.revenue![0])}–${money(b.revenue![1])}`}; ${revenueMatch?'inside':'outside'} range.`:'Revenue coverage unknown'],
 ['financing',!!b.lendingEvidence,!!b.lendingEvidence,20,20*lendingFraction,`For ${p.request.purpose.toLowerCase()} / ${p.request.product.toLowerCase()}: ${b.lendingEvidence?.summary??'Lending evidence unavailable'} No exact product expertise is verified.`]
 ];
 const evidence=rows.map(([criterion,known,matches,weight,points,explanation])=>({criterion,known,matches,weight,points:known?points:0,explanation,source:b.source,verified:b.verified}));
 const coverage=evidence.filter(e=>e.known).reduce((a,e)=>a+e.weight,0);
 return {banker:b,coverage,score:coverage===100?evidence.reduce((a,e)=>a+e.points,0):null,evidence};
}

export function checklist(p:BusinessProfile):string[]{return ['Historical tax returns','Historical financial statements','Interim P&L and balance sheet','Debt schedule','Projections and use of funds','Entity information',...(p.request.purpose==='Equipment'?['Equipment quote and collateral']:['Receivables/payables aging']),...(p.request.product==='Revolving credit'&&p.request.purpose!=='Working capital'?['Receivables/payables aging']:[])];}
export function documentFlags(d:DocumentRecord,docs:DocumentRecord[],p:BusinessProfile):string[]{
 const flags:string[]=[];
 if(!d.period)flags.push('Missing reporting period');
 if(d.company!==p.company)flags.push('Company differs from profile');
 if(d.period&&/^(Interim|Debt|Receivables|Projections)/.test(d.category)&&d.period!==p.period)flags.push('Period differs from current profile; confirm freshness');
 if(docs.some(x=>x.id!==d.id&&x.category===d.category&&x.period===d.period))flags.push('Duplicate category and period');
 if(d.fields&&d.fields.cashFlow!==p.cashFlow)flags.push('Cash flow differs from profile');
 return flags;
}
export function completeness(p:BusinessProfile,docs:DocumentRecord[]){
 const business=[p.company,p.industry,p.location,p.years,p.revenue,p.request.amount,p.request.timing,p.collateral,p.relationship];
 const financial=[p.period,p.cashFlow,p.debtService,p.cash];
 const present=(v:unknown)=>v!==null&&v!=='';
 const required=checklist(p);
 return {profile:Math.round(business.filter(present).length/business.length*100),financial:Math.round(financial.filter(present).length/financial.length*100),documents:Math.round(required.filter(c=>docs.some(d=>d.category===c&&d.status==='Reviewed'&&documentFlags(d,docs,p).length===0)).length/required.length*100)};
}
export function findings(p:BusinessProfile,docs:DocumentRecord[]):ReadinessFinding[]{
 const rows:ReadinessFinding[]=[];
 if([p.cashFlow,p.debtService,p.cash].some(x=>x===null)||!p.period)rows.push({id:'financial',severity:'action',title:'Complete your financial picture',reason:'Cash flow, debt service, liquidity and a reporting period make the scenario interpretable.',page:'Business Profile'});
 if(!p.company||!p.industry||!p.location||p.revenue===null||p.request.amount===null)rows.push({id:'profile',severity:'action',title:'Finish your business profile',reason:'Missing business or request details limit matching and preparation.',page:'Business Profile'});
 docs.forEach(d=>{const flags=documentFlags(d,docs,p);if(flags.length)rows.push({id:d.id,severity:'review',title:`Review ${d.name}`,reason:flags.join(' · '),page:'Documents & Hand-off'});});
 const missing=checklist(p).filter(c=>!docs.some(d=>d.category===c&&d.status==='Reviewed'&&documentFlags(d,docs,p).length===0));
 if(missing.length)rows.push({id:'docs',severity:'action',title:`Prepare ${missing.length} document categories`,reason:`Next: ${missing.slice(0,2).join(' and ')}. Confirm periods and requirements with your banker.`,page:'Documents & Hand-off'});
 if(p.request.product==='Revolving credit')rows.push({id:'revolver',severity:'info',title:'Discuss a revolving-credit structure',reason:'Term-loan math does not model draw patterns, fees or revolving availability. Ask your banker for a separate facility analysis.',page:'Loan Readiness'});
 rows.push({id:'conversation',severity:'info',title:'Clarify assumptions with your banker',reason:'Discuss use of funds, collateral, debt schedule and the cash-flow definition before a formal application.',page:'Banker Match'});
 return rows;
}
export const scenarioFrom=(p:BusinessProfile):FinancialScenario=>({principal:p.request.amount,rate:8,years:5,cashFlow:p.cashFlow,existingDebt:p.debtService,minDscr:1.25,maxDscr:1.5,paydown:0,annualDebtReduction:0});
export function fingerprint(p:BusinessProfile,d:DocumentRecord[],s:FinancialScenario,banker:string|null){return JSON.stringify({p,d,s,banker});}
export function packageIsStale(pack:HandoffPackage|null,p:BusinessProfile,d:DocumentRecord[],s:FinancialScenario,banker:string|null){return !!pack&&pack.fingerprint!==fingerprint(p,d,s,banker);}
export function reviewDocument(d:DocumentRecord,p:BusinessProfile,apply:boolean){return {document:{...d,status:'Reviewed' as const},profile:apply&&d.fields?{...p,cashFlow:d.fields.cashFlow}:p};}
export function buildPackage(p:BusinessProfile,d:DocumentRecord[],s:FinancialScenario,b:MatchResult|null,selection:string|null):HandoffPackage {
 const selected=d.filter(x=>x.selected&&x.status==='Reviewed');
 const existingBanker=selection==='existing'?(p.currentBanker||'Existing relationship manager'):null;
 return {version:1,generatedAt:new Date().toISOString(),fingerprint:fingerprint(p,d,s,selection),profile:p,banker:b,existingBanker,scenario:s,calculations:p.request.product==='Term loan'?calculate(s):null,capacity:p.request.product==='Term loan'?capacityRange(s):null,liquidity:p.cash==null?null:p.cash-s.paydown,assumptions:['Fictional company; real publicly sourced banker profiles. Prepared for hand-off, never submitted to BofA.','Sample annual interest rate; no bank pricing or credit offer.','Monthly amortization, no fees or taxes; coverage assumptions are team-selected, not bank policy.','Financial inputs must use the same annual reporting period. Documents and open questions require banker confirmation.'],findings:findings(p,d),documents:selected,message:`Hello ${existingBanker||b?.banker.name||'relationship manager'},\nI would like to discuss ${money(p.request.amount)} for ${p.request.purpose.toLowerCase()} at ${p.company||'our company'}. We have prepared our business profile, illustrative scenarios and a reviewed document manifest. Please help confirm the appropriate structure, assumptions and remaining requirements. This is a draft and has not been sent.`};
}
