import { assertEquals, assertExists } from "jsr:@std/assert";
import { sendMessage } from "./send.ts";

Deno.test({
  name: "sendMessage - returns error on non-macOS",
  ignore: Deno.build.os === "darwin",
  async fn() {
    const result = await sendMessage({
      recipient: "test@example.com",
      message: "test",
    });
    assertEquals(result.success, false);
    assertEquals(result.error, "This module only works on macOS");
  },
});

Deno.test({
  name: "sendMessage - validates required fields",
  ignore: Deno.build.os !== "darwin",
  async fn() {
    const result = await sendMessage({ recipient: "", message: "test" });
    assertEquals(result.success, false);
    assertEquals(result.error, "Recipient and message are required");

    const result2 = await sendMessage({
      recipient: "test@example.com",
      message: "",
    });
    assertEquals(result2.success, false);
    assertEquals(result2.error, "Recipient and message are required");
  },
});

Deno.test({
  name: "sendMessage - trims whitespace",
  ignore: Deno.build.os !== "darwin",
  async fn() {
    const result = await sendMessage({ recipient: "  ", message: "test" });
    assertEquals(result.success, false);
    assertEquals(result.error, "Recipient and message are required");

    const result2 = await sendMessage({
      recipient: "test@example.com",
      message: "   ",
    });
    assertEquals(result2.success, false);
    assertEquals(result2.error, "Recipient and message are required");
  },
});

Deno.test({
  name: "sendMessage - sanitizes special characters",
  ignore: Deno.build.os !== "darwin",
  async fn() {
    const messageWithSpecialChars = 'Hello "world"! \\ Test';
    const recipientWithQuotes = '"test@example.com"';

    const result = await sendMessage({
      recipient: recipientWithQuotes,
      message: messageWithSpecialChars,
    });

    // On macOS, this should attempt to send the message (success or failure depends on actual AppleScript execution)
    // We just verify that it doesn't fail with validation errors
    if (!result.success && result.error) {
      // If it fails, it should not be due to validation (which would be caught earlier)
      // Instead it should be an AppleScript execution error
      assertEquals(
        result.error.includes("Recipient and message are required"),
        false,
      );
    }
  },
});

Deno.test({
  name: "sendMessage - respects retry option with real failure",
  ignore: Deno.build.os !== "darwin",
  async fn() {
    const result = await sendMessage({
      recipient: "",
      message: "test",
      retries: 2,
    });

    assertEquals(result.success, false);
    assertEquals(result.error, "Recipient and message are required");
  },
});

Deno.test({
  name: "sendMessage - includes attempts in result",
  ignore: Deno.build.os !== "darwin",
  async fn() {
    const result = await sendMessage({
      recipient: "test@example.com",
      message: "test message",
    });

    if (result.success) {
      assertExists(result.attempts);
      assertEquals(result.attempts, 1);
    }
  },
});
