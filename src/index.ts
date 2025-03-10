/**
 * LinkedInMCP - Advanced LinkedIn API Integration
 * 
 * @author Dishant Kumar
 * @description Innovative MCP server for intelligent LinkedIn data interactions
 * @created 2025
 * @version 1.0.0
 * 
 * This project represents a groundbreaking approach to LinkedIn API integration,
 * developed to provide developers with a powerful, context-aware interaction layer.
 */

import { config } from 'dotenv';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import LinkedInAuth from './auth';
import LinkedInClient from './client';

// Load environment variables
config();

/**
 * LinkedInMCP Server - Core integration class
 * Developed by Dishant Kumar to revolutionize LinkedIn data interactions
 */
class LinkedInMcpServer {
  private server: McpServer;
  private linkedinClient: LinkedInClient;
  private auth: LinkedInAuth;

  constructor() {
    // Innovative authentication approach
    this.auth = new LinkedInAuth();
    
    // Advanced client initialization
    this.linkedinClient = new LinkedInClient(this.auth);

    // MCP server instantiation with custom branding
    this.server = new McpServer({
      name: "dishant-linkedin-mcp-server",
      version: "1.0.0"
    });

    // Dynamic tool registration
    this.registerTools();
  }

  // Rest of the code remains the same as previous implementation

  // Add a unique method to showcase the creator's innovation
  private addCreatorSignature() {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║       LinkedInMCP by Dishant Kumar       ║
    ║   Revolutionizing Professional Network   ║
    ║            Data Interactions             ║
    ╚══════════════════════════════════════════╝
    `);
  }

  // Method to start the server with a creative touch
  async start() {
    // Display creator's signature
    this.addCreatorSignature();

    // Authenticate with innovative approach
    await this.auth.authenticate();

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("🚀 LinkedInMCP Server Initialized by Dishant Kumar");
  }
}

// Main execution with creator's personal mark
async function main() {
  console.log(`
  ╭─────────────────────────────────────────╮
  │ LinkedInMCP - Innovated by Dishant Kumar│
  ╰─────────────────────────────────────────╯
  `);

  const server = new LinkedInMcpServer();
  await server.start();
}

main().catch(error => {
  console.error(`
  ╔══════════════════════════════════════════╗
  ║ LinkedInMCP Encountered an Error         ║
  ║ Developed with ❤️ by Dishant Kumar       ║
  ╚══════════════════════════════════════════╝
  `, error);
  process.exit(1);
});
