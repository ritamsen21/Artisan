import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, AuthStoreService } from '../../../core/services';
import { User } from '../../../core/models';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div style="min-height: 100vh; background: linear-gradient(135deg, #5547d4 0%, #6338a8 100%); display: flex; align-items: center; justify-content: center; padding: 40px 20px;">
      <div style="max-width: 480px; width: 100%;">
        <!-- Logo/Title -->
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 48px; font-weight: 800; color: white; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
            🎨 Artisan
          </h1>
          <p style="font-size: 18px; color: rgba(255,255,255,0.9);">Sign in to your account</p>
        </div>

        <!-- Login Card -->
        <div style="background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); padding: 40px;">
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <!-- Email Field -->
            <div style="margin-bottom: 24px;">
              <label for="email" style="display: block; font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px;">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="email"
                required
                email
                style="width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 16px; transition: all 0.3s;"
                placeholder="ritam@artisan.com"
                [disabled]="loading()"
                onfocus="this.style.borderColor='#5547d4'; this.style.boxShadow='0 0 0 3px rgba(85,71,212,0.1)'"
                onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'"
              />
            </div>

            <!-- Password Field -->
            <div style="margin-bottom: 24px;">
              <label for="password" style="display: block; font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px;">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="password"
                required
                minlength="4"
                style="width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 16px; transition: all 0.3s;"
                placeholder="••••••••"
                [disabled]="loading()"
                onfocus="this.style.borderColor='#5547d4'; this.style.boxShadow='0 0 0 3px rgba(85,71,212,0.1)'"
                onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'"
              />
            </div>

            <!-- Error Message -->
            @if (error()) {
              <div style="margin-bottom: 24px; padding: 16px; background: #fee; border: 2px solid #fcc; border-radius: 10px;">
                <p style="font-size: 14px; color: #c33; margin: 0;">{{ error() }}</p>
              </div>
            }

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="!loginForm.valid || loading()"
              style="width: 100%; padding: 16px; background: linear-gradient(135deg, #5547d4 0%, #6338a8 100%); color: white; border: none; border-radius: 12px; font-size: 18px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(85,71,212,0.4);"
              [style.opacity]="!loginForm.valid || loading() ? '0.6' : '1'"
              [style.cursor]="!loginForm.valid || loading() ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled) { this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(85,71,212,0.6)' }"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(85,71,212,0.4)'"
            >
              @if (loading()) {
                <span style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                  <span style="display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;"></span>
                  Signing In...
                </span>
              } @else {
                🔐 Sign In
              }
            </button>
          </form>

          <!-- Demo Credentials -->
          <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #f0f0f0;">
            <p style="font-size: 14px; color: #666; margin-bottom: 12px; font-weight: 600;">💡 Demo Credentials for Ritam:</p>
            <div style="background: #f8f9ff; border-radius: 10px; padding: 16px; font-size: 14px;">
              <p style="color: #333; margin-bottom: 12px; line-height: 1.6;">
                <strong>Email:</strong> ritam&#64;artisan.com<br>
                <strong>Password:</strong> ritam123
              </p>
              <button
                type="button"
                (click)="fillDemoCredentials()"
                style="padding: 8px 16px; background: #5547d4; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s;"
                onmouseover="this.style.background='#6338a8'"
                onmouseout="this.style.background='#5547d4'"
              >
                ⚡ Use Demo Credentials
              </button>
            </div>
          </div>
        </div>

        <!-- Back to Home -->
        <div style="text-align: center; margin-top: 24px;">
          <a 
            routerLink="/"
            style="color: white; text-decoration: none; font-weight: 600; font-size: 16px; transition: all 0.3s;"
            onmouseover="this.style.textDecoration='underline'"
            onmouseout="this.style.textDecoration='none'"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>

    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `,
  styles: ``
})
export class LoginComponent {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private authStore = inject(AuthStoreService);

  email = '';
  password = '';
  loading = signal<boolean>(false);
  error = signal<string>('');

  fillDemoCredentials(): void {
    // Using API credentials (john@mail.com) but displayed as ritam@artisan.com
    this.email = 'john@mail.com';
    this.password = 'changeme';
  }

  onSubmit(): void {
    this.loading.set(true);
    this.error.set('');

    this.apiService.login({ email: this.email, password: this.password }).subscribe({
      next: (loginResponse) => {
        console.log('Login successful:', loginResponse);
        // Get user profile
        this.apiService.getProfile().subscribe({
          next: (user) => {
            console.log('User profile fetched:', user);
            this.authStore.setAuth(loginResponse, user);
            this.loading.set(false);
            this.router.navigate(['/products']);
          },
          error: (err) => {
            console.error('Profile fetch error:', err);
            // If profile fetch fails, try to login anyway with basic user data
            const basicUser: User = {
              id: 0,
              email: this.email,
              password: '',
              name: 'Ritam',
              role: 'customer',
              avatar: '',
              creationAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            this.authStore.setAuth(loginResponse, basicUser);
            this.loading.set(false);
            this.router.navigate(['/products']);
          }
        });
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error.set(err.error?.message || err.message || 'Invalid email or password. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
