 const {test, expect} = require('@playwright/test');
 const {customtest} = require('../utils/test-base');

 const {POManager} = require('../pageobjects/POManager');
 //Json->string->js object
 //brings in json
 const dataset =  JSON.parse(JSON.stringify(require("../utils/placeorderTestData.json")));

/* * 2. Scalable Framework (second script):
 *    - Implements Page Object Model (POM) using a POManager for better modularity.
 *    - Supports data-driven testing via external JSON.
 *    - Designed for long-term maintenance, code reuse, and parallel test execution - which playwright does via the config file
 *
 * Both approaches validate the same core functionality (login, add to cart, checkout),
 * but differ in structure. The simpler version is easier to read, while the POM-based
 * version is more scalable and maintainable for large test suites.
 */
 
for(const data of dataset)
{
 test(`@Webs Client App login for ${data.productName}`, async ({page})=>
 {
   const poManager = new POManager(page);
    //js file- Login js, DashboardPage
     const products = page.locator(".card-body");
     const loginPage = poManager.getLoginPage();
     await loginPage.goTo();
     //data driven testing vis external json
     await loginPage.validLogin(data.username,data.password);
     const dashboardPage = poManager.getDashboardPage();
     await dashboardPage.searchProductAddCart(data.productName);
     await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(data.productName);
    await cartPage.Checkout();

    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind","India");
    const orderId = await ordersReviewPage.SubmitAndGetOrderId();
   console.log(orderId);
   await dashboardPage.navigateToOrders();
   const ordersHistoryPage = poManager.getOrdersHistoryPage();
   await ordersHistoryPage.searchOrderAndSelect(orderId);
   expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();






    
 });
}

 customtest(`Client App login`, async ({page,testDataForOrder})=>
 {
   const poManager = new POManager(page);
    //js file- Login js, DashboardPage
     const products = page.locator(".card-body");
     const loginPage = poManager.getLoginPage();
     await loginPage.goTo();
     await loginPage.validLogin(testDataForOrder.username,testDataForOrder.password);
     const dashboardPage = poManager.getDashboardPage();
     await dashboardPage.searchProductAddCart(testDataForOrder.productName);
     await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(testDataForOrder.productName);
    await cartPage.Checkout();


})
//test files will trigger parallel
//individual tests in the file will run in sequence
 

 



 

