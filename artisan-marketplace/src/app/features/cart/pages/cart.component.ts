import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartStoreService } from '../../../core/services';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div style="min-height: calc(100vh - 140px); background: linear-gradient(to bottom, #f8f9ff 0%, #ffffff 100%); padding: 40px 20px;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h1 style="font-size: 48px; font-weight: 800; background: linear-gradient(135deg, #5547d4 0%, #6338a8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 40px; text-align: center;">
          🛒 Shopping Cart
        </h1>

        @if (cartStore.isEmpty()) {
          <!-- Empty Cart -->
          <div style="background: white; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); padding: 80px 40px; text-align: center;">
            <div style="font-size: 100px; margin-bottom: 24px;">🛒</div>
            <h3 style="font-size: 32px; font-weight: 700; color: #1f2937; margin-bottom: 16px;">Your cart is empty</h3>
            <p style="font-size: 18px; color: #6b7280; margin-bottom: 32px;">Discover amazing products and start shopping!</p>
            <a 
              routerLink="/products"
              style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #5547d4 0%, #6338a8 100%); color: white; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 18px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(85,71,212,0.4);"
              onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(85,71,212,0.6)'"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(85,71,212,0.4)'"
            >
              🛍️ Browse Products
            </a>
          </div>
        } @else {
          <div style="display: grid; grid-template-columns: 1fr 400px; gap: 32px;">
            <!-- Cart Items -->
            <div style="display: flex; flex-direction: column; gap: 20px;">
              @for (item of cartStore.items(); track item.product.id) {
                <div style="background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 24px; display: flex; gap: 24px; align-items: center;">
                  <!-- Product Image -->
                  <a [routerLink]="['/products', item.product.id]" style="flex-shrink: 0;">
                    <img 
                      [src]="item.product.images[0]" 
                      [alt]="item.product.title"
                      style="width: 120px; height: 120px; object-fit: cover; border-radius: 12px; transition: transform 0.3s;"
                      (error)="onImageError($event)"
                      onmouseover="this.style.transform='scale(1.05)'"
                      onmouseout="this.style.transform='scale(1)'"
                    />
                  </a>

                  <!-- Product Details -->
                  <div style="flex: 1;">
                    <a [routerLink]="['/products', item.product.id]" style="text-decoration: none;">
                      <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 8px; transition: color 0.3s;"
                          onmouseover="this.style.color='#5547d4'"
                          onmouseout="this.style.color='#1f2937'">
                        {{ item.product.title }}
                      </h3>
                    </a>
                    <p style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">📁 {{ item.product.category.name }}</p>
                    <p style="font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #5547d4 0%, #6338a8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                      {{ item.product.price | currency }}
                    </p>
                  </div>

                  <!-- Quantity Controls -->
                  <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 16px;">
                    <button
                      (click)="removeFromCart(item.product.id)"
                      style="color: #dc2626; font-size: 14px; font-weight: 600; background: none; border: none; cursor: pointer; transition: color 0.3s;"
                      onmouseover="this.style.color='#991b1b'"
                      onmouseout="this.style.color='#dc2626'"
                    >
                      🗑️ Remove
                    </button>

                    <div style="display: flex; align-items: center; gap: 12px; background: #f3f4f6; border-radius: 12px; padding: 8px;">
                      <button
                        (click)="decrementQuantity(item.product.id)"
                        style="width: 36px; height: 36px; background: white; border: none; border-radius: 8px; font-size: 20px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                        onmouseover="this.style.background='#5547d4'; this.style.color='white'"
                        onmouseout="this.style.background='white'; this.style.color='black'"
                      >
                        −
                      </button>
                      <span style="font-size: 20px; font-weight: 700; width: 40px; text-align: center;">{{ item.quantity }}</span>
                      <button
                        (click)="incrementQuantity(item.product.id)"
                        style="width: 36px; height: 36px; background: white; border: none; border-radius: 8px; font-size: 20px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                        onmouseover="this.style.background='#5547d4'; this.style.color='white'"
                        onmouseout="this.style.background='white'; this.style.color='black'"
                      >
                        +
                      </button>
                    </div>

                    <p style="font-size: 14px; color: #6b7280; font-weight: 600;">
                      Subtotal: <span style="color: #1f2937; font-weight: 700;">{{ item.product.price * item.quantity | currency }}</span>
                    </p>
                  </div>
                </div>
              }
            </div>

            <!-- Order Summary -->
            <div>
              <div style="background: white; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); padding: 32px; position: sticky; top: 100px;">
                <h2 style="font-size: 28px; font-weight: 800; color: #1f2937; margin-bottom: 24px;">💰 Order Summary</h2>

                <div style="margin-bottom: 24px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 16px; color: #6b7280;">
                    <span>Items ({{ cartStore.totalItems() }})</span>
                    <span style="font-weight: 600;">{{ cartStore.totalPrice() | currency }}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 16px; color: #6b7280;">
                    <span>Shipping</span>
                    <span style="color: #10b981; font-weight: 700;">FREE 🎉</span>
                  </div>
                  <div style="border-top: 2px solid #e5e7eb; padding-top: 16px; display: flex; justify-content: space-between; font-size: 24px; font-weight: 800;">
                    <span style="color: #1f2937;">Total</span>
                    <span style="background: linear-gradient(135deg, #5547d4 0%, #6338a8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">{{ cartStore.totalPrice() | currency }}</span>
                  </div>
                </div>

                <button
                  (click)="checkout()"
                  style="width: 100%; padding: 16px; background: linear-gradient(135deg, #5547d4 0%, #6338a8 100%); color: white; border: none; border-radius: 12px; font-size: 18px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(85,71,212,0.4); margin-bottom: 12px;"
                  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(85,71,212,0.6)'"
                  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(85,71,212,0.4)'"
                >
                  🔐 Proceed to Checkout
                </button>

                <a
                  routerLink="/products"
                  style="display: block; width: 100%; padding: 14px; background: white; border: 2px solid #5547d4; color: #5547d4; border-radius: 12px; font-size: 16px; font-weight: 700; text-align: center; text-decoration: none; transition: all 0.3s; margin-bottom: 16px;"
                  onmouseover="this.style.background='#f8f9ff'"
                  onmouseout="this.style.background='white'"
                >
                  ← Continue Shopping
                </a>

                <button
                  (click)="clearCart()"
                  style="width: 100%; padding: 12px; background: none; border: none; color: #dc2626; font-size: 14px; font-weight: 700; cursor: pointer; transition: color 0.3s;"
                  onmouseover="this.style.color='#991b1b'"
                  onmouseout="this.style.color='#dc2626'"
                >
                  🗑️ Clear Cart
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: ``
})
export class CartComponent {
  cartStore = inject(CartStoreService);

  incrementQuantity(productId: number): void {
    this.cartStore.incrementQuantity(productId);
  }

  decrementQuantity(productId: number): void {
    this.cartStore.decrementQuantity(productId);
  }

  removeFromCart(productId: number): void {
    this.cartStore.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartStore.clearCart();
    }
  }

  checkout(): void {
    alert('Checkout functionality will be implemented in a future update!');
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/96x96?text=No+Image';
  }
}
