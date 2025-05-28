const {test,expect} = require("@playwright/test");

// This test suite focuses on validating the calendar functionality
// on the specified webpage, ensuring that a user can select a specific
// date and that the selected date is correctly displayed in the input fields.

test("Calendar validations",async({page})=>
{
    // Test case to check if the calendar is displayed correctly
    const monthNumber = "6";
    // Month number is set to June (6)
    // The expected date to be selected is the 15th of June, 2027
    const date = "15";
    const year = "2027";
    const expectedList = [monthNumber,date,year];
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    //
    await page.locator(".react-date-picker__inputGroup").click();
    // Click on the date picker input group to open the calendar
    await page.locator(".react-calendar__navigation__label").click();
    // Click on the navigation label to open the year selection
    await page.locator(".react-calendar__navigation__label").click();
    // Click again to open the month selection
    await page.getByText(year).click();
    // Select the year 2027
    await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click();
    // Select the month of June (0-indexed, hence -1)
    await page.locator("//abbr[text()='"+date+"']").click();
    // Click on the 15th of June
    const inputs = await page.locator(".react-date-picker__inputGroup input");
    // Get all input fields in the date picker
    for (let index = 0; index <inputs.length; index++)
    {
        // Loop through each input field
        // and validate the selected date
        const value =inputs[index].getAttribute("value");
        expect(value).toEqual(expectedList[index]);
    }
    // Validate that the selected date is correctly displayed in the input fields













})