import { test, expect } from "@playwright/test";

test("creates a booking and preserves it after reload", async ({ page }) => {
  await page.goto("./");
  const heading = page.getByRole("heading", {
    name: "Book a room",
  });
  await expect(heading).toBeVisible();
  await page
    .getByLabel("Room", { exact: true })
    .selectOption({ label: "Room A" });
  await page.getByLabel("Date", { exact: true }).fill("2026-10-19");
  await page.getByLabel("Start time", { exact: true }).fill("09:00");
  await page.getByLabel("End time", { exact: true }).fill("10:00");
  await page.getByRole("button", { name: "Create booking" }).click();
  const booking = page
    .getByRole("list", { name: "Saved bookings" })
    .getByRole("listitem");

  await expect(booking).toHaveCount(1);
  await expect(booking).toContainText("Room A");
  await expect(booking).toContainText("2026-10-19");
  await expect(booking).toContainText("09:00 – 10:00");

  await page.reload();

  await expect(booking).toHaveCount(1);
  await expect(booking).toContainText("Room A");
  await expect(booking).toContainText("2026-10-19");
  await expect(booking).toContainText("09:00 – 10:00");
});

test("rejects an overlapping booking", async ({ page }) => {
  await page.goto("./");
  const heading = page.getByRole("heading", {
    name: "Book a room",
  });
  await expect(heading).toBeVisible();
  await page
    .getByLabel("Room", { exact: true })
    .selectOption({ label: "Room A" });
  await page.getByLabel("Date", { exact: true }).fill("2026-10-19");
  await page.getByLabel("Start time", { exact: true }).fill("09:00");
  await page.getByLabel("End time", { exact: true }).fill("10:00");
  await page.getByRole("button", { name: "Create booking" }).click();
  const booking = page
    .getByRole("list", { name: "Saved bookings" })
    .getByRole("listitem");

  await expect(booking).toHaveCount(1);
  await expect(booking).toContainText("Room A");
  await expect(booking).toContainText("2026-10-19");
  await expect(booking).toContainText("09:00 – 10:00");

  await page.reload();

  await expect(booking).toHaveCount(1);
  await expect(booking).toContainText("Room A");
  await expect(booking).toContainText("2026-10-19");
  await expect(booking).toContainText("09:00 – 10:00");

  await page
    .getByLabel("Room", { exact: true })
    .selectOption({ label: "Room A" });
  await page.getByLabel("Date", { exact: true }).fill("2026-10-19");
  await page.getByLabel("Start time", { exact: true }).fill("09:30");
  await page.getByLabel("End time", { exact: true }).fill("10:30");
  await page.getByRole("button", { name: "Create booking" }).click();
  const errorOverlapMessage = page.getByText(
    "This room is already booked for the selected time.",
  );
  await expect(errorOverlapMessage).toBeVisible();

  await expect(booking).toHaveCount(1);
  await expect(booking).toContainText("09:00 – 10:00");

  await page.reload();

  await expect(booking).toHaveCount(1);
  await expect(booking).toContainText("Room A");
  await expect(booking).toContainText("2026-10-19");
  await expect(booking).toContainText("09:00 – 10:00");
});

test("rejects an end time before the start time", async ({ page }) => {
  await page.goto("./");
  const heading = page.getByRole("heading", {
    name: "Book a room",
  });
  await expect(heading).toBeVisible();
  await page
    .getByLabel("Room", { exact: true })
    .selectOption({ label: "Room A" });
  await page.getByLabel("Date", { exact: true }).fill("2026-10-19");
  await page.getByLabel("Start time", { exact: true }).fill("10:00");
  await page.getByLabel("End time", { exact: true }).fill("09:00");
  await page.getByRole("button", { name: "Create booking" }).click();
  const booking = page
    .getByRole("list", { name: "Saved bookings" })
    .getByRole("listitem");
  const errorEndTimeMessage = page.getByText(
    "Choose an end time later than the start time on the same day.",
  );
  await expect(errorEndTimeMessage).toBeVisible();
  await expect(booking).toHaveCount(0);
});

test("allows back-to-back bookings in the same room", async ({ page }) => {
  await page.goto("./");
  const heading = page.getByRole("heading", {
    name: "Book a room",
  });
  await expect(heading).toBeVisible();
  await page
    .getByLabel("Room", { exact: true })
    .selectOption({ label: "Room A" });
  await page.getByLabel("Date", { exact: true }).fill("2026-10-19");
  await page.getByLabel("Start time", { exact: true }).fill("09:00");
  await page.getByLabel("End time", { exact: true }).fill("10:00");
  await page.getByRole("button", { name: "Create booking" }).click();
  const booking = page
    .getByRole("list", { name: "Saved bookings" })
    .getByRole("listitem");

  await expect(booking).toHaveCount(1);
  await expect(booking).toContainText("Room A");
  await expect(booking).toContainText("2026-10-19");
  await expect(booking).toContainText("09:00 – 10:00");

  await page
    .getByLabel("Room", { exact: true })
    .selectOption({ label: "Room A" });
  await page.getByLabel("Date", { exact: true }).fill("2026-10-19");
  await page.getByLabel("Start time", { exact: true }).fill("10:00");
  await page.getByLabel("End time", { exact: true }).fill("11:00");
  await page.getByRole("button", { name: "Create booking" }).click();

  await expect(booking).toHaveCount(2);
  await expect(booking).toContainText(["Room A", "Room A"]);
  await expect(booking).toContainText(["2026-10-19", "2026-10-19"]);
  await expect(booking).toContainText(["09:00 – 10:00", "10:00 – 11:00"]);
});

test("allows bookings at the same time in different rooms", async ({
  page,
}) => {
  await page.goto("./");
  const heading = page.getByRole("heading", {
    name: "Book a room",
  });
  await expect(heading).toBeVisible();
  await page
    .getByLabel("Room", { exact: true })
    .selectOption({ label: "Room A" });
  await page.getByLabel("Date", { exact: true }).fill("2026-10-19");
  await page.getByLabel("Start time", { exact: true }).fill("09:00");
  await page.getByLabel("End time", { exact: true }).fill("10:00");
  await page.getByRole("button", { name: "Create booking" }).click();
  const booking = page
    .getByRole("list", { name: "Saved bookings" })
    .getByRole("listitem");

  await expect(booking).toHaveCount(1);
  await expect(booking).toContainText("Room A");
  await expect(booking).toContainText("2026-10-19");
  await expect(booking).toContainText("09:00 – 10:00");

  await page
    .getByLabel("Room", { exact: true })
    .selectOption({ label: "Room B" });
  await page.getByLabel("Date", { exact: true }).fill("2026-10-19");
  await page.getByLabel("Start time", { exact: true }).fill("09:00");
  await page.getByLabel("End time", { exact: true }).fill("10:00");
  await page.getByRole("button", { name: "Create booking" }).click();

  await expect(booking).toHaveCount(2);
  await expect(booking).toContainText(["Room A", "Room B"]);
  await expect(booking).toContainText(["2026-10-19", "2026-10-19"]);
  await expect(booking).toContainText(["09:00 – 10:00", "09:00 – 10:00"]);
});

test("allows bookings at the same time on different dates", async ({
  page,
}) => {
  await page.goto("./");
  const heading = page.getByRole("heading", {
    name: "Book a room",
  });
  await expect(heading).toBeVisible();
  await page
    .getByLabel("Room", { exact: true })
    .selectOption({ label: "Room A" });
  await page.getByLabel("Date", { exact: true }).fill("2026-10-19");
  await page.getByLabel("Start time", { exact: true }).fill("09:00");
  await page.getByLabel("End time", { exact: true }).fill("10:00");
  await page.getByRole("button", { name: "Create booking" }).click();
  const booking = page
    .getByRole("list", { name: "Saved bookings" })
    .getByRole("listitem");

  await expect(booking).toHaveCount(1);
  await expect(booking).toContainText("Room A");
  await expect(booking).toContainText("2026-10-19");
  await expect(booking).toContainText("09:00 – 10:00");

  await page
    .getByLabel("Room", { exact: true })
    .selectOption({ label: "Room A" });
  await page.getByLabel("Date", { exact: true }).fill("2026-10-20");
  await page.getByLabel("Start time", { exact: true }).fill("09:00");
  await page.getByLabel("End time", { exact: true }).fill("10:00");
  await page.getByRole("button", { name: "Create booking" }).click();

  await expect(booking).toHaveCount(2);
  await expect(booking).toContainText(["Room A", "Room A"]);
  await expect(booking).toContainText(["2026-10-19", "2026-10-20"]);
  await expect(booking).toContainText(["09:00 – 10:00", "09:00 – 10:00"]);
});

test("rejects a booking with equal start and end times", async ({ page }) => {
await page.goto("./");
  const heading = page.getByRole("heading", {
    name: "Book a room",
  });
  await expect(heading).toBeVisible();
  await page
    .getByLabel("Room", { exact: true })
    .selectOption({ label: "Room A" });
  await page.getByLabel("Date", { exact: true }).fill("2026-10-19");
  await page.getByLabel("Start time", { exact: true }).fill("09:00");
  await page.getByLabel("End time", { exact: true }).fill("09:00");
  await page.getByRole("button", { name: "Create booking" }).click();
  const booking = page
    .getByRole("list", { name: "Saved bookings" })
    .getByRole("listitem");

  const invalidTimeMessage = page.getByText(
    "Choose an end time later than the start time on the same day.",
  );
  await expect(invalidTimeMessage).toBeVisible();
  await expect(booking).toHaveCount(0);
});

test("allows creating a booking after correcting an invalid end time", async ({ page }) => { 
  await page.goto("./");
  const heading = page.getByRole("heading", {
    name: "Book a room",
  });
  await expect(heading).toBeVisible();
  await page
    .getByLabel("Room", { exact: true })
    .selectOption({ label: "Room A" });
  await page.getByLabel("Date", { exact: true }).fill("2026-10-19");
  await page.getByLabel("Start time", { exact: true }).fill("10:00");
  await page.getByLabel("End time", { exact: true }).fill("09:00");
  await page.getByRole("button", { name: "Create booking" }).click();

  const booking = page
    .getByRole("list", { name: "Saved bookings" })
    .getByRole("listitem");
  const errorEndTimeMessage = page.getByText("Choose an end time later than the start time on the same day.");
  await expect(errorEndTimeMessage).toBeVisible();
  await expect(booking).toHaveCount(0);

  await page.getByLabel("End time", { exact: true }).fill("11:00");
  await page.getByRole("button", { name: "Create booking" }).click();

  await expect(booking).toHaveCount(1);
  await expect(booking).toContainText("Room A");
  await expect(booking).toContainText("2026-10-19");
  await expect(booking).toContainText("10:00 – 11:00");
  await expect(errorEndTimeMessage).not.toBeVisible();
  const successMessage = page.getByText("Booking created successfully.");
  await expect(successMessage).toBeVisible();

});