#!/usr/bin/env -S deno run --allow-run

import { parseArgs } from "jsr:@std/cli/parse-args";
import { sendMessage } from "./mod.ts";

const args = parseArgs(Deno.args, {
  string: ["recipient", "message", "retries"],
  boolean: ["help", "verbose"],
  default: {
    retries: "0",
  },
  alias: {
    r: "recipient",
    m: "message",
    h: "help",
    v: "verbose",
  },
});

function printHelp() {
  console.log(`
Usage: imessage [OPTIONS]

Send Message from the command line (macOS only)

OPTIONS:
  -r, --recipient <recipient>  The recipient's phone number or email
  -m, --message <message>      The message to send
  -h, --help                   Show this help message
  -v, --verbose                Show detailed output
  --retries <number>           Number of retries on failure (default: 0)

EXAMPLES:
  imessage "+1234567890" "Hello from CLI!"
  imessage --recipient "email@example.com" --message "Test message"
  imessage -r "+1234567890" -m "Important message" --retries 2
`);
}

if (args.help) {
  printHelp();
  Deno.exit(0);
}

const recipient = args.recipient || args._[0]?.toString();
const message = args.message || args._[1]?.toString();

if (!recipient || !message) {
  console.error("Error: Both recipient and message are required");
  printHelp();
  Deno.exit(1);
}

if (args.verbose) {
  console.log(`Sending message to: ${recipient}`);
  console.log(`Message: ${message}`);
  const retries = Number(args.retries) || 0;
  if (retries > 0) {
    console.log(`Retries: ${retries}`);
  }
}

const result = await sendMessage({
  recipient,
  message,
  retries: Number(args.retries) || 0,
});

if (result.success) {
  console.log("✅ Message sent successfully!");
  if (args.verbose && result.attempts && result.attempts > 1) {
    console.log(`Sent after ${result.attempts} attempts`);
  }
} else {
  console.error(`❌ Failed to send message: ${result.error}`);
  if (args.verbose && result.attempts) {
    console.error(`Failed after ${result.attempts} attempts`);
  }
  Deno.exit(1);
}
