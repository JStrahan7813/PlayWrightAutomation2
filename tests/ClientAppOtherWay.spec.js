const { test, expect } = require('@playwright/test');

/*
This test utilizes Playwright's modern locator strategies (getByRole, getByPlaceholder,
 * getByText, filter) for improved test resilience and readability. It aims to provide
 * a concise verification of the core purchase functionality.
 * 
 * Does not rely on  CSS selectors like page.locator("#userEmail"), page.locator("[value='Login']"), 
 * and page.locator(".card-body b").
 *  While these work, they can be less resilient to UI changes. If the id, value, or CSS class changes, the tests might break.
 * 
 * 
1. Simple Direct Test (first script):
 *    - Contains inline test steps without abstraction.
 *    - Uses Playwright's recommended locators (getByRole, getByPlaceholder) for better resilience.
 *    - Ideal for small-scale testing or initial learning.
**/


test('@Webst Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "anshika@gmail.com";
   const productName = 'ZARA COAT 3';
   const products = page.locator(".card-body");
   await page.goto("https://rahulshettyacademy.com/client");
   await page.getByPlaceholder("email@example.com").fill(email);
   await page.getByPlaceholder("enter your passsword").fill("Iamking@000");
   await page.getByRole('button',{name:"Login"}).click();
   await page.waitForLoadState('networkidle');
   await page.locator(".card-body b").first().waitFor();
   
   await page.locator(".card-body").filter({hasText:"ZARA COAT 3"})
   .getByRole("button",{name:"Add to Cart"}).click();

   await page.getByRole("listitem").getByRole('button',{name:"Cart"}).click();

   //await page.pause();
   await page.locator("div li").first().waitFor();
   await expect(page.getByText("ZARA COAT 3")).toBeVisible();

   await page.getByRole("button",{name :"Checkout"}).click();

   await page.getByPlaceholder("Select Country").pressSequentially("ind");

   await page.getByRole("button",{name :"India"}).nth(1).click();
   await page.getByText("PLACE ORDER").click();

   await expect(page.getByText("Thankyou for the order.")).toBeVisible();
})