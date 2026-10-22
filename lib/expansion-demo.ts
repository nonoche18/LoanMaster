import {calculate} from './domain';
import type {FinancialScenario} from './models';

/** Single fictional Northstar story shared across the workspace and AI demonstrations. */
export const expansionDemo={
 company:'Northstar Precision Works',industry:'Precision manufacturing',location:'New York',
 revenue2024:12000000,revenue2025:9840000,applicationDebt:1100000,scheduleDebt:1250000,
 annualCashFlow:780000,annualExistingPayments:360000,requestedAmount:2000000,
 purpose:'Equipment purchasing and expansion',period:'FY 2025',
};
export const revenueDecline=(expansionDemo.revenue2024-expansionDemo.revenue2025)/expansionDemo.revenue2024*100;
export const debtDifference=expansionDemo.scheduleDebt-expansionDemo.applicationDebt;
export type DemoLoanInputs={amount:number|null;rate:number|null;years:number|null};
export const originalInputs:DemoLoanInputs={amount:2000000,rate:8.5,years:7};
export const alternativeInputs:DemoLoanInputs={amount:2000000,rate:8.5,years:10};
export function analyzeExample(inputs:DemoLoanInputs,cashFlow:number|null=expansionDemo.annualCashFlow,debt:number|null=expansionDemo.annualExistingPayments){
 const {amount,rate,years}=inputs;
 if(amount===null||rate===null||years===null||cashFlow===null||debt===null)return {result:null,error:'Add an amount, rate, term, cash flow and existing payments to see a comparison.'};
 if(![amount,rate,years,cashFlow,debt].every(Number.isFinite)||amount<=0||rate<0||rate>40||years<1||years>30||!Number.isInteger(years)||cashFlow<0||debt<0)return {result:null,error:'Use a positive amount, a rate from 0–40%, a whole-year term from 1–30, and nonnegative financial inputs.'};
 const scenario:FinancialScenario={principal:amount,rate,years,cashFlow,existingDebt:debt,minDscr:1.25,maxDscr:1.5,paydown:0,annualDebtReduction:0};
 return {result:calculate(scenario),error:null};
}
