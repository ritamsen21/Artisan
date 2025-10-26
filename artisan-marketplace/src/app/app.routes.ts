import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductListComponent } from './features/products/pages/product-list.component';
import { ProductDetailComponent } from './features/products/pages/product-detail.component';
import { CartComponent } from './features/cart/pages/cart.component';
import { LoginComponent } from './features/auth/pages/login.component';
import { authGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home - Artisan Marketplace'
  },
  {
    path: 'products',
    component: ProductListComponent,
    title: 'Products - Artisan Marketplace'
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    title: 'Product Details - Artisan Marketplace'
  },
  {
    path: 'cart',
    component: CartComponent,
    title: 'Shopping Cart - Artisan Marketplace'
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'Login - Artisan Marketplace'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
