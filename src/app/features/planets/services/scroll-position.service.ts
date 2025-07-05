import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollPositionService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  // Cache de posiciones con LRU y TTL
  private scrollPositions = new Map<string, { position: number; timestamp: number }>();
  private maxCacheSize = 20;
  private ttl = 10 * 60 * 1000; // 10 minutos

  // Signals para estado y debug
  private _isEnabled = signal(true);
  private _debugMode = signal(false);
  
  readonly isEnabled = this._isEnabled.asReadonly();
  readonly debugMode = this._debugMode.asReadonly();

  /**
   * Guarda la posición de scroll actual para una ruta específica
   */
  saveScrollPosition(route: string, position?: number): void {
    if (!this.isBrowser || !this._isEnabled()) return;

    try {
      const scrollY = position ?? window.scrollY;
      const timestamp = Date.now();
      
      // Limpiar cache si supera el tamaño máximo
      if (this.scrollPositions.size >= this.maxCacheSize) {
        this.clearOldPositions();
      }
      
      this.scrollPositions.set(route, { position: scrollY, timestamp });
      
      if (this._debugMode()) {
        console.log(`📍 Scroll position saved for ${route}:`, scrollY);
      }
    } catch (error) {
      console.error('Error saving scroll position:', error);
    }
  }

  /**
   * Restaura la posición de scroll para una ruta específica
   */
  restoreScrollPosition(route: string): void {
    if (!this.isBrowser || !this._isEnabled()) return;

    try {
      const cached = this.scrollPositions.get(route);
      
      if (!cached) {
        if (this._debugMode()) {
          console.log(`❌ No scroll position found for ${route}`);
        }
        return;
      }

      // Verificar TTL
      if (Date.now() - cached.timestamp > this.ttl) {
        this.scrollPositions.delete(route);
        if (this._debugMode()) {
          console.log(`⏰ Scroll position expired for ${route}`);
        }
        return;
      }

      // Restaurar con múltiples intentos
      this.attemptScrollRestore(cached.position, route);
      
    } catch (error) {
      console.error('Error restoring scroll position:', error);
    }
  }

  /**
   * Intenta restaurar la posición de scroll con múltiples intentos
   */
  private attemptScrollRestore(position: number, route: string, attempt = 1): void {
    if (!this.isBrowser) return;

    const maxAttempts = 5;
    const delay = attempt * 100; // Incrementar delay con cada intento

    setTimeout(() => {
      try {
        window.scrollTo({
          top: position,
          behavior: 'instant'
        });

        if (this._debugMode()) {
          console.log(`🔄 Scroll restore attempt ${attempt} for ${route}: ${position}px`);
        }

        // Verificar si la restauración fue exitosa
        setTimeout(() => {
          if (Math.abs(window.scrollY - position) > 10 && attempt < maxAttempts) {
            this.attemptScrollRestore(position, route, attempt + 1);
          } else if (this._debugMode()) {
            console.log(`✅ Scroll position restored for ${route}: ${window.scrollY}px`);
          }
        }, 50);

      } catch (error) {
        console.error(`Error in scroll restore attempt ${attempt}:`, error);
      }
    }, delay);
  }

  /**
   * Limpia posiciones antiguas basado en TTL
   */
  private clearOldPositions(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [route, data] of this.scrollPositions.entries()) {
      if (now - data.timestamp > this.ttl) {
        toDelete.push(route);
      }
    }

    // Remover entradas expiradas
    toDelete.forEach(route => this.scrollPositions.delete(route));

    // Si aún hay demasiadas entradas, remover las más antiguas
    if (this.scrollPositions.size >= this.maxCacheSize) {
      const entries = Array.from(this.scrollPositions.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, entries.length - this.maxCacheSize + 1);
      toRemove.forEach(([route]) => this.scrollPositions.delete(route));
    }
  }

  /**
   * Habilita o deshabilita el servicio
   */
  setEnabled(enabled: boolean): void {
    this._isEnabled.set(enabled);
  }

  /**
   * Habilita o deshabilita el modo debug
   */
  setDebugMode(enabled: boolean): void {
    this._debugMode.set(enabled);
  }

  /**
   * Limpia todas las posiciones guardadas
   */
  clearAllPositions(): void {
    this.scrollPositions.clear();
    if (this._debugMode()) {
      console.log('🧹 All scroll positions cleared');
    }
  }

  /**
   * Obtiene información de debug del cache
   */
  getDebugInfo(): any {
    return {
      cacheSize: this.scrollPositions.size,
      maxCacheSize: this.maxCacheSize,
      ttl: this.ttl,
      enabled: this._isEnabled(),
      debugMode: this._debugMode(),
      positions: Array.from(this.scrollPositions.entries()).map(([route, data]) => ({
        route,
        position: data.position,
        age: Date.now() - data.timestamp
      }))
    };
  }
}