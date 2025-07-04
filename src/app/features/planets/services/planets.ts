import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Planet, PlanetDetail, PlanetDetailResponse, PlanetListResponse } from '../models/planet.model';

@Injectable({
  providedIn: 'root'
})
export class Planets {
  private readonly apiUrl = 'https://www.swapi.tech/api';
  private readonly httpClient = inject(HttpClient);

  getPlanets(currentApiUrl?: string): Observable<Planet[]> {
    const planetsUrl = currentApiUrl || `${this.apiUrl}/planets`;

    return this.httpClient.get<PlanetListResponse>(planetsUrl).pipe(
      map(response => response.results)
    );
  }

  getPlanetByUrl(planetUrl: string): Observable<PlanetDetail> {
    return this.httpClient.get<PlanetDetailResponse>(planetUrl).pipe(
      map(response => response.result.properties)
    );
  }
}
