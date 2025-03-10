# LinkedIn MCP Server

## Overview
A Model Context Protocol (MCP) server for LinkedIn API integration, enabling advanced interactions and data retrieval.

## Features
- Search LinkedIn profiles
- Retrieve profile details
- Search job postings
- Send messages
- Secure, typed interactions

## Prerequisites
- Node.js 16+
- TypeScript
- LinkedIn Developer Account

## Installation

1. Clone the repository
```bash
git clone https://github.com/Dishant27/linkedin-mcp-server.git
cd linkedin-mcp-server
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with:
```
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
```

## Configuration

Configure your LinkedIn API credentials in the `.env` file.

## Running the Server

```bash
npm run start
```

## Development

- `npm run dev`: Start development server
- `npm run build`: Compile TypeScript
- `npm test`: Run tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License.
