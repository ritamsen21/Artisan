import { Injectable, signal, computed } from '@angular/core';
import { Cart, CartItem, Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartStoreService {
  // Private signal for cart items
  private cartItemsSignal = signal<CartItem[]>([]);

  // Public readonly signals
  readonly items = this.cartItemsSignal.asReadonly();
  
  // Computed signals for derived state
  readonly totalItems = computed(() => 
    this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  readonly totalPrice = computed(() => 
    this.cartItemsSignal().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );
  
  readonly cart = computed<Cart>(() => ({
    items: this.cartItemsSignal(),
    totalItems: this.totalItems(),
    totalPrice: this.totalPrice()
  }));

  readonly isEmpty = computed(() => this.cartItemsSignal().length === 0);

  constructor() {
    // Load cart from localStorage on initialization
    this.loadCartFromStorage();
  }

  /**
   * Add a product to the cart
   */
  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSignal();
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      // Update quantity if product already exists
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      this.cartItemsSignal.set(updatedItems);
    } else {
      // Add new product to cart
      this.cartItemsSignal.set([...currentItems, { product, quantity }]);
    }

    this.saveCartToStorage();
  }

  /**
   * Remove a product from the cart
   */
  removeFromCart(productId: number): void {
    const updatedItems = this.cartItemsSignal().filter(item => item.product.id !== productId);
    this.cartItemsSignal.set(updatedItems);
    this.saveCartToStorage();
  }

  /**
   * Update the quantity of a product in the cart
   */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItemsSignal();
    const updatedItems = currentItems.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    this.cartItemsSignal.set(updatedItems);
    this.saveCartToStorage();
  }

  /**
   * Increment the quantity of a product
   */
  incrementQuantity(productId: number): void {
    const currentItems = this.cartItemsSignal();
    const item = currentItems.find(i => i.product.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  /**
   * Decrement the quantity of a product
   */
  decrementQuantity(productId: number): void {
    const currentItems = this.cartItemsSignal();
    const item = currentItems.find(i => i.product.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  /**
   * Clear all items from the cart
   */
  clearCart(): void {
    this.cartItemsSignal.set([]);
    this.saveCartToStorage();
  }

  /**
   * Check if a product is in the cart
   */
  isInCart(productId: number): boolean {
    return this.cartItemsSignal().some(item => item.product.id === productId);
  }

  /**
   * Get the quantity of a specific product in the cart
   */
  getProductQuantity(productId: number): number {
    const item = this.cartItemsSignal().find(i => i.product.id === productId);
    return item?.quantity || 0;
  }

  /**
   * Save cart to localStorage
   */
  private saveCartToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(this.cartItemsSignal()));
    }
  }

  /**
   * Load cart from localStorage
   */
  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart) as CartItem[];
          this.cartItemsSignal.set(items);
        } catch (error) {
          console.error('Failed to load cart from storage:', error);
        }
      }
    }
  }
}
