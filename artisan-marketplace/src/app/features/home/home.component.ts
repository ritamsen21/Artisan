import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  template: `
    <div style="min-height: 100vh; background: linear-gradient(135deg, #5547d4 0%, #6338a8 100%); padding: 60px 20px;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <!-- Hero Section -->
        <div style="text-align: center; margin-bottom: 80px;">
          <h1 style="font-size: 56px; font-weight: 800; color: white; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
            🎨 Artisan Marketplace
          </h1>
          <p style="font-size: 24px; color: rgba(255,255,255,0.95); margin-bottom: 40px; font-weight: 300;">
            Discover Unique, Handcrafted Products from Talented Artisans
          </p>
          
          <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
            <a 
              routerLink="/products"
              style="padding: 18px 40px; background: white; color: #5547d4; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: all 0.3s; display: inline-block;"
              onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 15px 40px rgba(0,0,0,0.3)'"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.2)'"
            >
              🛍️ Shop Now
            </a>
            <a 
              routerLink="/auth/login"
              style="padding: 18px 40px; background: transparent; color: white; border: 3px solid white; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 18px; transition: all 0.3s; display: inline-block;"
              onmouseover="this.style.background='white'; this.style.color='#667eea'"
              onmouseout="this.style.background='transparent'; this.style.color='white'"
            >
              👤 Sign In
            </a>
          </div>
        </div>

        <!-- Features Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 60px;">
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); transition: all 0.3s;">
            <div style="font-size: 48px; margin-bottom: 20px;">⚡</div>
            <h3 style="font-size: 24px; font-weight: 700; color: #333; margin-bottom: 12px;">Lightning Fast</h3>
            <p style="color: #666; line-height: 1.6;">Built with Angular 19 and optimized for performance</p>
          </div>

          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); transition: all 0.3s;">
            <div style="font-size: 48px; margin-bottom: 20px;">🎯</div>
            <h3 style="font-size: 24px; font-weight: 700; color: #333; margin-bottom: 12px;">Smart Filtering</h3>
            <p style="color: #666; line-height: 1.6;">Find exactly what you need with advanced search</p>
          </div>

          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); transition: all 0.3s;">
            <div style="font-size: 48px; margin-bottom: 20px;">�</div>
            <h3 style="font-size: 24px; font-weight: 700; color: #333; margin-bottom: 12px;">Easy Shopping</h3>
            <p style="color: #666; line-height: 1.6;">Seamless cart experience with real-time updates</p>
          </div>
        </div>

        <!-- Stats Section -->
        <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 50px; border-radius: 20px; border: 2px solid rgba(255,255,255,0.2);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; text-align: center;">
            <div>
              <div style="font-size: 48px; font-weight: 800; color: white; margin-bottom: 10px;">500+</div>
              <div style="font-size: 18px; color: rgba(255,255,255,0.9);">Products</div>
            </div>
            <div>
              <div style="font-size: 48px; font-weight: 800; color: white; margin-bottom: 10px;">50+</div>
              <div style="font-size: 18px; color: rgba(255,255,255,0.9);">Categories</div>
            </div>
            <div>
              <div style="font-size: 48px; font-weight: 800; color: white; margin-bottom: 10px;">1000+</div>
              <div style="font-size: 18px; color: rgba(255,255,255,0.9);">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class HomeComponent {}
