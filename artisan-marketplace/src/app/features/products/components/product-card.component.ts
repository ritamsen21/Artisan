import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models';
import { CartStoreService } from '../../../core/services';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div style="background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; transition: all 0.3s; height: 100%;">
      <!-- Product Image -->
      <a [routerLink]="['/products', product().id]" style="display: block; position: relative; overflow: hidden; aspect-ratio: 1; cursor: pointer;">
        <img 
          [src]="product().images[0]" 
          [alt]="product().title"
          style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;"
          (error)="onImageError($event)"
          onmouseover="this.style.transform='scale(1.05)'"
          onmouseout="this.style.transform='scale(1)'"
        />
        @if (isInCart()) {
          <div style="position: absolute; top: 12px; right: 12px; background: #10b981; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; box-shadow: 0 2px 8px rgba(16,185,129,0.4);">
            ✓ In Cart
          </div>
        }
      </a>

      <!-- Product Info -->
      <div style="padding: 20px;">
        <a [routerLink]="['/products', product().id]" style="text-decoration: none;">
          <h3 style="font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 8px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.3s;"
              onmouseover="this.style.color='#5547d4'"
              onmouseout="this.style.color='#1f2937'">
            {{ product().title }}
          </h3>
        </a>
        
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 16px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          {{ product().description }}
        </p>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <span style="font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #5547d4 0%, #6338a8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            {{ product().price | currency }}
          </span>
          
          <button
            (click)="addToCart()"
            [disabled]="isInCart()"
            style="padding: 10px 20px; background: linear-gradient(135deg, #5547d4 0%, #6338a8 100%); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 12px rgba(85,71,212,0.3);"
            [style.opacity]="isInCart() ? '0.5' : '1'"
            [style.cursor]="isInCart() ? 'not-allowed' : 'pointer'"
            onmouseover="if(!this.disabled) { this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(85,71,212,0.4)' }"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(85,71,212,0.3)'"
          >
            @if (isInCart()) {
              ✓ Added
            } @else {
              🛒 Add to Cart
            }
          </button>
        </div>

        <!-- Category Badge -->
        <div style="padding-top: 12px; border-top: 1px solid #f3f4f6;">
          <span style="display: inline-block; padding: 6px 12px; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); color: #374151; font-size: 12px; font-weight: 600; border-radius: 16px;">
            📁 {{ product().category.name }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class ProductCardComponent {
  product = input.required<Product>();
  private cartStore = inject(CartStoreService);

  isInCart(): boolean {
    return this.cartStore.isInCart(this.product().id);
  }

  addToCart(): void {
    if (!this.isInCart()) {
      this.cartStore.addToCart(this.product(), 1);
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/400x400?text=No+Image';
  }
}
