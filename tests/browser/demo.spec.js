import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const paths=['/','/about','/services','/pricing','/blog','/faq','/contact','/register','/appointment','/gallery','/community','/conferences','/privacy-policy','/terms','/login','/signup','/forgot-password','/reset-password','/experience','/trust'];
for (const route of paths) test(`route ${route}: no external traffic, no active intake`,async({page})=>{
 const requests=[],errors=[];
 page.on('request',r=>{if(!r.url().startsWith('data:') && !r.url().startsWith('blob:') && new URL(r.url()).origin!==new URL(test.info().project.use.baseURL).origin)requests.push(r.url());});
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(route); await expect(page.getByRole('main')).toBeVisible();
 await expect(page.getByLabel('Demonstration notice')).toBeVisible();
 await page.waitForTimeout(1100);
 expect(errors).toEqual([]);expect(requests).toEqual([]);
 expect(await page.locator('form').count()).toBe(0);
 expect(await page.locator('input:enabled,textarea:enabled').count()).toBe(0);
});
test('patient workflow: deny role, hold, erase, reset and export',async({page})=>{
 await page.goto('/experience');await expect(page.getByRole('heading',{name:'Explore a safer patient journey'})).toBeVisible();
 await page.getByRole('button',{name:'Request sample erasure'}).click();await expect(page.getByRole('status')).toContainText('Erasure deferred');
 await page.getByLabel('View as').selectOption('receptionist');
 await page.getByRole('button',{name:'Export sample FHIR JSON'}).click();await expect(page.getByRole('status')).toContainText('Access denied');
 await page.getByLabel('View as').selectOption('admin');await page.getByRole('button',{name:'Toggle sample legal hold'}).click();
 await page.getByLabel('View as').selectOption('patient');await page.getByRole('button',{name:'Request sample erasure'}).click();
 await expect(page.getByRole('status')).toContainText('erased');
 await page.getByRole('button',{name:'Reset demonstration'}).click();
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export sample FHIR JSON'}).click();
 const download=await downloadPromise;expect(download.suggestedFilename()).toBe('synthetic-patient.fhir.json');
 expect(await page.evaluate(()=>Object.keys(localStorage))).not.toContain('eds-appointments');
 await page.reload();await expect(page.getByText('Legal hold:')).toContainText('Active');
});
for(const route of ['/experience','/trust']) test(`${route}: accessible new content and responsive layout`,async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(route);await page.waitForTimeout(1100);
 const results=await new AxeBuilder({page}).include('#main-content').analyze();expect(results.violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
});
test('protected routes do not open a clinical portal',async({page})=>{
 await page.goto('/admin');await expect(page).toHaveURL(/\/login$/);
 await page.goto('/dashboard');await expect(page).toHaveURL(/\/login$/);
});
