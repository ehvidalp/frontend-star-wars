import { Component, input } from '@angular/core';
import { Planet } from '../../models/planet.model';

@Component({
  selector: 'app-planet-card',
  imports: [],
  templateUrl: './planet-card.html',
  styleUrl: './planet-card.css'
})
export class PlanetCard {
  planet = input.required<Planet>()

}
