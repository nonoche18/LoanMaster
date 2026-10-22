import {describe,expect,it} from 'vitest';
import {alternativeInputs,analyzeExample,debtDifference,expansionDemo,originalInputs,revenueDecline} from '../lib/expansion-demo';
import {sampleProfile} from '../lib/data';
describe('shared Northstar financing story',()=>{
 it('reconciles the example revenue decline and debt difference',()=>{expect(revenueDecline).toBe(18);expect(debtDifference).toBe(150000);expect(expansionDemo.scheduleDebt-expansionDemo.applicationDebt).toBe(150000);});
 it('models the original request with existing annual payments included',()=>{
  const r=analyzeExample(originalInputs).result!;
  expect(r.monthly).toBeCloseTo(31673.04,0);expect(r.dscr).toBeCloseTo(1.05389,3);
  expect(r.dscr).toBeCloseTo(780000/(360000+r.monthly*12),8);
 });
 it('shows the alternative tradeoff rather than equating smaller payments with lower total interest',()=>{
  const a=analyzeExample(originalInputs).result!,b=analyzeExample(alternativeInputs).result!;
  expect(b.monthly).toBeCloseTo(24797.14,0);expect(b.dscr).toBeCloseTo(1.1862,2);
  expect(b.monthly).toBeLessThan(a.monthly);expect(b.interest).toBeGreaterThan(a.interest);
  expect(originalInputs.amount!-alternativeInputs.amount!).toBe(0);
 });
 it('recalculates changes and handles zero interest, missing and invalid inputs',()=>{
  expect(analyzeExample({...originalInputs,amount:null}).result).toBeNull();
  expect(analyzeExample({...originalInputs,years:0}).error).toBeTruthy();
  expect(analyzeExample({...originalInputs,rate:-1}).result).toBeNull();
  expect(analyzeExample({...originalInputs,rate:0}).result!.interest).toBeCloseTo(0,5);
  expect(analyzeExample(originalInputs,500000).result!.dscr).toBeLessThan(1);
  expect(analyzeExample({...originalInputs,amount:1000000}).result!.monthly).toBeCloseTo(analyzeExample(originalInputs).result!.monthly/2,8);
 });
 it('uses the same company financials and request on every screen',()=>{
  analyzeExample({...originalInputs,amount:3000000},400000,100000);
  expect(sampleProfile.request.amount).toBe(2000000);expect(sampleProfile.revenue).toBe(9840000);expect(sampleProfile.cashFlow).toBe(780000);expect(sampleProfile.debtService).toBe(360000);
 });
});
