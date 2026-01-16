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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get token from localStorage (from our auth client)
    const token = localStorage.getItem('auth_token');

    // Only add Authorization header if we have a token
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // For development, we'll send the mock user ID header for all requests
    // This allows the backend to bypass authentication in development mode
    headers['X-Mock-User-ID'] = localStorage.getItem('current_user_id') || 'dev-user-id';

    // Still send the token in case we want to test real authentication
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

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