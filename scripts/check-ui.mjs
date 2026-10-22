import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:3000');
await page.getByRole('heading',{name:'Good plans start with a clear picture.'}).waitFor();
await page.screenshot({path:'docs/screenshots/01-overview.png',fullPage:true});
await page.getByRole('button',{name:'Business Profile',exact:true}).click();
for(let i=0;i<4;i++){await page.screenshot({path:`docs/screenshots/02-onboarding-${i+1}.png`,fullPage:true});if(i<3)await page.getByRole('button',{name:'Continue',exact:true}).click();}
await page.getByRole('button',{name:'Confirm & explore bankers'}).click();
await page.getByRole('checkbox',{name:'Compare',exact:true}).nth(0).check();
await page.getByRole('checkbox',{name:'Compare',exact:true}).nth(1).check();
await page.getByRole('button',{name:'Why this banker'}).first().click();
await page.screenshot({path:'docs/screenshots/03-banker-comparison.png',fullPage:true});
await page.getByRole('button',{name:'Loan Readiness',exact:true}).click();
await page.getByLabel('Scenario amount ($)',{exact:true}).fill('600000');
await page.screenshot({path:'docs/screenshots/04-loan-readiness.png',fullPage:true});
await page.getByRole('button',{name:'Documents & Hand-off',exact:true}).click();
await page.getByRole('button',{name:'Review hand-off',exact:true}).click();
await page.getByRole('checkbox',{name:'I reviewed the contents, assumptions and open questions'}).check();
await page.screenshot({path:'docs/screenshots/05-handoff-review.png',fullPage:true});
const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'PDF',exact:true}).click();const download=await downloadPromise;await download.saveAs('docs/screenshots/sample-handoff.pdf');
await page.setViewportSize({width:390,height:844});
for(const name of ['Overview','Business Profile','Banker Match','Loan Readiness','Documents & Hand-off']){await page.getByRole('button',{name,exact:true}).click();const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);if(overflow)errors.push(`Mobile overflow: ${name}`);await page.screenshot({path:`docs/screenshots/mobile-${name.split(' ')[0].toLowerCase()}.png`,fullPage:true});}
await browser.close();console.log(JSON.stringify({errors,screenshots:'docs/screenshots',pdfExport:true}));if(errors.length)process.exitCode=1;
