export interface SendMessageOptions {
  recipient: string;
  message: string;
  retries?: number;
}

export interface SendMessageResult {
  success: boolean;
  error?: string;
  attempts?: number;
}

export async function sendMessage(
  options: SendMessageOptions,
): Promise<SendMessageResult> {
  const { recipient, message, retries = 0 } = options;

  if (Deno.build.os !== "darwin") {
    return {
      success: false,
      error: "This module only works on macOS",
    };
  }

  if (!recipient?.trim() || !message?.trim()) {
    return {
      success: false,
      error: "Recipient and message are required",
    };
  }

  const sanitizedRecipient = recipient.trim().replace(/["\\]/g, "\\$&");
  const sanitizedMessage = message.trim().replace(/["\\]/g, "\\$&");

  const script = `
    tell application "Messages"
      set targetService to 1st account whose service type = iMessage
      set targetBuddy to participant "${sanitizedRecipient}" of targetService
      send "${sanitizedMessage}" to targetBuddy
    end tell
  `;

  let lastError: string | undefined;
  const maxAttempts = retries + 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const command = new Deno.Command("osascript", {
        args: ["-e", script],
        stdout: "piped",
        stderr: "piped",
      });

      const { code, stderr } = await command.output();

      if (code === 0) {
        return { success: true, attempts: attempt };
      }

      lastError = new TextDecoder().decode(stderr).trim();

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  return {
    success: false,
    error: `Failed to send message after ${maxAttempts} attempts: ${lastError}`,
    attempts: maxAttempts,
  };
}
