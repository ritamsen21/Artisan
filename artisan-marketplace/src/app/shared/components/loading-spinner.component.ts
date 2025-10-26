import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  template: `
    <div class="flex items-center justify-center" [class]="'p-' + padding()">
      <div class="relative">
        <div 
          class="animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"
          [style.width.px]="size()"
          [style.height.px]="size()"
        ></div>
      </div>
      @if (message()) {
        <p class="ml-3 text-gray-600">{{ message() }}</p>
      }
    </div>
  `,
  styles: ``
})
export class LoadingSpinnerComponent {
  size = input<number>(40);
  padding = input<number>(8);
  message = input<string>('');
}
