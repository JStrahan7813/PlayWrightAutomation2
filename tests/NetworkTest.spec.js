
//This line imports necessary modules from the Playwright test framework.
//including request module which allows http requests to interact with API
const { test, expect, request } = require('@playwright/test');
//This line imports the APiUtils module which contains utility functions for API interactions.
const { APiUtils } = require('../utils/APiUtils');
//This defines a payload object containing user credentials for login, which will likely be used by the APiUtils class.
const loginPayLoad = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
//This defines a payload object representing an order with a specific product ID and country.
const orderPayLoad = { orders: [{ country: "India", productOrderedId: "67a8dde5c0d3e6622a297cc8" }] };
//This defines a payload object that simulates a response indicating that there are no orders for the customer.
const fakePayLoadOrders = { data: [], message: "No Orders" };
//This declares a variable response which will store the API response from creating an order.
let response;
test.beforeAll(async () => {
  //This creates a new API request context, allowing you to make authenticated or configured API calls.
  const apiContext = await request.newContext();
  //This creates an instance of the APiUtils class, passing the API context and login credentials. This suggests that APiUtils likely handles authentication.
  const apiUtils = new APiUtils(apiContext, loginPayLoad);
  //This line calls the login method of the APiUtils instance, which presumably handles user authentication and returns a response object containing a token.
  response = await apiUtils.createOrder(orderPayLoad);

})


//create order is success
test('@SP Place the order', async ({ page }) => {
  //This is a crucial step. It injects a script into the page before it loads. 
  // This script accesses the browser's localStorage and sets an item named 'token'
  //  with the value of response.token. This is a common way to simulate a user being
  //  logged in, as the website likely stores the authentication token in localStorage after a successful login.
  page.addInitScript(value => {

    window.localStorage.setItem('token', value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client");

  //This sets up a network route interception. 
  // It intercepts any HTTP requests made by the page to the URL matching the provided pattern
  await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async route => {
      //This line fetches the original request made by the page.
      const response = await page.request.fetch(route.request());
      //It creates a stringified version of the fakePayLoadOrders object, which indicates no orders.
      let body = JSON.stringify(fakePayLoadOrders);
      
      //This is where the magic happens. Instead of allowing the original API request 
      // to go through and receive the actual order data, this line fulfills the request
      //  with a modified response. It uses the headers and status of the original response
      //  but replaces the body with the fakePayLoadOrders.
      route.fulfill(
        {
          response,
          body, 

        });
      //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
    });
  //This line locates a button on the page whose routerlink attribute contains the string
  //  'myorders' and clicks it. This likely navigates the user to the "My Orders" page.
  await page.locator("button[routerlink*='myorders']").click();
  //This waits for a network response from the specified API endpoint. Even though the response is being intercepted
  //  and fulfilled, Playwright still tracks the network requests.
  await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")
  //This line locates an element on the "My Orders" page with the CSS class .mt-4 and logs its text content to the console.
  console.log(await page.locator(".mt-4").textContent());



});

