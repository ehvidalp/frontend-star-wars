import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, catchError, throwError } from 'rxjs';
import { Planet, PlanetDetail, PlanetDetailResponse, PlanetListResponse } from '../models/planet.model';

@Injectable({
  providedIn: 'root'
})
export class Planets {
  private readonly apiUrl = 'https://www.swapi.tech/api';
  private readonly httpClient = inject(HttpClient);

  getPlanets(currentApiUrl?: string): Observable<Pick<PlanetListResponse, 'results' | 'next'>> {
    const planetsUrl = currentApiUrl || `${this.apiUrl}/planets`;

    return this.httpClient.get<PlanetListResponse>(planetsUrl).pipe(
      map(({results, next}) => ({
        results: results,
        next: next
      })),
      catchError(this.handleError)
    );
  }

  getPlanetByUrl(planetUrl: string): Observable<PlanetDetail> {
    if (!planetUrl?.trim()) {
      return throwError(() => new Error('URL del planeta es requerida'));
    }

    if (!planetUrl.startsWith(this.apiUrl)) {
      return throwError(() => new Error('URL del planeta no es válida'));
    }

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
