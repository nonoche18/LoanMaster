import {describe,it,expect} from 'vitest';
import {payment,calculate,capacity,match,scenarioFrom,buildPackage,packageIsStale} from '../lib/domain';
import {sampleProfile,sampleDocuments,publicBankerAdapter} from '../lib/data';
describe('frontend scenario math',()=>{
 it('amortizes a sample and handles zero interest',()=>{expect(payment(750000,8,5)).toBeCloseTo(15207.2957,2);expect(payment(12000,0,1)).toBe(1000);});
 it('includes existing debt and handles unknowns and zero debt',()=>{const s=scenarioFrom(sampleProfile);expect(calculate(s)!.dscr).toBeCloseTo(780000/(360000+payment(2000000,8.5,7)*12));expect(calculate({...s,cashFlow:null})).toBeNull();expect(calculate({...s,principal:0,existingDebt:0})!.dscr).toBeNull();expect(capacity(100,1000,8,5,1.25)).toBe(0);});
 it('withholds ranking for missing evidence',()=>{const bs=publicBankerAdapter.list();expect(match(sampleProfile,bs[0]).score).toBe(90);const missing={...bs[0],revenue:null};expect(match(sampleProfile,missing).score).toBeNull();expect(match(sampleProfile,missing).coverage).toBe(75);expect(match({...sampleProfile,location:'Michigan'},bs[0]).score).toBe(75);});
 it('marks changed packages stale',()=>{const s=scenarioFrom(sampleProfile),b=match(sampleProfile,publicBankerAdapter.list()[0]);const pack=buildPackage(sampleProfile,sampleDocuments,s,b,'mohammed.habib');expect(packageIsStale(pack,sampleProfile,sampleDocuments,s,'mohammed.habib')).toBe(false);expect(packageIsStale(pack,{...sampleProfile,revenue:2000000},sampleDocuments,s,'mohammed.habib')).toBe(true);});
});

describe('real New York banker snapshot',()=>{
 it('uses financing-specific evidence without fabricated precision',()=>{
  const scores=publicBankerAdapter.list().map(b=>match(sampleProfile,b));
  expect(scores.map(s=>s.score)).toEqual([90,85,45]);
  expect(scores.every(s=>s.coverage===100)).toBe(true);
  expect(scores.every(s=>s.banker.source.startsWith('https://bankers.bankofamerica.com/'))).toBe(true);
 });
 it('recomputes the revenue match for a $60m company',()=>{
  const p={...sampleProfile,revenue:60000000};
  expect(publicBankerAdapter.list().slice(0,2).map(b=>match(p,b).score)).toEqual([90,60]);
 });
});
