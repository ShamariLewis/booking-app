import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

//#### This tests our Sign In functionality of our app. ####//
test("should allow the user to sign in", async ({ page }) => {
  // Page should navigate to this URL to begin the tests
  await page.goto(UI_URL);

  // get the Sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  // This expects a heading to be on the page that says "Sign In"
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  // This means to find an element on the page with name=email and name=password and fill it with the data to simulate a login
  // We'll add this user to our test database so that this user is always there for us to run our end to end tests
  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");

  // Get the login button
  await page.getByRole("button", { name: "Login" }).click();

  // assert the user has signed in. After logging in, expect the sign in successful toast message to be visible
  // on the page.
  await expect(page.getByText("Sign in Successful!")).toBeVisible();

  // Assert that the links are present on this page
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

//##### Test if our Registration functionality works ####//
test("should allow user to register", async ({ page }) => {
  // Randomize email for our test
  const testEmail = `test_register_${
    Math.floor(Math.random() * 90000) + 10000
  }@test.com`;

  await page.goto(UI_URL);

  // This first goes to the sign in page where the create account link is located
  await page.getByRole("link", { name: "Sign In" }).click();
  // This gets the Create Account link below our Sign In form.
  await page.getByRole("link", { name: "Create Account" }).click();
  // Expect the link to take you to a page with a heading that says "Create an Account"
  await expect(
    page.getByRole("heading", { name: "Create an Account" })
  ).toBeVisible();

  // locate all the fields in our registration form and test that they supports the data being entered into them.
  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword]").fill("password123");

  await page.getByRole("button", { name: "Create Account" }).click();

  // assert the registration has taken place. After registering, expect the Registration Successful toast message to be visible
  // on the page.
  await expect(page.getByText("Registration Successful!")).toBeVisible();

  // Assert that the user was forwarded to a page where these links are present on this page
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});
