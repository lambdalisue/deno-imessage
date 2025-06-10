# @lambdalisue/imessage

[![JSR](https://jsr.io/badges/@lambdalisue/imessage)](https://jsr.io/@lambdalisue/imessage)

A Deno module and CLI for sending iMessages from the command line on macOS.

## Requirements

- macOS (uses AppleScript to interact with Messages app)
- Deno runtime
- Messages app configured with iMessage account

## Installation

```bash
deno install --allow-run -n imessage jsr:@lambdalisue/imessage/cli
```

Or use directly

```bash
deno run --allow-run jsr:@lambdalisue/imessage/cli -r "+1234567890" -m "Hello!"
```

## CLI Usage

```bash
imessage --recipient "email@example.com" --message "Test message"

# Short flags
imessage -r "+1234567890" -m "Hello!"

# Positional arguments
imessage "+1234567890" "Hello!"
```

## Programmatic Usage

```typescript ignore
import { sendMessage } from "jsr:@lambdalisue/imessage";

const result = await sendMessage({
  recipient: "+1234567890", // Phone number or email
  message: "Hello from Deno!",
});

if (result.success) {
  console.log("Message sent!");
} else {
  console.error("Failed:", result.error);
}
```

## API

### `sendMessage(options: SendMessageOptions): Promise<SendMessageResult>`

Send an iMessage to a recipient.

#### Options

- `recipient` (string): The recipient's phone number or email address
- `message` (string): The message content to send
- `retries` (number, optional): Number of retry attempts on failure (default: 0)

#### Returns

- `success` (boolean): Whether the message was sent successfully
- `error` (string, optional): Error message if sending failed
- `attempts` (number, optional): Number of attempts made to send the message

## Development

```bash
# Run tests
deno task test

# Type check
deno task check

# Run with coverage
deno task test:coverage
deno task coverage
```

## License

MIT License - see [LICENSE](./LICENSE) file for details.
