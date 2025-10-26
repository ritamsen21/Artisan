import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartStoreService, AuthStoreService } from '../../core/services';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header style="background: linear-gradient(135deg, #5547d4 0%, #6338a8 100%); box-shadow: 0 4px 20px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000;">
      <nav style="max-width: 1200px; margin: 0 auto; padding: 20px 40px; display: flex; align-items: center; justify-content: space-between;">
        <!-- Logo -->
        <a routerLink="/" style="font-size: 28px; font-weight: 800; color: white; text-decoration: none; display: flex; align-items: center; gap: 10px;">
          🎨 <span>Artisan</span>
        </a>

        <!-- Navigation Links -->
        <div style="display: flex; align-items: center; gap: 40px;">
          <a 
            routerLink="/products" 
            routerLinkActive="active-link"
            style="color: rgba(255,255,255,0.9); text-decoration: none; font-weight: 600; font-size: 16px; transition: all 0.3s; padding: 8px 16px; border-radius: 8px;"
            onmouseover="this.style.background='rgba(255,255,255,0.2)'; this.style.color='white'"
            onmouseout="this.style.background='transparent'; this.style.color='rgba(255,255,255,0.9)'"
          >
            Products
          </a>
          <a 
            routerLink="/categories" 
            routerLinkActive="active-link"
            style="color: rgba(255,255,255,0.9); text-decoration: none; font-weight: 600; font-size: 16px; transition: all 0.3s; padding: 8px 16px; border-radius: 8px;"
            onmouseover="this.style.background='rgba(255,255,255,0.2)'; this.style.color='white'"
            onmouseout="this.style.background='transparent'; this.style.color='rgba(255,255,255,0.9)'"
          >
            Categories
          </a>
        </div>

        <!-- Right Side: Cart & Auth -->
        <div style="display: flex; align-items: center; gap: 20px;">
          <!-- Cart Icon with Badge -->
          <a 
            routerLink="/cart" 
            style="position: relative; color: white; text-decoration: none; transition: all 0.3s;"
            title="Shopping Cart"
          >
            <svg 
              style="width: 28px; height: 28px;" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            @if (cartStore.totalItems() > 0) {
              <span 
                style="position: absolute; top: -8px; right: -8px; background: #ff4757; color: white; font-size: 12px; font-weight: 700; border-radius: 50%; height: 22px; width: 22px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"
              >
                {{ cartStore.totalItems() }}
              </span>
            }
          </a>

          <!-- User Menu -->
          @if (authStore.isAuthenticated()) {
            <div style="display: flex; align-items: center; gap: 15px;">
              <span style="color: white; font-weight: 600;">
                {{ authStore.user()?.name }}
              </span>
              <button
                (click)="logout()"
                style="padding: 8px 20px; background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s;"
                onmouseover="this.style.background='rgba(255,255,255,0.3)'"
                onmouseout="this.style.background='rgba(255,255,255,0.2)'"
              >
                Logout
              </button>
            </div>
          } @else {
            <a 
              routerLink="/auth/login"
              style="padding: 10px 24px; background: white; color: #667eea; border-radius: 25px; text-decoration: none; font-weight: 700; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.2);"
              onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.3)'"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.2)'"
            >
              Login
            </a>
          }
        </div>
      </nav>
    </header>
  `,
  styles: ``
})
export class HeaderComponent {
  cartStore = inject(CartStoreService);
  authStore = inject(AuthStoreService);

  logout(): void {
    this.authStore.logout();
  }
}
