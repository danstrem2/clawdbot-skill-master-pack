---
name: Fast Browser Use
description: A high-performance browser automation tool and MCP server written in Rust, featuring headless Chrome control and DOM manipulation.
version: 0.1.0
tags: [browser, automation, rust, mcp, devtools]
dependencies:
  - rust>=1.70
---

# Fast Browser Use

A lightweight, high-performance Rust library for browser automation via Chrome DevTools Protocol (CDP). The fastest there is.

## Features
- **Zero Node.js dependency**: Pure Rust implementation directly controlling browsers.
- **MCP Integration**: Built-in Model Context Protocol server for AI-driven automation.
- **DOM Extraction**: Extract DOM with indexed interactive elements.
- **Headless & Visible Modes**: Support for both headless and visible browser automation.

## Usage

This skill provides a set of tools for browser automation that can be integrated into AI agents via the Model Context Protocol (MCP).

### Quick Start

To run the MCP server:

```bash
# Headless mode
cargo run --bin mcp-server

# Visible browser
cargo run --bin mcp-server -- --headed
```

### Core Capabilities

- **Navigate**: Go to specific URLs.
- **Click**: Interact with elements using selectors or indices.
- **Input**: Type text into input fields.
- **Screenshot**: Capture page screenshots.
- **Extract**: Get structured content from the page.
