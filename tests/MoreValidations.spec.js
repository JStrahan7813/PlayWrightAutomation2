   const {test,expect} = require('@playwright/test')
//You can choose to run the tests in parallel (best for CI) or serially 
//test.describe.configure({mode:'parallel'});
//test.describe.configure({mode:'serial'});

test("@Web Popup validations",async({page})=>
{
    
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    // await page.goto("http://google.com");
    // await page.goBack();
    // await page.goForward();
    //waits for the css element displayed text to be visible
    await expect(page.locator("#displayed-text")).toBeVisible();
    //clicking on this element will hide the text underneath hide/show buttons
    await page.locator("#hide-textbox").click();
    //assert the text has been hidden
    await expect(page.locator("#displayed-text")).toBeHidden();
    await page.pause();
    // Sets up a listener for dialog events (like alerts or confirms) and automatically accepts them.
    page.on('dialog',dialog => dialog.accept());
    // Clicks on the element with the CSS selector "#confirmbtn", likely triggering a dialog.
    await page.locator("#confirmbtn").click();
    //hovers over the mouse hover element
    await page.locator("#mousehover").hover();
    // Creates a frame locator to interact with the iframe identified by the CSS selector "#courses-iframe".
    const framesPage = page.frameLocator("#courses-iframe");
    await page.pause();
    // Clicks on the link within the iframe that contains "lifetime-access" in its href attribute and is visible.
    // The `:visible` pseudo-class ensures that only visible elements are considered.
    //clicks on all access pop up at bottom of the page
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    //get some of the text content from this header
    const textCheck =await framesPage.locator(".text h2").textContent();
    //log to screen after splitting it
    // Logs the second word of the retrieved text content to the console (after splitting the text by spaces).
    console.log(textCheck.split(" ")[1]);
    await page.pause();



})

test("Screenshot & Visual comparision",async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
     // Takes a screenshot of the element with the CSS selector "#displayed-text" and saves it as 'partialScreenshot.png'.
    await page.locator('#displayed-text').screenshot({path:'partialScreenshot.png'});
    //then hides the text
    await page.locator("#hide-textbox").click();
    //and takes a screenshot of page with the text hidden
    await page.screenshot({path: 'screenshot.png'});
    //assert the text has been hidden
    await expect(page.locator("#displayed-text")).toBeHidden();
});
//screenshot -store -> screenshot -> 
test('visual',async({page})=>
{
    //make payment -when you 0 balance
      await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
      //firsat time will take snapshot and fail as there is nothing to comapre to
      //second time it matches the screenshot to what was taken before in this case it fails
      //due to some minor difference in the pics
      //checck tests/MoreValidations.spec.js-snapshots
    expect(await page.screenshot()).toMatchSnapshot('landing.png');

})





