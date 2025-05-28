 const {test, expect} = require('@playwright/test');



 //test.use({ browserName: 'webkit'});
 //This test case validates the error message displayed when an 
 // incorrect login is attempted on the practice login page.
 //It logs all network requests and responses to the console.
 //as well as the page title annd all the products on the page
 test('@Web Browser Context-Validating Error login', async ({browser})=>
 {
   
      const context = await browser.newContext();
      const page =  await context.newPage();
    // page.route('**/*.{jpg,png,jpeg}',route=> route.abort());
      const userName = page.locator('#username');
      const signIn = page.locator("#signInBtn");
      const cardTitles =  page.locator(".card-body a");
      //listening for requests from url and logs them to the console
      page.on('request',request=> console.log(request.url()));
      //listening to responses from url and logs them to the console
      page.on('response',response=> console.log(response.url(), response.status()));
      await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
      //prints to console the page tittle
      console.log(await page.title());
      //css 
     await userName.fill("rahulshetty");
     await page.locator("[type='password']").fill("learning");
     await signIn.click();
     //logs result of incorrect login attempt and resulting error message
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');
    //type - fill
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    console.log(await cardTitles.first().textContent());
   console.log(await cardTitles.nth(1).textContent());
   const allTitles = await cardTitles.allTextContents();
   //prints out all the products on the page
   console.log(allTitles);

 });
 
//this test case clicks everrything and asserts there is blinking text
 test('@Web UI Controls', async ({page})=>
 {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator('#username');
    const signIn = page.locator("#signInBtn");
    const documentLink = page.locator("[href*='documents-request']");
    const dropdown = page.locator("select.form-control");
    await dropdown.selectOption("consult");
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    console.log(await page.locator(".radiotextsty").last().isChecked());
    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    await page.locator("#terms").click();
    await page.pause();
    await expect( page.locator("#terms")).toBeChecked();
    await page.locator("#terms").uncheck();
    await page.pause();
    expect( await page.locator("#terms").isChecked()).toBeFalsy();
    await expect(documentLink).toHaveAttribute("class","blinkingText");
 });

 
//This test case demonstrates how to handle a child window or tab that opens after clicking a link.
//It locates a link that opens a new page ('documents-request').
// It uses `Promise.all` and `context.waitForEvent('page')` to wait for the new page
//  to open after clicking the link.
//It then interacts with the new page, retrieves the text content of an element with the class 'red',
// extracts a domain name from it, and logs it to the console.
// Finally, it fills the username field with the extracted domain name and logs the username
//  field's text content on the original page
 test.only('@Child windows hadl', async ({browser})=>
 {
    const context = await browser.newContext();
    const page =  await context.newPage();
    const userName = page.locator('#username');
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");

    const [newPage]=await Promise.all(
   [
      context.waitForEvent('page'),//listen for any new page pending,rejected,fulfilled
      documentLink.click(),
   
   ])//new page is opened
   
   await page.pause();
   const  text = await newPage.locator(".red").textContent();
    const arrayText = text.split("@")
    const domain =  arrayText[1].split(" ")[0]
    console.log(domain);
    await page.locator("#username").fill(domain);
    console.log(await page.locator("#username").textContent());




    
    





 })



 



