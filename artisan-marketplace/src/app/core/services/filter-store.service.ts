import { Injectable, signal, computed } from '@angular/core';
import { ProductFilters } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FilterStoreService {
  // Private signals for filters
  private searchQuerySignal = signal<string>('');
  private categoryIdSignal = signal<number | undefined>(undefined);
  private priceMinSignal = signal<number | undefined>(undefined);
  private priceMaxSignal = signal<number | undefined>(undefined);
  private sortBySignal = signal<'price-asc' | 'price-desc' | 'name' | 'newest' | null>(null);

  // Public readonly signals
  readonly searchQuery = this.searchQuerySignal.asReadonly();
  readonly categoryId = this.categoryIdSignal.asReadonly();
  readonly priceMin = this.priceMinSignal.asReadonly();
  readonly priceMax = this.priceMaxSignal.asReadonly();
  readonly sortBy = this.sortBySignal.asReadonly();

  // Computed signal for complete filter object
  readonly filters = computed<ProductFilters>(() => {
    const filters: ProductFilters = {};
    
    const query = this.searchQuerySignal();
    if (query) filters.title = query;
    
    const categoryId = this.categoryIdSignal();
    if (categoryId) filters.categoryId = categoryId;
    
    const priceMin = this.priceMinSignal();
    if (priceMin !== undefined) filters.price_min = priceMin;
    
    const priceMax = this.priceMaxSignal();
    if (priceMax !== undefined) filters.price_max = priceMax;
    
    return filters;
  });

  // Computed signal to check if any filters are active
  readonly hasActiveFilters = computed(() => 
    this.searchQuerySignal() !== '' ||
    this.categoryIdSignal() !== undefined ||
    this.priceMinSignal() !== undefined ||
    this.priceMaxSignal() !== undefined
  );

  /**
   * Set search query
   */
  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
  }

  /**
   * Set category filter
   */
  setCategoryId(categoryId: number | undefined): void {
    this.categoryIdSignal.set(categoryId);
  }

  /**
   * Set price range filters
   */
  setPriceRange(min: number | undefined, max: number | undefined): void {
    this.priceMinSignal.set(min);
    this.priceMaxSignal.set(max);
  }

  /**
   * Set minimum price
   */
  setPriceMin(min: number | undefined): void {
    this.priceMinSignal.set(min);
  }

  /**
   * Set maximum price
   */
  setPriceMax(max: number | undefined): void {
    this.priceMaxSignal.set(max);
  }

  /**
   * Set sort option
   */
  setSortBy(sortBy: 'price-asc' | 'price-desc' | 'name' | 'newest' | null): void {
    this.sortBySignal.set(sortBy);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchQuerySignal.set('');
    this.categoryIdSignal.set(undefined);
    this.priceMinSignal.set(undefined);
    this.priceMaxSignal.set(undefined);
    this.sortBySignal.set(null);
  }

  /**
   * Clear search query only
   */
  clearSearch(): void {
    this.searchQuerySignal.set('');
  }

  /**
   * Clear category filter
   */
  clearCategory(): void {
    this.categoryIdSignal.set(undefined);
  }

  /**
   * Clear price filters
   */
  clearPriceRange(): void {
    this.priceMinSignal.set(undefined);
    this.priceMaxSignal.set(undefined);
  }
}
