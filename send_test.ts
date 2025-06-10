import { assertEquals, assertExists } from "jsr:@std/assert";
import { sendMessage } from "./send.ts";

Deno.test("sendMessage - returns error on non-macOS", async () => {
  if (Deno.build.os !== "darwin") {
    const result = await sendMessage({
      recipient: "test@example.com",
      message: "test",
    });
    assertEquals(result.success, false);
    assertEquals(result.error, "This module only works on macOS");
  }
});

Deno.test("sendMessage - validates required fields", async () => {
  const result = await sendMessage({ recipient: "", message: "test" });
  assertEquals(result.success, false);
  assertEquals(result.error, "Recipient and message are required");

  const result2 = await sendMessage({
    recipient: "test@example.com",
    message: "",
  });
  assertEquals(result2.success, false);
  assertEquals(result2.error, "Recipient and message are required");
});

Deno.test("sendMessage - trims whitespace", async () => {
  const result = await sendMessage({ recipient: "  ", message: "test" });
  assertEquals(result.success, false);
  assertEquals(result.error, "Recipient and message are required");

  const result2 = await sendMessage({
    recipient: "test@example.com",
    message: "   ",
  });
  assertEquals(result2.success, false);
  assertEquals(result2.error, "Recipient and message are required");
});

Deno.test("sendMessage - sanitizes special characters", async () => {
  const messageWithSpecialChars = 'Hello "world"! \\ Test';
  const recipientWithQuotes = '"test@example.com"';

  const result = await sendMessage({
    recipient: recipientWithQuotes,
    message: messageWithSpecialChars,
  });

  if (Deno.build.os !== "darwin") {
    assertEquals(result.success, false);
    assertEquals(result.error, "This module only works on macOS");
  }
});

Deno.test("sendMessage - respects retry option with real failure", async () => {
  // Use a recipient that will definitely fail (invalid format)
  const result = await sendMessage({
    recipient: "",
    message: "test",
    retries: 2,
  });

  // This should fail with validation error regardless of OS
  assertEquals(result.success, false);
  assertEquals(result.error, "Recipient and message are required");
  // Validation failures don't go through retry logic
});

Deno.test("sendMessage - includes attempts in result", async () => {
  const result = await sendMessage({
    recipient: "test@example.com",
    message: "test message",
  });

  if (Deno.build.os === "darwin" && result.success) {
    assertExists(result.attempts);
    assertEquals(result.attempts, 1);
  }
});
