export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
  avatar: string;
  creationAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}
