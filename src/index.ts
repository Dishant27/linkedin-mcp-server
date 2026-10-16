/**
 * LinkedIn MCP server
 *
 * @author Dishant Kumar
 *
 * Stdio MCP server: stdout carries the JSON-RPC protocol, so all logging goes
 * to stderr (console.error). Never write to stdout from this process.
 */

import { config } from 'dotenv';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import LinkedInAuth from './auth.js';
import LinkedInClient from './client.js';

config();

/** Wrap a client call into an MCP tool result, reporting errors as tool errors. */
async function run(label: string, fn: () => Promise<unknown>): Promise<CallToolResult> {
  console.error(`[linkedin-mcp] ${label}`);
  try {
    const data = await fn();
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  } catch (error: any) {
    const detail = error?.response?.data ? JSON.stringify(error.response.data) : error?.message ?? String(error);
    console.error(`[linkedin-mcp] ${label} failed:`, detail);
    return { isError: true, content: [{ type: 'text', text: `${label} failed: ${detail}` }] };
  }
}

class LinkedInMcpServer {
  private server: McpServer;
  private linkedinClient: LinkedInClient;
  private auth: LinkedInAuth;

  constructor() {
    this.auth = new LinkedInAuth();
    this.linkedinClient = new LinkedInClient(this.auth);
    this.server = new McpServer({
      name: 'linkedin-mcp-server',
      version: '1.1.0'
    });
    this.registerTools();
  }

  private registerTools() {
    this.server.registerTool(
      'search-people',
      {
        title: 'Search people',
        description:
          'Search LinkedIn profiles. Note: people search requires LinkedIn partner API access; most developer apps will get a 403.',
        inputSchema: {
          keywords: z.string().optional().describe('Keywords to search for in profiles'),
          currentCompany: z.array(z.string()).optional().describe('Filter by current company'),
          industries: z.array(z.string()).optional().describe('Filter by industries'),
          location: z.string().optional().describe('Filter by location')
        }
      },
      async (params) => run('search-people', () => this.linkedinClient.searchPeople(params))
    );

    this.server.registerTool(
      'get-profile',
      {
        title: 'Get profile',
        description: 'Retrieve a LinkedIn profile by public ID or URN ID',
        inputSchema: {
          publicId: z.string().optional().describe('Public ID of the LinkedIn profile'),
          urnId: z.string().optional().describe('URN ID of the LinkedIn profile')
        }
      },
      async (params) => run('get-profile', () => this.linkedinClient.getProfile(params))
    );

    this.server.registerTool(
      'search-jobs',
      {
        title: 'Search jobs',
        description: 'Search LinkedIn job postings (requires partner API access)',
        inputSchema: {
          keywords: z.string().optional().describe('Keywords to search for in job postings'),
          companies: z.array(z.string()).optional().describe('Filter by companies'),
          location: z.string().optional().describe('Filter by location'),
          jobType: z.array(z.string()).optional().describe('Filter by job type (e.g., full-time, contract)')
        }
      },
      async (params) => run('search-jobs', () => this.linkedinClient.searchJobs(params))
    );

    this.server.registerTool(
      'send-message',
      {
        title: 'Send message',
        description: 'Send a message to a LinkedIn connection (requires messaging API access)',
        inputSchema: {
          recipientUrn: z.string().describe('URN of the message recipient'),
          messageBody: z.string().describe('Content of the message to send')
        }
      },
      async (params) => run('send-message', () => this.linkedinClient.sendMessage(params))
    );

    this.server.registerTool(
      'get-my-profile',
      {
        title: 'Get my profile',
        description: "Retrieve the authenticated user's LinkedIn profile"
      },
      async () => run('get-my-profile', () => this.linkedinClient.getMyProfile())
    );

    this.server.registerTool(
      'get-network-stats',
      {
        title: 'Get network stats',
        description: 'Retrieve network statistics for the authenticated user'
      },
      async () => run('get-network-stats', () => this.linkedinClient.getNetworkStats())
    );
  }

  async start() {
    await this.auth.authenticate();
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('[linkedin-mcp] server running on stdio');
  }
}

async function main() {
  const server = new LinkedInMcpServer();
  await server.start();
}

main().catch((error) => {
  console.error('[linkedin-mcp] fatal error:', error);
  process.exit(1);
});
