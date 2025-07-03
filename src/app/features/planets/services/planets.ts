import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Planets {
  private readonly apiUrl = 'https://www.swapi.tech/api/planets';
  private readonly httpClient = inject(HttpClient);

  
  getPlanets() {
    return this.httpClient.get(this.apiUrl);
  }
}
