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
  private async makeRequest<T>(method: 'get' | 'post', endpoint: string, data?: any): Promise<T> {
    try {
      // Increment request tracking
      this.requestCount++;
      this.lastRequestTimestamp = Date.now();

      // Check if token is expiring soon and refresh if needed
      if (this.auth.isTokenExpiringSoon()) {
        await this.auth.authenticate();
      }

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

  /**
   * Search for people on LinkedIn with advanced filtering
   */
  public async searchPeople(params: SearchPeopleParams): Promise<any> {
    // Build query parameters for search
    const queryParams = new URLSearchParams();
    
    if (params.keywords) {
      queryParams.append('keywords', params.keywords);
    }
    
    if (params.location) {
      queryParams.append('location', params.location);
    }
    
    // Current company filters
    if (params.currentCompany && params.currentCompany.length > 0) {
      params.currentCompany.forEach((company, index) => {
        queryParams.append(`current-company[${index}]`, company);
      });
    }
    
    // Industry filters
    if (params.industries && params.industries.length > 0) {
      params.industries.forEach((industry, index) => {
        queryParams.append(`facet-industry[${index}]`, industry);
      });
    }
    
    // Make the request
    return this.makeRequest<any>('get', `/search/people?${queryParams.toString()}`);
  }

  /**
   * Get a LinkedIn profile by public ID or URN ID
   */
  public async getProfile(params: GetProfileParams): Promise<any> {
    if (!params.publicId && !params.urnId) {
      throw new Error('Either publicId or urnId must be provided');
    }
    
    let endpoint = '';
    
    if (params.publicId) {
      endpoint = `/people/${params.publicId}`;
    } else if (params.urnId) {
      endpoint = `/people/${encodeURIComponent(params.urnId)}`;
    }
    
    // Add profile fields to include
    endpoint += '?projection=(id,firstName,lastName,profilePicture,headline,summary,industry,location,positions,educations,skills)';
    
    return this.makeRequest<any>('get', endpoint);
  }

  /**
   * Search for jobs on LinkedIn with advanced filtering
   */
  public async searchJobs(params: SearchJobsParams): Promise<any> {
    // Build query parameters for job search
    const queryParams = new URLSearchParams();
    
    if (params.keywords) {
      queryParams.append('keywords', params.keywords);
    }
    
    if (params.location) {
      queryParams.append('location', params.location);
    }
    
    // Company filters
    if (params.companies && params.companies.length > 0) {
      params.companies.forEach((company, index) => {
        queryParams.append(`company-name[${index}]`, company);
      });
    }
    
    // Job type filters
    if (params.jobType && params.jobType.length > 0) {
      params.jobType.forEach((type, index) => {
        queryParams.append(`job-type[${index}]`, type);
      });
    }
    
    // Make the request
    return this.makeRequest<any>('get', `/jobs/search?${queryParams.toString()}`);
  }

  /**
   * Send a message to a LinkedIn connection
   */
  public async sendMessage(params: SendMessageParams): Promise<any> {
    const messageData = {
      recipients: {
        person: params.recipientUrn
      },
      subject: 'LinkedIn MCP Connection',
      body: params.messageBody,
      messageType: 'INMAIL'
    };
    
    return this.makeRequest<any>('post', '/messages', messageData);
  }

  /**
   * Get the current user's LinkedIn profile
   */
  public async getMyProfile(): Promise<any> {
    return this.makeRequest<any>('get', '/me?projection=(id,firstName,lastName,profilePicture,headline)');
  }

  /**
   * Get the current user's network statistics
   */
  public async getNetworkStats(): Promise<any> {
    return this.makeRequest<any>('get', '/networkSizes/~');
  }

  /**
   * Get the user's LinkedIn connections
   */
  public async getConnections(): Promise<any> {
    return this.makeRequest<any>('get', '/connections?start=0&count=50');
  }

  /**
   * Log API request metrics and performance
   */
  public getMetrics(): {
    requestCount: number;
    lastRequestTimestamp: number | null;
    averageRequestTime?: number;
  } {
    return {
      requestCount: this.requestCount,
      lastRequestTimestamp: this.lastRequestTimestamp
    };
  }

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
}

export default LinkedInClient;