# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a Deno project for Apple Message integration (`@lambdalisue/imessage`).
The project is in its initial setup phase with the main module expected at
`mod.ts`.

## Common Development Commands

### Type Checking

```bash
deno task check
```

### Testing

```bash
# Run all tests
deno task test

# Run tests with coverage
deno task test:coverage

# Generate coverage report
deno task coverage
```

### Dependency Management

```bash
# Check for updates
deno task update

# Update dependencies and write changes
deno task update:write

# Update dependencies and commit changes
deno task update:commit
```

## Project Structure

- Main entry point: `mod.ts` (exports via `deno.jsonc`)
- Test files: `*_test.ts` pattern
- Benchmark files: `*_bench.ts` pattern
- Coverage reports: `.coverage/` directory (excluded from version control)

## Publishing Configuration

The project is configured for JSR publishing with:

- Included files: TypeScript files, README.md, LICENSE
- Excluded from publishing: `.script/` directory, test files, benchmark files
