/**
 * This Playwright test script performs the following actions:
 * 1. Imports the 'test' and 'expect' functions from the '@playwright/test' module,
 * which are essential for defining and making assertions in Playwright tests.
 * 2. Defines a test case named '@QW Security test request intercept' using the 'test' function.
 * This test case is asynchronous, indicated by the 'async' keyword. It receives a 'page' fixture
 * provided by Playwright, which represents a browser page.
 * 3. Navigates the browser page to the specified URL: "https://rahulshettyacademy.com/client".
 * 4. Locates the element with the CSS selector "#userEmail" (likely an email input field) and fills it
 * with the value "anshika@gmail.com".
 * 5. Locates the element with the CSS selector "#userPassword" (likely a password input field) and fills it
 * with the value "Iamking@000".
 * 6. Locates the element with the CSS selector "[value='Login']" (likely a login button) and clicks it.
 * 7. Waits until the network is idle, meaning all network requests have completed, ensuring the page has fully loaded
 * after the login action.
 * 8. Locates the first element with the CSS selector ".card-body b" (likely a bold text element within a card body)
 * and waits for it to be present on the page, further ensuring the login was successful and content is loaded.
 * 9. Locates a button that contains the text 'myorders' using a CSS selector with a routerlink attribute containing 'myorders',
 * and then clicks this button, likely navigating to the user's order history page.
 * 10. Intercepts network requests matching the URL "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*"
 * using 'page.route'. For any matching request, it calls the 'route.continue' method but modifies the URL
 * to "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6".
 * This effectively redirects the request for any order details to a specific order ID.
 * 11. Locates the first button that has the text 'View' and clicks it, likely attempting to view the details of an order.
 * 12. Asserts that the last paragraph element on the page (located using "p").last()) has the text
 * "You are not authorize to view this order". This assertion verifies that the request interception
 * successfully redirected the order details request to an unauthorized order, resulting in the expected error message.
 */

const { test,expect } = require('@playwright/test');


test('@QW Security test request intercept', async ({ page }) => {

    //login and reach orders page
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("anshika@gmail.com");
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    await page.locator("button[routerlink*='myorders']").click();
    await page.pause();
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6' }))
    await page.locator("button:has-text('View')").first().click();
    await page.pause();
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");








})