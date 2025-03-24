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

  /**
   * Register MCP tools for LinkedIn API interactions
   * Implements tool definitions for various LinkedIn data operations
   */
  private registerTools() {
    // Search People Tool
    this.server.registerTool({
      name: "search-people",
      description: "Search for LinkedIn profiles based on various criteria",
      parameters: z.object({
        keywords: z.string().optional().describe("Keywords to search for in profiles"),
        currentCompany: z.array(z.string()).optional().describe("Filter by current company"),
        industries: z.array(z.string()).optional().describe("Filter by industries"),
        location: z.string().optional().describe("Filter by location")
      }),
      handler: async (params) => {
        console.error("🔍 Executing LinkedIn People Search");
        try {
          const results = await this.linkedinClient.searchPeople(params);
          return results;
        } catch (error) {
          console.error("❌ LinkedIn People Search Failed", error);
          throw error;
        }
      }
    });

    // Get Profile Tool
    this.server.registerTool({
      name: "get-profile",
      description: "Retrieve detailed LinkedIn profile information",
      parameters: z.object({
        publicId: z.string().optional().describe("Public ID of the LinkedIn profile"),
        urnId: z.string().optional().describe("URN ID of the LinkedIn profile")
      }),
      handler: async (params) => {
        console.error("🔍 Retrieving LinkedIn Profile");
        try {
          const profile = await this.linkedinClient.getProfile(params);
          return profile;
        } catch (error) {
          console.error("❌ LinkedIn Profile Retrieval Failed", error);
          throw error;
        }
      }
    });

    // Search Jobs Tool
    this.server.registerTool({
      name: "search-jobs",
      description: "Search for LinkedIn job postings based on various criteria",
      parameters: z.object({
        keywords: z.string().optional().describe("Keywords to search for in job postings"),
        companies: z.array(z.string()).optional().describe("Filter by companies"),
        location: z.string().optional().describe("Filter by location"),
        jobType: z.array(z.string()).optional().describe("Filter by job type (e.g., full-time, contract)")
      }),
      handler: async (params) => {
        console.error("🔍 Executing LinkedIn Job Search");
        try {
          const jobs = await this.linkedinClient.searchJobs(params);
          return jobs;
        } catch (error) {
          console.error("❌ LinkedIn Job Search Failed", error);
          throw error;
        }
      }
    });

    // Send Message Tool
    this.server.registerTool({
      name: "send-message",
      description: "Send a message to a LinkedIn connection",
      parameters: z.object({
        recipientUrn: z.string().describe("URN of the message recipient"),
        messageBody: z.string().describe("Content of the message to send")
      }),
      handler: async (params) => {
        console.error("📨 Sending LinkedIn Message");
        try {
          const result = await this.linkedinClient.sendMessage(params);
          return result;
        } catch (error) {
          console.error("❌ LinkedIn Message Sending Failed", error);
          throw error;
        }
      }
    });

    // Get My Profile Tool
    this.server.registerTool({
      name: "get-my-profile",
      description: "Retrieve the current user's LinkedIn profile information",
      parameters: z.object({}),
      handler: async () => {
        console.error("🔍 Retrieving Current User Profile");
        try {
          const profile = await this.linkedinClient.getMyProfile();
          return profile;
        } catch (error) {
          console.error("❌ Current User Profile Retrieval Failed", error);
          throw error;
        }
      }
    });

    // Get Network Statistics Tool
    this.server.registerTool({
      name: "get-network-stats",
      description: "Retrieve network statistics for the current user",
      parameters: z.object({}),
      handler: async () => {
        console.error("🔍 Retrieving Network Statistics");
        try {
          const stats = await this.linkedinClient.getNetworkStats();
          return stats;
        } catch (error) {
          console.error("❌ Network Statistics Retrieval Failed", error);
          throw error;
        }
      }
    });
  }

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
