import {expect,it} from 'vitest';
import {bankerSummary} from '../lib/banker-summary';
import {sampleProfile,publicBankerAdapter} from '../lib/data';
it('explains the request naturally without point scoring',()=>{
 const text=bankerSummary(sampleProfile,publicBankerAdapter.list()[0]).join(' ');
 expect(text).toContain('Northstar Precision Works');expect(text).toContain('$750,000');expect(text).toContain('equipment quote');expect(text).not.toMatch(/points|35\/35|explicitly listed/);
});
it('keeps revenue gaps and missing inputs honest',()=>{
 expect(bankerSummary(sampleProfile,publicBankerAdapter.list()[2]).join(' ')).toContain('outside the client range');
 expect(bankerSummary({...sampleProfile,revenue:null},publicBankerAdapter.list()[0]).join(' ')).toContain('add your industry and annual revenue');
});
it('adapts preparation guidance to working capital',()=>{
 const p={...sampleProfile,request:{...sampleProfile.request,purpose:'Working capital' as const}};
 expect(bankerSummary(p,publicBankerAdapter.list()[1]).join(' ')).toContain('when customers pay');
});
