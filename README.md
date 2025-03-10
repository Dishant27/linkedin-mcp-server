# LinkedInMCP: Revolutionizing LinkedIn API Interactions

## 🚀 Project Background

**LinkedInMCP** is an innovative Model Context Protocol (MCP) server designed to transform how developers interact with LinkedIn's API. Born from the need for more flexible and powerful LinkedIn data integration, this project provides a robust, extensible framework for advanced LinkedIn data retrieval and interaction.

## 🌟 Project Vision

Recognizing the limitations of traditional LinkedIn API approaches, this solution creates a more intelligent, context-aware method of working with professional network data.

## ✨ Key Innovations

- **Intelligent Context Management**: Leverage MCP's advanced context handling
- **Secure, Typed Interactions**: Type-safe LinkedIn API interactions
- **Extensible Architecture**: Easy to expand and customize
- **Standardized Protocol**: Follows Model Context Protocol specifications

## 🛠️ Technologies

- TypeScript
- Model Context Protocol
- LinkedIn API
- OAuth 2.0
- Zod for Type Validation
- Axios for HTTP Requests

## 🔍 Core Capabilities

- Advanced People Search
- Detailed Profile Retrieval
- Job Market Intelligence
- Messaging Capabilities
- Secure Authentication Workflow

## 🚀 Comprehensive Setup Guide

### Prerequisites
- Node.js 16+
- LinkedIn Developer Account
- MCP-Compatible LLM (Claude, OpenAI, etc.)

### 1. LinkedIn Developer Setup

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new application
3. Obtain Client ID and Client Secret

### 2. Project Installation

```bash
git clone https://github.com/Dishant27/linkedin-mcp-server.git
cd linkedin-mcp-server
npm install
```

### 3. Configuration Files

#### `.env` File
Create a `.env` file in the project root:
```
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
```

#### `claude_desktop_config.json` (for Claude Desktop)
```json
{
  "mcpServers": {
    "linkedin": {
      "command": "node",
      "args": ["/absolute/path/to/linkedin-mcp-server/dist/index.js"],
      "env": {
        "LINKEDIN_CLIENT_ID": "your_client_id",
        "LINKEDIN_CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

### 4. LLM Configuration Example

#### Claude.ai / Claude Desktop MCP Integration

```json
{
  "tools": [
    {
      "name": "search-people",
      "description": "Search for LinkedIn profiles",
      "parameters": {
        "type": "object",
        "properties": {
          "keywords": {
            "type": "string",
            "description": "Keywords to search for in profiles"
          },
          "currentCompany": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Filter by current company"
          },
          "industries": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Filter by industries"
          },
          "location": {
            "type": "string", 
            "description": "Filter by location"
          }
        }
      }
    },
    {
      "name": "get-profile",
      "description": "Retrieve detailed LinkedIn profile information",
      "parameters": {
        "type": "object",
        "properties": {
          "publicId": {
            "type": "string",
            "description": "Public ID of the LinkedIn profile"
          },
          "urnId": {
            "type": "string", 
            "description": "URN ID of the LinkedIn profile"
          }
        }
      }
    }
  ]
}
```

### 5. Typical Workflow

1. Start the MCP Server:
```bash
npm run build
npm start
```

2. Example LLM Interactions:
```
> Find software engineers in San Francisco working at tech companies

# The LLM will use the search-people tool to:
# 1. Search LinkedIn profiles
# 2. Filter by location (San Francisco)
# 3. Filter by industry (Technology)
# 4. Return relevant profile details
```

## 📦 Generated Project Structure

```
linkedin-mcp-server/
│
├── src/
│   ├── index.ts         # Main server entry point
│   ├── auth.ts          # LinkedIn authentication handler
│   └── client.ts        # LinkedIn API interaction client
│
├── dist/                # Compiled JavaScript files
│   ├── index.js
│   ├── auth.js
│   └── client.js
│
├── .env                 # Secret environment variables
├── .env.example         # Template for environment variables
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## 💡 Created By

**Dishant Kumar**
- Innovator of LinkedInMCP
- Data Integration Specialist
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [@Dishant27](https://github.com/Dishant27)

## 🤝 Contributing

Inspired by the project? Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

Distributed under the MIT License.

---

**Disclaimer**: This project is an independent innovation and is not officially affiliated with LinkedIn or Microsoft.
