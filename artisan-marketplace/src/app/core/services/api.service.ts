import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Product, 
  Category, 
  User, 
  LoginRequest, 
  LoginResponse,
  ProductFilters 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://api.escuelajs.co/api/v1';

  // ========== Products ==========
  
  /**
   * Get all products with optional filters
   */
  getProducts(filters?: ProductFilters): Observable<Product[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.title) params = params.set('title', filters.title);
      if (filters.price_min) params = params.set('price_min', filters.price_min.toString());
      if (filters.price_max) params = params.set('price_max', filters.price_max.toString());
      if (filters.categoryId) params = params.set('categoryId', filters.categoryId.toString());
      if (filters.offset !== undefined) params = params.set('offset', filters.offset.toString());
      if (filters.limit !== undefined) params = params.set('limit', filters.limit.toString());
    }
    
    return this.http.get<Product[]>(`${this.API_URL}/products`, { params });
  }

  /**
   * Get a single product by ID
   */
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(categoryId: number, limit?: number, offset?: number): Observable<Product[]> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit.toString());
    if (offset) params = params.set('offset', offset.toString());
    
    return this.http.get<Product[]>(`${this.API_URL}/categories/${categoryId}/products`, { params });
  }

  // ========== Categories ==========
  
  /**
   * Get all categories
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/categories`);
  }

  /**
   * Get a single category by ID
   */
  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/categories/${id}`);
  }

  // ========== Authentication ==========
  
  /**
   * Login with email and password
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials);
  }

  /**
   * Get the current user profile (requires authentication)
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/profile`);
  }

  /**
   * Refresh access token
   */
  refreshToken(refreshToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/refresh-token`, {
      refreshToken
    });
  }

  // ========== Users ==========
  
  /**
   * Get all users (for admin purposes)
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users`);
  }

  /**
   * Get a single user by ID
   */
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${id}`);
  }

  /**
   * Check if email is available
   */
  isEmailAvailable(email: string): Observable<{ isAvailable: boolean }> {
    return this.http.post<{ isAvailable: boolean }>(`${this.API_URL}/users/is-available`, {
      email
    });
  }
}
