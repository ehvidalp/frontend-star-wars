import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, catchError, throwError } from 'rxjs';
import { Planet, PlanetDetail, PlanetDetailResponse, PlanetListResponse } from '@features/planets/models/planet.model';
@Injectable({
  providedIn: 'root'
})
export class PlanetsApi {
  private readonly apiUrl = 'https://www.swapi.tech/api';
  private readonly httpClient = inject(HttpClient);
  getPlanets(currentApiUrl?: string | null): Observable<PlanetListResponse> {
    let planetsUrl: string;
    
    if (currentApiUrl) {
      // Verificar si ya incluye expanded=true para evitar duplicados
      if (currentApiUrl.includes('expanded=true')) {
        planetsUrl = currentApiUrl;
      } else {
        // Si ya viene con parámetros, agregar expanded=true
        planetsUrl = currentApiUrl.includes('?') 
          ? `${currentApiUrl}&expanded=true`
          : `${currentApiUrl}?expanded=true`;
      }
    } else {
      // URL base con expanded=true y limit específico para consistencia
      planetsUrl = `${this.apiUrl}/planets?limit=10&expanded=true`;
    }
    
    return this.httpClient.get<PlanetListResponse>(planetsUrl).pipe(
      catchError(this.handleError)
    );
  }

  getPlanetById(planetId: string): Observable<PlanetDetail> {
    if (!planetId?.trim()) return throwError(() => new Error('ID del planeta es requerido'));
    
    const planetUrl = `${this.apiUrl}/planets/${planetId}`;
    return this.httpClient.get<PlanetDetailResponse>(planetUrl).pipe(
      map(response => response.result.properties),
      catchError(this.handleError)
    );
  }
  getPlanetByUrl(planetUrl: string): Observable<PlanetDetail> {
    if (!planetUrl?.trim()) return throwError(() => new Error('URL del planeta es requerida'));
    if (!planetUrl.startsWith(this.apiUrl)) return throwError(() => new Error('URL del planeta no es válida'));
    return this.httpClient.get<PlanetDetailResponse>(planetUrl).pipe(
      map(response => response.result.properties),
      catchError(this.handleError)
    );
  }
  private handleError = (error: HttpErrorResponse): Observable<never> => {    
    const errorMessage = error.error instanceof ErrorEvent 
      ? `Error of network: ${error.error.message}`
      : error.error?.message || error.message || 'Error in planets service';
    return throwError(() => new Error(errorMessage));
  }
}
