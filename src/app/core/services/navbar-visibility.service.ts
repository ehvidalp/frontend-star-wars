import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Navbar Visibility Service
 * Maneja la visibilidad del navbar de forma simple y directa
 * Regla: Ocultar navbar solo cuando welcome está visible
 */
@Injectable({
  providedIn: 'root'
})
export class NavbarVisibilityService {
  private readonly router = inject(Router);
  
  // Signal para controlar si welcome está visible
  private readonly _isWelcomeVisible = signal<boolean>(true);
  
  // Computed property para determinar si mostrar navbar
  readonly shouldShowNavbar = computed(() => {
    const currentUrl = this.router.url;
    const isWelcomeVisible = this._isWelcomeVisible();
    
    // En home page: mostrar navbar solo si welcome NO está visible
    if (currentUrl === '/') {
      return !isWelcomeVisible;
    }
    
    // En otras rutas (/planets, /planets/:id): siempre mostrar navbar
    return true;
  });
  
  // Computed para back button (solo en planet detail)
  readonly shouldShowBackButton = computed(() => {
    const currentUrl = this.router.url;
    return currentUrl.startsWith('/planets/') && currentUrl.split('/').length === 3;
  });
  
  /**
   * Método para actualizar la visibilidad del welcome
   * Se llama desde el welcome component o mediante IntersectionObserver
   */
  setWelcomeVisibility(isVisible: boolean): void {
    this._isWelcomeVisible.set(isVisible);
  }
  
  /**
   * Método para verificar si welcome está visible
   */
  isWelcomeVisible(): boolean {
    return this._isWelcomeVisible();
  }
}
