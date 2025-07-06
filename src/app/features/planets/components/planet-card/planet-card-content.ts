import { Component, input, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { Planet, PlanetSummary } from '@features/planets/models/planet.model';
import { PlanetSphere } from '@features/planets/components/planet-sphere/planet-sphere';
import { DataTable } from '@shared/components/data-table/data-table';
import { PlanetDataService } from '@shared/services/planet-data';

@Component({
  selector: 'app-planet-card-content',
  templateUrl: './planet-card-content.html',
  styleUrl: './planet-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PlanetSphere, DataTable]
})
export class PlanetCardContent {
  planet = input.required<Planet>();

  private readonly planetDataService = inject(PlanetDataService);

  readonly isPlanetSummary = computed(() => {
    const planet = this.planet();
    return 'uid' in planet && 'url' in planet && !('climate' in planet);
  });

  readonly titleTransitionName = computed(() => {
    const planet = this.planet();
    return 'uid' in planet ? `planet-title-${planet.uid}` : '';
  });

  readonly showExpandedData = computed(() => {
    const planet = this.planet();
    if (this.isPlanetSummary()) {
      return null; // No expanded data for summary cards
    }
    
    const sections = this.planetDataService.formatForCard(planet);
    return sections.length > 0 ? sections : null;
  });
}
