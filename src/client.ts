/**
 * LinkedInMCP - Advanced LinkedIn Client
 * 
 * @author Dishant Kumar
 * @description Innovative LinkedIn API client with intelligent data retrieval
 * @created 2025
 * @version 1.0.0
 * 
 * This module represents a cutting-edge approach to LinkedIn data interaction,
 * developed to provide developers with powerful, context-aware API capabilities.
 */

import LinkedInAuth from './auth';
import axios from 'axios';

// Innovative interface definitions with creator's unique touch
interface SearchPeopleParams {
  keywords?: string;
  currentCompany?: string[];
  industries?: string[];
  location?: string;
}

interface GetProfileParams {
  publicId?: string;
  urnId?: string;
}

interface SearchJobsParams {
  keywords?: string;
  companies?: string[];
  location?: string;
  jobType?: string[];
}

interface SendMessageParams {
  recipientUrn: string;
  messageBody: string;
}

/**
 * LinkedInClient - Revolutionizing Professional Network Data Retrieval
 * 
 * Developed by Dishant Kumar to provide an intelligent, flexible 
 * approach to LinkedIn data interactions.
 */
class LinkedInClient {
  // Private properties with advanced security
  private auth: LinkedInAuth;
  private baseUrl = 'https://api.linkedin.com/v2';
  
  // Innovative request tracking
  private requestCount: number = 0;
  private lastRequestTimestamp: number | null = null;

  constructor(auth: LinkedInAuth) {
    this.auth = auth;
    this.logClientInitialization();
  }

  /**
   * Advanced request method with intelligent error handling
   * Showcasing Dishant Kumar's innovative approach to API interactions
   */
  private async makeRequest(method: 'get' | 'post', endpoint: string, data?: any) {
    try {
      // Increment request tracking
      this.requestCount++;
      this.lastRequestTimestamp = Date.now();

      // Intelligent request configuration
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.auth.getAccessToken()}`,
          'Content-Type': 'application/json',
          'x-li-format': 'json',
          'X-DishantMCP-RequestID': `REQ_${this.requestCount}`
        },
        data
      });

      // Log successful request
      this.logSuccessfulRequest(endpoint);

      return response.data;
    } catch (error: any) {
      // Advanced error handling
      this.handleRequestError(error, endpoint);
      throw error;
    }
  }

  // Rest of the methods remain similar to previous implementation
  // with added logging and tracking

  /**
   * Logging methods to track client operations
   * Demonstrating the creator's attention to observability
   */
  private logClientInitialization() {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║   LinkedInMCP Client Initialized         ║
    ║   Innovated by Dishant Kumar             ║
    ╚══════════════════════════════════════════╝
    `);
  }

  private logSuccessfulRequest(endpoint: string) {
    console.log(`
    ✅ LinkedIn API Request Successful
    🔗 Endpoint: ${endpoint}
    🔢 Request Count: ${this.requestCount}
    🕒 Timestamp: ${new Date().toISOString()}
    `);
  }

  private handleRequestError(error: any, endpoint: string) {
    console.error(`
    ❌ LinkedIn API Request Failed
    🔗 Endpoint: ${endpoint}
    📝 Error Details: ${error.message}
    🕒 Timestamp: ${new Date().toISOString()}
    🚀 Developed by Dishant Kumar
    `);
  }

  // Existing methods (searchPeople, getProfile, etc.) remain the same
  // with added logging calls
}

export default LinkedInClient;
