import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState, User, LoginResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private router = inject(Router);

  // Private signals for auth state
  private userSignal = signal<User | null>(null);
  private accessTokenSignal = signal<string | null>(null);
  private refreshTokenSignal = signal<string | null>(null);

  // Public readonly signals
  readonly user = this.userSignal.asReadonly();
  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly refreshToken = this.refreshTokenSignal.asReadonly();
  
  // Computed signals
  readonly isAuthenticated = computed(() => 
    this.accessTokenSignal() !== null && this.userSignal() !== null
  );

  readonly authState = computed<AuthState>(() => ({
    user: this.userSignal(),
    accessToken: this.accessTokenSignal(),
    refreshToken: this.refreshTokenSignal(),
    isAuthenticated: this.isAuthenticated()
  }));

  readonly isAdmin = computed(() => this.userSignal()?.role === 'admin');
  readonly isCustomer = computed(() => this.userSignal()?.role === 'customer');

  constructor() {
    // Load auth state from localStorage on initialization
    this.loadAuthFromStorage();
  }

  /**
   * Set authentication tokens and user data after successful login
   */
  setAuth(loginResponse: LoginResponse, user: User): void {
    this.accessTokenSignal.set(loginResponse.access_token);
    this.refreshTokenSignal.set(loginResponse.refresh_token);
    this.userSignal.set(user);
    this.saveAuthToStorage();
  }

  /**
   * Update user profile data
   */
  setUser(user: User): void {
    this.userSignal.set(user);
    this.saveAuthToStorage();
  }

  /**
   * Update access token (for token refresh)
   */
  updateAccessToken(accessToken: string): void {
    this.accessTokenSignal.set(accessToken);
    this.saveAuthToStorage();
  }

  /**
   * Clear all authentication data (logout)
   */
  clearAuth(): void {
    this.userSignal.set(null);
    this.accessTokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    this.clearAuthFromStorage();
  }

  /**
   * Logout user and redirect to login page
   */
  logout(): void {
    this.clearAuth();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Save auth state to localStorage
   */
  private saveAuthToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const authData = {
        user: this.userSignal(),
        accessToken: this.accessTokenSignal(),
        refreshToken: this.refreshTokenSignal()
      };
      localStorage.setItem('auth', JSON.stringify(authData));
    }
  }

  /**
   * Load auth state from localStorage
   */
  private loadAuthFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedAuth = localStorage.getItem('auth');
      if (savedAuth) {
        try {
          const authData = JSON.parse(savedAuth);
          this.userSignal.set(authData.user);
          this.accessTokenSignal.set(authData.accessToken);
          this.refreshTokenSignal.set(authData.refreshToken);
        } catch (error) {
          console.error('Failed to load auth from storage:', error);
          this.clearAuthFromStorage();
        }
      }
    }
  }

  /**
   * Clear auth data from localStorage
   */
  private clearAuthFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth');
    }
  }
}
