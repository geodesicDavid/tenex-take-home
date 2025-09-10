import { User } from './auth';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  accessToken: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: Date | string;
  end: Date | string;
  description?: string | null;
}

export interface CalendarEventResponse {
  events: CalendarEvent[];
  total_count: number;
  time_range: string;
}
