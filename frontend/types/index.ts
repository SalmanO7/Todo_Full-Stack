export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface Task {
  id: number; // Backend uses integer IDs
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface Session {
  token: string;
  expiresAt: string; // ISO date
  userId: string;
  createdAt: string; // ISO date
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}