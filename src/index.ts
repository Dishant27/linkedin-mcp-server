import { config } from 'dotenv';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import LinkedInAuth from './auth';
import LinkedInClient from './client';

// Load environment variables
config();

class LinkedInMcpServer {
  private server: McpServer;
  private linkedinClient: LinkedInClient;
  private auth: LinkedInAuth;

  constructor() {
    // Initialize authentication
    this.auth = new LinkedInAuth();
    
    // Initialize LinkedIn client
    this.linkedinClient = new LinkedInClient(this.auth);

    // Create MCP server instance
    this.server = new McpServer({
      name: "linkedin-server",
      version: "1.0.0"
    });

    this.registerTools();
  }

  private registerTools() {
    // Tool for searching people
    this.server.tool(
      "search-people",
      "Search for LinkedIn profiles",
      {
        keywords: z.string().optional(),
        currentCompany: z.array(z.string()).optional(),
        industries: z.array(z.string()).optional(),
        location: z.string().optional()
      },
      async (args) => {
        try {
          const searchResults = await this.linkedinClient.searchPeople({
            keywords: args.keywords,
            currentCompany: args.currentCompany,
            industries: args.industries,
            location: args.location
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(searchResults, null, 2)
              }
            ]
          };
        } catch (error: any) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Error searching people: ${error.message}`
              }
            ]
          };
        }
      }
    );

    // Tool for getting profile details
    this.server.tool(
      "get-profile",
      "Retrieve detailed LinkedIn profile information",
      {
        publicId: z.string().optional(),
        urnId: z.string().optional()
      },
      async (args) => {
        try {
          const profileData = await this.linkedinClient.getProfile({
            publicId: args.publicId,
            urnId: args.urnId
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(profileData, null, 2)
              }
            ]
          };
        } catch (error: any) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Error fetching profile: ${error.message}`
              }
            ]
          };
        }
      }
    );

    // Tool for searching jobs
    this.server.tool(
      "search-jobs",
      "Search for LinkedIn job postings",
      {
        keywords: z.string().optional(),
        companies: z.array(z.string()).optional(),
        location: z.string().optional(),
        jobType: z.array(z.string()).optional()
      },
      async (args) => {
        try {
          const jobResults = await this.linkedinClient.searchJobs({
            keywords: args.keywords,
            companies: args.companies,
            location: args.location,
            jobType: args.jobType
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(jobResults, null, 2)
              }
            ]
          };
        } catch (error: any) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Error searching jobs: ${error.message}`
              }
            ]
          };
        }
      }
    );

    // Tool for sending messages
    this.server.tool(
      "send-message",
      "Send a message to a LinkedIn connection",
      {
        recipientUrn: z.string(),
        messageBody: z.string()
      },
      async (args) => {
        try {
          await this.linkedinClient.sendMessage({
            recipientUrn: args.recipientUrn,
            messageBody: args.messageBody
          });

          return {
            content: [
              {
                type: "text",
                text: "Message sent successfully"
              }
            ]
          };
        } catch (error: any) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Error sending message: ${error.message}`
              }
            ]
          };
        }
      }
    );
  }

  // Method to start the server
  async start() {
    // Authenticate first
    await this.auth.authenticate();

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("LinkedIn MCP Server running");
  }
}

// Main execution
async function main() {
  const server = new LinkedInMcpServer();
  await server.start();
}

main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});