# Claude Desktop Integration Guide for PineScript MCP Server

This guide provides step-by-step instructions for integrating the PineScript MCP Server with Claude Desktop.

## Prerequisites

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Operating System**: macOS, Windows, or Linux with WSL

### Verify Installation
```bash
node --version  # Should output v18.0.0 or higher
npm --version   # Should output v8.0.0 or higher
```

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/cklose2000/pinescript-mcp-server.git
cd pinescript-mcp-server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the Project (if needed)
```bash
npm run build
```

## Claude Desktop Configuration

### Method 1: Using Claude CLI (Recommended)

#### For macOS/Linux:
```bash
claude mcp add pinescript-server "npx" \
  --args "pinescript-mcp-server" \
  --env "NODE_OPTIONS=--enable-source-maps"
```

#### For Windows:
```bash
claude mcp add pinescript-server "cmd" \
  --args "/c" "npx" "pinescript-mcp-server" \
  --env "NODE_OPTIONS=--enable-source-maps"
```

### Method 2: Manual Configuration

Create or edit the `.mcp.json` file in your project directory:

#### macOS/Linux Configuration:
```json
{
  "mcpServers": {
    "pinescript-server": {
      "command": "npx",
      "args": ["pinescript-mcp-server"],
      "env": {
        "NODE_OPTIONS": "--enable-source-maps"
      }
    }
  }
}
```

#### Windows Configuration:
```json
{
  "mcpServers": {
    "pinescript-server": {
      "command": "cmd",
      "args": ["/c", "npx", "pinescript-mcp-server"],
      "env": {
        "NODE_OPTIONS": "--enable-source-maps"
      }
    }
  }
}
```

### Method 3: Direct Node Execution

If you prefer to run the server directly without npx:

#### macOS/Linux:
```json
{
  "mcpServers": {
    "pinescript-server": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "NODE_OPTIONS": "--enable-source-maps"
      }
    }
  }
}
```

#### Windows:
```json
{
  "mcpServers": {
    "pinescript-server": {
      "command": "node",
      "args": [".\\dist\\index.js"],
      "env": {
        "NODE_OPTIONS": "--enable-source-maps"
      }
    }
  }
}
```

## Quick Start Examples

### Example 1: Basic Server Launch (Mac)
```bash
# Using npx (recommended for Mac users as requested)
npx pinescript-mcp-server

# Or using Claude CLI
claude mcp add pinescript-server npx --args pinescript-mcp-server
```

### Example 2: Filesystem Server Configuration
If you need to configure the server with specific filesystem access:

```json
{
  "mcpServers": {
    "pinescript-server": {
      "command": "npx",
      "args": ["pinescript-mcp-server"],
      "env": {
        "NODE_OPTIONS": "--enable-source-maps",
        "PINESCRIPT_WORKSPACE": "/path/to/your/pinescript/files",
        "PINESCRIPT_CONFIG": "/path/to/config.json"
      }
    }
  }
}
```

## Verifying the Connection

1. **Start Claude Desktop**
2. **Check Server Status**: Look for the MCP server indicator in Claude Desktop
3. **Test Commands**: Try basic PineScript commands to verify functionality

## Troubleshooting

### Common Issues and Solutions

#### Server Not Starting
- **Check Node.js version**: Ensure you have Node.js v18+ installed
- **Verify npm installation**: Run `npm list` to check for missing dependencies
- **Check logs**: Look for error messages in Claude Desktop's console

#### Windows-Specific Issues
- **Path separators**: Use backslashes (`\\`) in Windows paths
- **cmd wrapper**: Always use `cmd /c` wrapper for npx commands on Windows
- **Environment variables**: Ensure proper quoting in Windows environment

#### Mac-Specific Issues
- **Permissions**: Ensure the server has necessary file system permissions
- **Path resolution**: Use absolute paths when possible

### Debug Mode
Enable debug logging by adding to your configuration:
```json
{
  "mcpServers": {
    "pinescript-server": {
      "command": "npx",
      "args": ["pinescript-mcp-server", "--debug"],
      "env": {
        "NODE_OPTIONS": "--enable-source-maps",
        "DEBUG": "*"
      }
    }
  }
}
```

## Advanced Configuration

### Environment Variables
The PineScript MCP Server supports the following environment variables:

- `PINESCRIPT_WORKSPACE`: Default workspace directory
- `PINESCRIPT_CONFIG`: Path to configuration file
- `PINESCRIPT_API_KEY`: TradingView API key (if required)
- `NODE_OPTIONS`: Node.js runtime options

### Multiple Server Instances
You can run multiple instances with different configurations:

```json
{
  "mcpServers": {
    "pinescript-dev": {
      "command": "npx",
      "args": ["pinescript-mcp-server", "--port", "3001"],
      "env": {
        "PINESCRIPT_WORKSPACE": "/path/to/dev/workspace"
      }
    },
    "pinescript-prod": {
      "command": "npx",
      "args": ["pinescript-mcp-server", "--port", "3002"],
      "env": {
        "PINESCRIPT_WORKSPACE": "/path/to/prod/workspace"
      }
    }
  }
}
```

## Support

For issues specific to Claude Desktop integration:
1. Check the [GitHub Issues](https://github.com/cklose2000/pinescript-mcp-server/issues)
2. Review Claude Desktop [MCP documentation](https://docs.anthropic.com/en/docs/claude-code/mcp)
3. File a new issue with:
   - Your operating system and version
   - Node.js and npm versions
   - Complete error messages
   - Your `.mcp.json` configuration (with sensitive data removed)