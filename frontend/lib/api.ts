import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const AUTH_HEADER = 'Authorization';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private extractUserIdFromToken(token: string): string | null {
    try {
      // Split the JWT token and decode the payload
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        // Add padding if needed
        let payload = tokenParts[1];
        while (payload.length % 4) {
          payload += '=';
        }

        const decodedPayload = atob(payload);
        const payloadObj = JSON.parse(decodedPayload);

        // Return the user ID from the 'sub' claim or 'userId' field
        return payloadObj.userId || payloadObj.sub || null;
      }
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
    }

    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get Better Auth token - it should be available through the auth context
    // but we'll also check localStorage as fallback
    const betterAuthToken = localStorage.getItem('better-auth.session_token');

    // Only add Authorization header if we have a token
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (betterAuthToken) {
      headers['Authorization'] = `Bearer ${betterAuthToken}`;
    }

    // Extract user ID from the Better Auth token for backend user isolation
    let currentUserId = 'dev-user-id';

    if (betterAuthToken) {
      // Extract user ID from Better Auth token
      try {
        const tokenParts = betterAuthToken.split('.');
        if (tokenParts.length === 3) {
          // Add padding if needed
          let payload = tokenParts[1];
          while (payload.length % 4) {
            payload += '=';
          }

          const decodedPayload = atob(payload);
          const payloadObj = JSON.parse(decodedPayload);
          currentUserId = payloadObj.userId || payloadObj.sub || payloadObj.user_id || 'dev-user-id';
        }
      } catch (error) {
        console.error('Error extracting user ID from Better Auth token:', error);
        // If we can't extract from token, try to get from localStorage
        currentUserId = localStorage.getItem('current_user_id') || 'dev-user-id';
      }
    } else {
      // Fallback to stored user ID if no token is available
      currentUserId = localStorage.getItem('current_user_id') || 'dev-user-id';
    }

    // Send the user ID in the header (needed for backend user isolation)
    headers['X-Mock-User-ID'] = currentUserId;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // For successful responses, we might get JSON data
      let responseData = null;

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json') && response.status !== 204) {
        responseData = await response.json();
      } else if (response.status !== 204) {
        // For non-JSON responses, try to get text
        const responseText = await response.text();
        if (responseText) {
          try {
            responseData = JSON.parse(responseText);
          } catch {
            // If it's not JSON, return as text or null
            responseData = responseText || null;
          }
        }
      }

      if (!response.ok) {
        // Try to get error message from response
        const errorMessage = responseData?.message || responseData?.detail || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return {
        data: responseData,
        status: response.status,
        message: 'Success'
      };
    } catch (error: any) {
      console.error(`API request failed: ${endpoint}`, error);
      // If it's a network error (fetch failed completely)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the backend is running.');
      }
      throw new Error(error.message || 'Network error occurred');
    }
  }

  // Task-related methods
  async getTasks(userId: string, status?: 'all' | 'pending' | 'completed', sort?: 'created' | 'title'): Promise<ApiResponse<Task[]>> {
    if (!userId || userId === 'undefined') {
      throw new Error('User ID is required and cannot be undefined');
    }

    let endpoint = `/api/${userId}/tasks`;
    const params = new URLSearchParams();

    if (status && status !== 'all') {
      params.append('status', status);
    }
    if (sort) {
      params.append('sort', sort);
    }

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    return this.request<Task[]>(endpoint, {
      method: 'GET',
    });
  }

  async createTask(userId: string, taskData: CreateTaskRequest): Promise<ApiResponse<Task>> {
    if (!userId || userId === 'undefined') {
      throw new Error('User ID is required and cannot be undefined');
    }

    return this.request<Task>(`/api/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async getTask(userId: string, taskId: string): Promise<ApiResponse<Task>> {
    if (!userId || userId === 'undefined') {
      throw new Error('User ID is required and cannot be undefined');
    }

    return this.request<Task>(`/api/${userId}/tasks/${taskId}`, {
      method: 'GET',
    });
  }

  async updateTask(userId: string, taskId: string, taskData: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    if (!userId || userId === 'undefined') {
      throw new Error('User ID is required and cannot be undefined');
    }

    return this.request<Task>(`/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(userId: string, taskId: string): Promise<ApiResponse<void>> {
    if (!userId || userId === 'undefined') {
      throw new Error('User ID is required and cannot be undefined');
    }

    return this.request<void>(`/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async toggleTaskCompletion(userId: string, taskId: string): Promise<ApiResponse<Task>> {
    if (!userId || userId === 'undefined') {
      throw new Error('User ID is required and cannot be undefined');
    }

    return this.request<Task>(`/api/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
    });
  }
}

export const apiClient = new ApiClient();