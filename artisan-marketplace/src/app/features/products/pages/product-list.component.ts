import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService, FilterStoreService } from '../../../core/services';
import { Product } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components';
import { ProductCardComponent } from '../../../features/products/components/product-card.component';
import { ProductFiltersComponent } from '../../../features/products/components/product-filters.component';

@Component({
  selector: 'app-product-list',
  imports: [LoadingSpinnerComponent, ProductCardComponent, ProductFiltersComponent],
  template: `
    <div style="min-height: calc(100vh - 80px); background: linear-gradient(to bottom, #f8f9ff 0%, #ffffff 100%); padding: 40px 20px;">
      <div style="max-width: 1400px; margin: 0 auto;">
        <!-- Header -->
        <div style="margin-bottom: 40px; text-align: center;">
          <h1 style="font-size: 48px; font-weight: 800; background: linear-gradient(135deg, #5547d4 0%, #6338a8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px;">
            🛍️ Our Products
          </h1>
          <p style="font-size: 18px; color: #6b7280;">Discover our amazing collection of handcrafted items</p>
        </div>

        <!-- Filters -->
        <app-product-filters />

        <!-- Loading State -->
        @if (loading()) {
          <app-loading-spinner [size]="50" [padding]="16" message="Loading products..." />
        }

        <!-- Error State -->
        @if (error()) {
          <div style="background: #fef2f2; border: 2px solid #fecaca; border-radius: 16px; padding: 32px; text-align: center; margin-top: 40px;">
            <p style="color: #991b1b; font-weight: 700; font-size: 18px; margin-bottom: 16px;">{{ error() }}</p>
            <button 
              (click)="loadProducts()"
              style="padding: 12px 32px; background: #dc2626; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.3s;"
              onmouseover="this.style.background='#b91c1c'"
              onmouseout="this.style.background='#dc2626'"
            >
              🔄 Try Again
            </button>
          </div>
        }

        <!-- Products Grid -->
        @if (!loading() && !error()) {
          @if (products().length > 0) {
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-top: 32px;">
              @for (product of products(); track product.id) {
                <app-product-card [product]="product" />
              }
            </div>
          } @else {
            <div style="background: white; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 60px 40px; text-align: center; margin-top: 40px;">
              <div style="font-size: 80px; margin-bottom: 20px;">🔍</div>
              <h3 style="font-size: 28px; font-weight: 700; color: #1f2937; margin-bottom: 12px;">No products found</h3>
              <p style="color: #6b7280; font-size: 16px; margin-bottom: 24px;">Try adjusting your filters or search criteria</p>
              <button 
                (click)="clearFilters()"
                style="padding: 14px 32px; background: linear-gradient(135deg, #5547d4 0%, #6338a8 100%); color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 16px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(85,71,212,0.4);"
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(85,71,212,0.6)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(85,71,212,0.4)'"
              >
                🔄 Clear All Filters
              </button>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: ``
})
export class ProductListComponent implements OnInit {
  private apiService = inject(ApiService);
  private filterStore = inject(FilterStoreService);

  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set('');

    const filters = this.filterStore.filters();
    
    this.apiService.getProducts(filters).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load products');
        this.loading.set(false);
      }
    });
  }

  clearFilters(): void {
    this.filterStore.clearFilters();
    this.loadProducts();
  }
}
