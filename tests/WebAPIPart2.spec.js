//Login UI  -> .json
// uses stored state to create a json fie with login details meaning user does not get logged out
//test browser-> .json , cart-,order, orderdetails,orderhistory
const { test, expect } = require('@playwright/test');
let webContext;

test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("rahulshetty@gmail.com");
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("[value='Login']").click();
    //waits for the network to be idle, ensuring all login-related requests are complete
    await page.waitForLoadState('networkidle');
    //It saves the storage state (including cookies and local storage) of the logged-in context to 
    // a file named state.json. This allows subsequent tests to reuse this logged-in state
    //  without needing to perform the login steps again.
    await context.storageState({ path: 'state.json' });
    //It creates a new browser context (webContext) and initializes it with the saved state.json. 
    // This effectively creates a new, already logged-in browser session for the tests.

    webContext = await browser.newContext({ storageState: 'state.json' });




})

test('@Client App login', async () => {
    
    const email = "rahulshetty@gmail.com";
    const productName = 'ZARA COAT 3';
    //It creates a new page within the pre-configured webContext (which is already logged in).
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    /*
     Locates product cards, extracts/logs titles, finds "ZARA COAT 3", and adds it to the cart.
     Navigates to the cart, waits for the item, and asserts "ZARA COAT 3" is visible before clicking "Checkout".
     Enters "ind" for country, selects " India" from dropdown, and asserts the user's email on the checkout.
     Clicks "Place Order", asserts the thank you message, extracts/logs order ID, navigates to "myorders", finds the order, clicks "View", and asserts the order ID matches.

    **/
    const products = page.locator(".card-body");
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);
    const count = await products.count();
    for (let i = 0; i < count; ++i) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            //add to cart
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(bool).toBeTruthy();
    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").pressSequentially("ind")
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();
    for (let i = 0; i < optionsCount; ++i) {
        const text = await dropdown.locator("button").nth(i).textContent();
        if (text === " India") {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator(".action__submit").click();

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");


    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();


});
//stored detials mean user is already logged in so no need to fill password/email fields again
test('@API Test case 2', async () => {
    const email = "";
    const productName = 'iZARA COAT 3';
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    await page.waitForLoadState('networkidle');
    const products = page.locator(".card-body");
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);

})






