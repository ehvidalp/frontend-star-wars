import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { Planet, PlanetSummary } from '@features/planets/models/planet.model';
@Component({
  selector: 'app-planet-sphere',
  imports: [],
  templateUrl: './planet-sphere.html',
  styleUrl: './planet-sphere.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanetSphere {
  planet = input.required<Planet>();
  size = input<'small' | 'medium' | 'large'>('medium');
  isPlanetSummary(planet: Planet): planet is PlanetSummary {
    return 'uid' in planet && 'url' in planet;
  }
  sphereTransitionName = computed(() => {
    const planet = this.planet();
    return this.isPlanetSummary(planet) ? `planet-sphere-${planet.uid}` : '';
  });
  planetType = computed(() => {
    const planetData = this.planet();
    if ('climate' in planetData && 'terrain' in planetData) {
      const climate = planetData.climate?.toLowerCase() || '';
      const terrain = planetData.terrain?.toLowerCase() || '';
      if (climate.includes('desert') || terrain.includes('desert')) return 'desert';
      if (climate.includes('frozen') || climate.includes('ice')) return 'ice';
      if (terrain.includes('ocean') || terrain.includes('water')) return 'ocean';
      if (terrain.includes('forest') || terrain.includes('jungle')) return 'forest';
      if (terrain.includes('urban') || terrain.includes('city')) return 'urban';
      if (terrain.includes('gas') || climate.includes('gas')) return 'gas-giant';
      if (climate.includes('volcanic') || terrain.includes('volcanic')) return 'volcanic';
      if (terrain.includes('crystal') || terrain.includes('crystalline')) return 'crystal';
      if (climate.includes('toxic') || terrain.includes('toxic')) return 'toxic';
      if (terrain.includes('swamp') || terrain.includes('marsh')) return 'swamp';
      if (terrain.includes('rocky') || terrain.includes('rock')) return 'rocky';
    }
    return 'terrestrial';
  });
  planetClasses = computed(() => {
    const type = this.planetType();
    const classMap: Record<string, string> = {
      'desert': 'planet-desert',
      'ice': 'planet-ice',
      'ocean': 'planet-ocean',
      'forest': 'planet-forest',
      'urban': 'planet-urban',
      'gas-giant': 'planet-gas-giant',
      'volcanic': 'planet-volcanic',
      'crystal': 'planet-crystal',
      'toxic': 'planet-toxic',
      'swamp': 'planet-swamp',
      'rocky': 'planet-rocky',
      'terrestrial': 'planet-terrestrial'
    };
    return classMap[type] || classMap['terrestrial'];
  });
  sizeClasses = computed(() => {
    const size = this.size();
    const sizeMap = {
      'small': 'w-16 h-16 sm:w-20 sm:h-20',
      'medium': 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32',
      'large': 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56'
    };
    return sizeMap[size] || sizeMap['medium'];
  });
}
