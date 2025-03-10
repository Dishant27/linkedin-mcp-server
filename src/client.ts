import LinkedInAuth from './auth';
import axios from 'axios';

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

class LinkedInClient {
  private auth: LinkedInAuth;
  private baseUrl = 'https://api.linkedin.com/v2';

  constructor(auth: LinkedInAuth) {
    this.auth = auth;
  }

  private async makeRequest(method: 'get' | 'post', endpoint: string, data?: any) {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.auth.getAccessToken()}`,
          'Content-Type': 'application/json',
          'x-li-format': 'json'
        },
        data
      });
      return response.data;
    } catch (error: any) {
      console.error('LinkedIn API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async searchPeople(params: SearchPeopleParams) {
    const queryParams = new URLSearchParams();
    
    if (params.keywords) queryParams.append('keywords', params.keywords);
    if (params.currentCompany) {
      params.currentCompany.forEach(company => 
        queryParams.append('currentCompany', company)
      );
    }
    if (params.industries) {
      params.industries.forEach(industry => 
        queryParams.append('industries', industry)
      );
    }
    if (params.location) queryParams.append('location', params.location);

    return this.makeRequest('get', `/people?${queryParams.toString()}`);
  }

  async getProfile(params: GetProfileParams) {
    if (!params.publicId && !params.urnId) {
      throw new Error('Either publicId or urnId must be provided');
    }

    const identifier = params.publicId 
      ? `id=${params.publicId}` 
      : `urn=${params.urnId}`;

    return this.makeRequest('get', `/people/${identifier}`);
  }

  async searchJobs(params: SearchJobsParams) {
    const queryParams = new URLSearchParams();
    
    if (params.keywords) queryParams.append('keywords', params.keywords);
    if (params.companies) {
      params.companies.forEach(company => 
        queryParams.append('companies', company)
      );
    }
    if (params.location) queryParams.append('location', params.location);
    if (params.jobType) {
      params.jobType.forEach(type => 
        queryParams.append('jobType', type)
      );
    }

    return this.makeRequest('get', `/jobs?${queryParams.toString()}`);
  }

  async sendMessage(params: SendMessageParams) {
    return this.makeRequest('post', '/messages', {
      recipientUrn: params.recipientUrn,
      body: params.messageBody
    });
  }
}

export default LinkedInClient;