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
  start_time: Date | string;
  end_time: Date | string;
  description?: string | null;
  location?: string | null;
  attendees?: Array<{
    email: string;
    displayName?: string;
    self?: boolean;
    responseStatus?: string;
  }>;
}

export interface CalendarEventResponse {
  events: CalendarEvent[];
  total_count: number;
  time_range: string;
}
