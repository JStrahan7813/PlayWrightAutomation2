import { test, expect } from '@playwright/test';

/**
 * This test demonstrates Playwright's use of **modern, resilient locator strategies** 
 * such as `getByRole`, `getByPlaceholder`, and `getByText`.
 *
 * Key benefits of these locators:
 * - **More stable than CSS selectors**: They rely on visible UI roles, text, or accessibility attributes,
 *   not fragile classes or IDs which may change frequently.
 * - **Improve test readability**: The locators closely match how users interact with the UI.
 * - **Better support for accessibility**: `getByRole` ties directly to ARIA roles, improving alignment with best practices.
 *
 * Example locators used:
 * - `getByPlaceholder("email@example.com")`: targets input fields via placeholder text.
 * - `getByRole("button", { name: "Login" })`: finds buttons based on their visible label.
 * - `getByText("PLACE ORDER")`: selects elements by their visible text content.
 *
 * This approach helps create **more maintainable and user-centric tests**, especially useful when the UI structure changes
 * but the user-facing elements (like labels and roles) stay consistent.
 */
test('Playwright Special locators', async ({ page }) => {
  
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("abc123");
    await page.getByRole("button", {name: 'Submit'}).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    await page.getByRole("link",{name : "Shop"}).click();
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();

    //locator(css)

});


