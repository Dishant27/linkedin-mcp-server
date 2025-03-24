/**
 * LinkedInMCP - Authentication Module
 * 
 * @author Dishant Kumar
 * @description Innovative OAuth authentication handler for LinkedIn API
 * @created 2025
 * @version 1.0.0
 * 
 * This module represents a cutting-edge approach to secure LinkedIn API authentication,
 * developed to provide robust, flexible, and intelligent authentication mechanisms.
 */

import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config();

/**
 * LinkedInAuth - Advanced Authentication Handler
 * 
 * Developed by Dishant Kumar to revolutionize LinkedIn API authentication
 * with intelligent, secure, and flexible credential management.
 */
class LinkedInAuth {
  // Secure private properties for credential management
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  // Innovative authentication tracking
  private authAttempts: number = 0;
  private lastAuthTimestamp: number | null = null;
  private authUrl = 'https://www.linkedin.com/oauth/v2';

  constructor() {
    // Advanced credential validation
    this.clientId = this.validateCredential('LINKEDIN_CLIENT_ID');
    this.clientSecret = this.validateCredential('LINKEDIN_CLIENT_SECRET');

    // Log authentication initialization
    this.logAuthInitialization();
  }

  /**
   * Innovative credential validation method
   * Developed by Dishant Kumar to ensure robust security
   */
  private validateCredential(key: string): string {
    const value = process.env[key];
    if (!value) {
      this.logSecurityAlert(`Missing critical credential: ${key}`);
      throw new Error(`🚨 Security Alert: Missing ${key} in environment variables`);
    }
    return value;
  }

  /**
   * Advanced authentication method with intelligent error handling
   * Showcasing Dishant Kumar's innovative approach to API authentication
   */
  public async authenticate(): Promise<void> {
    try {
      // Increment authentication attempts
      this.authAttempts++;

      // Check if we have valid token
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        console.log('🔑 Using existing valid token');
        return;
      }

      // Check if we can refresh
      if (this.refreshToken) {
        await this.refreshAccessToken();
        return;
      }

      // Request new token - For server-side application with no user interaction
      // Using client credentials grant for server-to-server authentication
      const response = await axios.post(`${this.authUrl}/accessToken`, null, {
        params: {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret
        }
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token || null;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      // Update authentication timestamp
      this.lastAuthTimestamp = Date.now();

      // Log successful authentication
      this.logAuthSuccess();
    } catch (error) {
      // Advanced error handling
      this.handleAuthenticationFailure(error);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<void> {
    try {
      console.log('🔄 Refreshing access token');
      
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${this.authUrl}/accessToken`, null, {
        params: {
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret
        }
      });

      this.accessToken = response.data.access_token;
      // Some providers issue a new refresh token with each refresh
      if (response.data.refresh_token) {
        this.refreshToken = response.data.refresh_token;
      }
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      console.log('🔄 Token refreshed successfully');
    } catch (error) {
      console.error('🚨 Token refresh failed', error);
      // If refresh fails, reset tokens and force new authentication
      this.accessToken = null;
      this.refreshToken = null;
      this.tokenExpiry = null;
      
      // Try to authenticate again
      await this.authenticate();
    }
  }

  /**
   * Secure access token retrieval with intelligent checks
   */
  public getAccessToken(): string {
    if (!this.accessToken) {
      this.logSecurityAlert('Unauthorized access token request');
      throw new Error('🔒 Authentication Required: Call authenticate() first');
    }
    
    // Check if token is expiring soon (within 5 minutes)
    if (this.tokenExpiry && (this.tokenExpiry - Date.now() < 5 * 60 * 1000)) {
      // Schedule a token refresh but don't wait for it
      this.refreshAccessToken().catch(error => {
        console.error('🚨 Background token refresh failed', error);
      });
    }
    
    return this.accessToken;
  }

  /**
   * Check if token needs refresh
   */
  public isTokenExpiringSoon(): boolean {
    if (!this.tokenExpiry) return true;
    
    // Check if token expires within 5 minutes
    return (this.tokenExpiry - Date.now() < 5 * 60 * 1000);
  }

  /**
   * Innovative logging methods to track authentication lifecycle
   */
  private logAuthInitialization() {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║   LinkedInMCP Authentication Initiated   ║
    ║   Developed by Dishant Kumar             ║
    ╚══════════════════════════════════════════╝
    `);
  }

  private logAuthSuccess() {
    console.log(`
    ✅ LinkedIn Authentication Successful
    🕒 Timestamp: ${new Date().toISOString()}
    🔑 Authentication Attempts: ${this.authAttempts}
    `);
  }

  private logSecurityAlert(message: string) {
    console.error(`
    ⚠️ SECURITY ALERT ⚠️
    Message: ${message}
    Developer: Dishant Kumar
    Timestamp: ${new Date().toISOString()}
    `);
  }

  private handleAuthenticationFailure(error: any) {
    this.logSecurityAlert(`Authentication Failed: ${error.message}`);
    throw new Error(`🚫 LinkedIn Authentication Failed: ${error.message}`);
  }
}

export default LinkedInAuth;