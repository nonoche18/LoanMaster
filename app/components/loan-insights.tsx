'use client';
import {useState} from 'react';
import type {BusinessProfile,FinancialScenario} from '@/lib/models';
import {scenarioFrom} from '@/lib/domain';
import {ArrowDownRight,ArrowRight,RotateCcw} from 'lucide-react';
import {alternativeInputs,analyzeExample,type DemoLoanInputs} from '@/lib/expansion-demo';
import {money} from '@/lib/domain';
import styles from './ai-features.module.css';

function Scenario({label,inputs,setInputs,alternative,cashFlow,debt}:{label:string;inputs:DemoLoanInputs;setInputs:(v:DemoLoanInputs)=>void;alternative?:boolean;cashFlow:number|null;debt:number|null}){
 const {result,error}=analyzeExample(inputs,cashFlow,debt);
 const field=(key:keyof DemoLoanInputs,value:string)=>setInputs({...inputs,[key]:value===''?null:Number(value)});
 return <article className={`${styles.scenario} ${alternative?styles.alternative:''}`}><div className={styles.scenarioHeading}><h4>{label}</h4><span>{alternative?'Longer repayment term':'Requested financing'}</span></div><div className={styles.scenarioFields}><label>Loan amount ($)<input aria-label={`${label} loan amount`} type="number" min="1" step="50000" value={inputs.amount??''} onChange={e=>field('amount',e.target.value)}/></label><label>Annual rate (%)<input aria-label={`${label} annual rate`} type="number" min="0" max="40" step="0.25" value={inputs.rate??''} onChange={e=>field('rate',e.target.value)}/></label><label>Term (years)<input aria-label={`${label} term`} type="number" min="1" max="30" step="1" value={inputs.years??''} onChange={e=>field('years',e.target.value)}/></label></div><div className={styles.numbers}><div><span>Monthly payment</span><strong>{money(result?.monthly)}</strong></div><div><span>Illustrative DSCR</span><strong>{result?.dscr==null?'—':`${result.dscr.toFixed(2)}×`}</strong></div><div><span>Total interest</span><strong>{money(result?.interest)}</strong></div></div>{error&&<p className={styles.error} role="status">{error}</p>}</article>;
}
export default function LoanInsights({profile,scenario,onScenarioChange}:{profile:BusinessProfile;scenario:FinancialScenario;onScenarioChange:(v:FinancialScenario)=>void}){
 const [alternative,setAlternative]=useState(alternativeInputs),[adjust,setAdjust]=useState(false);
 const a:DemoLoanInputs={amount:scenario.principal,rate:scenario.rate,years:scenario.years};
 const b:DemoLoanInputs={...alternative,amount:scenario.principal};
 const cashFlow=scenario.cashFlow,debt=scenario.existingDebt;
 const setA=(v:DemoLoanInputs)=>onScenarioChange({...scenario,principal:v.amount,rate:v.rate??0,years:v.years??0});
 const setB=(v:DemoLoanInputs)=>{setAlternative(v);if(v.amount!==scenario.principal)onScenarioChange({...scenario,principal:v.amount});};
 const setCashFlow=(v:number|null)=>onScenarioChange({...scenario,cashFlow:v});
 const setDebt=(v:number|null)=>onScenarioChange({...scenario,existingDebt:v});
 const ar=analyzeExample(a,cashFlow,debt).result,br=analyzeExample(b,cashFlow,debt).result;
 const savings=ar&&br?ar.monthly-br.monthly:null,fundingDifference=a.amount!==null&&b.amount!==null?a.amount-b.amount:null;
 const originalCushion=ar&&cashFlow!==null&&debt!==null?cashFlow-debt-ar.annual:null;
 const reset=()=>{onScenarioChange(scenarioFrom(profile));setAlternative(alternativeInputs);};
 return <section id="ai-loan-demo" className={styles.panel} aria-labelledby="loan-insights-heading">
  <div className={styles.header}><div><p className={styles.eyebrow}>NORTHSTAR’S LOAN ANALYSIS</p><h2 className={styles.title} id="loan-insights-heading">AI Loan Insights</h2><p className={styles.subtitle}>Understand how your loan could affect your business and explore options worth discussing with your banker.</p></div><span className={styles.badge}>Simulated AI · calculated scenarios</span></div>
  <div className={styles.context}><div><strong>{profile.company||'Your business'} · {money(profile.request.amount)} financing request</strong><p>{profile.location} · {profile.industry} · equipment purchasing and expansion. Compare two repayment terms for the same requested amount.</p></div><div className={styles.contextAmount}><strong>{money(cashFlow)} available cash flow</strong><p>Annual amount before existing and new debt payments</p></div></div>
  <div className={styles.insights}>
   <article className={styles.insight}><h4>Your current debt affects your flexibility</h4><p>{profile.company||'Your business'} already pays {money(debt)} a year toward debt. A new loan adds to the cash needed for repayments.</p><p><strong>Try this:</strong> Compare repayment terms for the same loan amount to see how payments change.</p></article>
   <article className={styles.insight}><h4>Check your repayment cushion</h4><p>{originalCushion===null?'Add valid scenario inputs to see what remains after debt payments.':originalCushion>=0?`Scenario A leaves about ${money(originalCushion)} a year after modeled debt payments. That is the cushion for changes in this cash-flow estimate.`:`Scenario A exceeds the available annual cash flow by ${money(-originalCushion)}. Repayments would need more cash than modeled.`}</p><p><strong>Try this:</strong> Leave room for unexpected changes; review your cash-flow assumptions with your banker.</p></article>
   <article className={styles.insight}><h4>Equipment financing may be worth exploring</h4><p>The investment includes machinery. Ask whether equipment financing and separate expansion funding suit the plan.</p><p><strong>Ask your banker:</strong> How would collateral, terms and payment timing differ?</p></article>
  </div>
  <div className={styles.sectionLabel}><h3>Same {money(a.amount)} loan, two repayment terms</h3><button className={styles.link} onClick={reset}><RotateCcw size={11}/> Reset to company profile</button></div>
  <div className={styles.scenarioGrid}><Scenario label="Scenario A" inputs={a} setInputs={setA} cashFlow={cashFlow} debt={debt}/><Scenario label="Scenario B" inputs={b} setInputs={setB} cashFlow={cashFlow} debt={debt} alternative/></div>
  <div className={styles.comparison}><ArrowDownRight size={20}/><div><h4>How the alternative changes the picture</h4><p>{savings===null||fundingDifference===null?'Complete both scenarios to compare repayment terms, payments and interest.':`${savings>0?`Scenario B reduces the estimated monthly payment by ${money(savings)}`:savings<0?`Scenario B increases the estimated monthly payment by ${money(-savings)}`:'The two scenarios have the same estimated monthly payment'}${fundingDifference>0?`, while providing ${money(fundingDifference)} less funding`:fundingDifference<0?`, while providing ${money(-fundingDifference)} more funding`:`, with the same funding amount`}. ${ar&&br?(br.interest>ar.interest?`It also adds about ${money(br.interest-ar.interest)} in total interest.`:br.interest<ar.interest?`Its total interest is about ${money(ar.interest-br.interest)} lower.`:'Total interest is the same.') :''} A longer term can increase total interest. Confirm pricing, product terms and eligibility with BofA.`}</p></div></div>
  <div className={styles.sectionLabel}><span className={styles.scenarioLegend}>DSCR = annual cash available ÷ (existing annual payments + 12 new monthly payments).</span><button className={styles.link} onClick={()=>setAdjust(!adjust)} aria-expanded={adjust}>{adjust?'Hide':'Adjust'} scenario cash-flow inputs</button></div>
  {adjust&&<div className={styles.assumptions}><label>Annual cash available ($)<input className={styles.inlineInput} aria-label="Example annual cash available" type="number" min="0" value={cashFlow??''} onChange={e=>setCashFlow(e.target.value===''?null:Number(e.target.value))}/></label><label>Existing annual payments ($)<input className={styles.inlineInput} aria-label="Example existing annual payments" type="number" min="0" value={debt??''} onChange={e=>setDebt(e.target.value===''?null:Number(e.target.value))}/></label></div>}
  <div className={styles.footerLink}><p className={styles.note}>Illustrative terms, monthly amortization, no fees or taxes. Example cash flow is after operating needs, before debt payments. Not a bank offer.</p><a href="#existing-loan-calculator">Continue in the loan calculator <ArrowRight size={11}/></a></div>
 </section>;
}
