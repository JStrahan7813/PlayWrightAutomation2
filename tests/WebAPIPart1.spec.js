/*

Sets up an API Context and Utility: Imports Playwright modules and a custom APiUtils class
 for API interactions, defining payloads for login and order creation.
 Will create a token to login withiut UI and create an order
 This order will be created on API
 Then checked to make sure it shows up in UI
 page.pauses have been put in as it seems ton be flaky around about line 49
 Prints the token and order created details to console
**/

const {test, expect, request} = require('@playwright/test');
const {APiUtils} = require('../utils/APiUtils');
const loginPayLoad = {userEmail:"anshika@gmail.com",userPassword:"Iamking@000"};
const orderPayLoad = {orders:[{country:"Cuba",productOrderedId:"67a8dde5c0d3e6622a297cc8"}]};

/*
Authenticates and Creates an Order via API: Uses APiUtils in beforeAll to call a 
createOrder endpoint with login and order details, storing the response.
**/
let response;
test.beforeAll( async()=>
{
   const apiContext = await request.newContext();
   const apiUtils = new APiUtils(apiContext,loginPayLoad);
   response =  await apiUtils.createOrder(orderPayLoad);

})


//create order is success
/*
 The test then navigates to a client-side web application. To simulate a logged-in user without going
  through the UI login flow, it injects a script into the page before it loads. This script sets a 
  token in the browser's localStorage,
  using the token received from the API order creation response.

**/
test('@API Place the order', async ({page})=>
{ 
    page.addInitScript(value => {

        window.localStorage.setItem('token',value);
    }, response.token );
    /*
      Navigates to Order History and Finds Created Order: Clicks the 'myorders' button, waits for the table,
       then iterates rows to find the order ID from the API response.
    **/
 await page.pause();  
 await page.goto("https://rahulshettyacademy.com/client");
 await page.pause();
 await page.locator("button[routerlink*='myorders']").click();
 await page.locator("tbody").waitFor();
 const rows = await page.locator("tbody tr");


for(let i =0; i<await rows.count(); ++i)
{
   const rowOrderId =await rows.nth(i).locator("th").textContent();
   if (response.orderId.includes(rowOrderId))
   {
       await rows.nth(i).locator("button").first().click();
       break;
   }
}
/*
Verifies Order Details on the UI: Checks if the API-created order ID is in the UI's order history, 
clicks "View," and confirms the displayed details match the API response.
**/
const orderIdDetails =await page.locator(".col-text").textContent();
//await page.pause();
expect(response.orderId.includes(orderIdDetails)).toBeTruthy();

});

//Verify if order created is showing in history page
// Precondition - create order -