import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService, CartStoreService } from '../../../core/services';
import { Product } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-8">
        <!-- Loading State -->
        @if (loading()) {
          <app-loading-spinner [size]="50" [padding]="16" message="Loading product details..." />
        }

        <!-- Error State -->
        @if (error()) {
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
            <p class="text-red-800 font-semibold mb-4">{{ error() }}</p>
            <a 
              routerLink="/products"
              class="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Products
            </a>
          </div>
        }

        <!-- Product Detail -->
        @if (!loading() && !error() && product()) {
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <!-- Breadcrumb -->
            <div class="bg-gray-100 px-6 py-3">
              <nav class="text-sm">
                <a routerLink="/" class="text-indigo-600 hover:text-indigo-700">Home</a>
                <span class="mx-2 text-gray-500">/</span>
                <a routerLink="/products" class="text-indigo-600 hover:text-indigo-700">Products</a>
                <span class="mx-2 text-gray-500">/</span>
                <span class="text-gray-700">{{ product()!.title }}</span>
              </nav>
            </div>

            <div class="grid md:grid-cols-2 gap-8 p-8">
              <!-- Image Gallery -->
              <div>
                <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <img 
                    [src]="selectedImage()" 
                    [alt]="product()!.title"
                    class="w-full h-full object-cover"
                    (error)="onImageError($event)"
                  />
                </div>
                
                <!-- Thumbnail Gallery -->
                @if (product()!.images.length > 1) {
                  <div class="grid grid-cols-4 gap-2">
                    @for (image of product()!.images; track $index) {
                      <button
                        (click)="selectImage(image)"
                        class="aspect-square rounded-lg overflow-hidden border-2 hover:border-indigo-600 transition-colors"
                        [class.border-indigo-600]="selectedImage() === image"
                        [class.border-gray-200]="selectedImage() !== image"
                      >
                        <img 
                          [src]="image" 
                          [alt]="'Thumbnail ' + $index"
                          class="w-full h-full object-cover"
                        />
                      </button>
                    }
                  </div>
                }
              </div>

              <!-- Product Info -->
              <div>
                <div class="mb-4">
                  <span class="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                    {{ product()!.category.name }}
                  </span>
                </div>

                <h1 class="text-3xl font-bold text-gray-900 mb-4">
                  {{ product()!.title }}
                </h1>

                <p class="text-gray-600 mb-6 leading-relaxed">
                  {{ product()!.description }}
                </p>

                <div class="mb-6 pb-6 border-b border-gray-200">
                  <div class="flex items-baseline gap-3">
                    <span class="text-4xl font-bold text-indigo-600">
                      {{ product()!.price | currency }}
                    </span>
                  </div>
                </div>

                <!-- Quantity Selector -->
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div class="flex items-center gap-3">
                    <button
                      (click)="decrementQuantity()"
                      class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
                      [disabled]="quantity() <= 1"
                    >
                      -
                    </button>
                    <span class="text-xl font-semibold w-12 text-center">{{ quantity() }}</span>
                    <button
                      (click)="incrementQuantity()"
                      class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <!-- Add to Cart Button -->
                <button
                  (click)="addToCart()"
                  class="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg mb-4"
                >
                  @if (isInCart()) {
                    ✓ Update Cart
                  } @else {
                    Add to Cart
                  }
                </button>

                <a
                  routerLink="/cart"
                  class="block w-full px-6 py-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold text-lg text-center"
                >
                  View Cart
                </a>

                <!-- Product Meta -->
                <div class="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                  <p><strong>Product ID:</strong> {{ product()!.id }}</p>
                  <p><strong>Created:</strong> {{ product()!.creationAt | date }}</p>
                  <p><strong>Updated:</strong> {{ product()!.updatedAt | date }}</p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: ``
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private cartStore = inject(CartStoreService);

  product = signal<Product | null>(null);
  selectedImage = signal<string>('');
  quantity = signal<number>(1);
  loading = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    } else {
      this.error.set('Invalid product ID');
      this.loading.set(false);
    }
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.apiService.getProduct(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.selectedImage.set(product.images[0]);
        
        // Set quantity to current cart quantity if product is already in cart
        const currentQuantity = this.cartStore.getProductQuantity(product.id);
        if (currentQuantity > 0) {
          this.quantity.set(currentQuantity);
        }
        
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load product');
        this.loading.set(false);
      }
    });
  }

  selectImage(image: string): void {
    this.selectedImage.set(image);
  }

  incrementQuantity(): void {
    this.quantity.update(q => q + 1);
  }

  decrementQuantity(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  isInCart(): boolean {
    return this.product() ? this.cartStore.isInCart(this.product()!.id) : false;
  }

  addToCart(): void {
    const prod = this.product();
    if (prod) {
      if (this.isInCart()) {
        // Update quantity
        this.cartStore.updateQuantity(prod.id, this.quantity());
      } else {
        // Add to cart
        this.cartStore.addToCart(prod, this.quantity());
      }
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/600x600?text=No+Image';
  }
}
