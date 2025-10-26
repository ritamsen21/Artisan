import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, FilterStoreService } from '../../../core/services';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-product-filters',
  imports: [FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="grid md:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange()"
            placeholder="Search products..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            [(ngModel)]="selectedCategoryId"
            (ngModelChange)="onCategoryChange()"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option [value]="undefined">All Categories</option>
            @for (category of categories(); track category.id) {
              <option [value]="category.id">{{ category.name }}</option>
            }
          </select>
        </div>

        <!-- Min Price -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Min Price
          </label>
          <input
            type="number"
            [(ngModel)]="minPrice"
            (ngModelChange)="onPriceChange()"
            placeholder="0"
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <!-- Max Price -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Max Price
          </label>
          <input
            type="number"
            [(ngModel)]="maxPrice"
            (ngModelChange)="onPriceChange()"
            placeholder="1000"
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Clear Filters Button -->
      @if (filterStore.hasActiveFilters()) {
        <div class="mt-4 flex justify-end">
          <button
            (click)="clearFilters()"
            class="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Clear All Filters
          </button>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class ProductFiltersComponent implements OnInit {
  private apiService = inject(ApiService);
  filterStore = inject(FilterStoreService);

  categories = signal<Category[]>([]);
  searchQuery = '';
  selectedCategoryId: number | undefined = undefined;
  minPrice: number | undefined = undefined;
  maxPrice: number | undefined = undefined;

  ngOnInit(): void {
    this.loadCategories();
    
    // Initialize from filter store
    this.searchQuery = this.filterStore.searchQuery();
    this.selectedCategoryId = this.filterStore.categoryId();
    this.minPrice = this.filterStore.priceMin();
    this.maxPrice = this.filterStore.priceMax();
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
      }
    });
  }

  onSearchChange(): void {
    this.filterStore.setSearchQuery(this.searchQuery);
  }

  onCategoryChange(): void {
    this.filterStore.setCategoryId(this.selectedCategoryId);
  }

  onPriceChange(): void {
    this.filterStore.setPriceRange(this.minPrice, this.maxPrice);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategoryId = undefined;
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.filterStore.clearFilters();
  }
}
