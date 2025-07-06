import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { Planet, PlanetSummary } from '@features/planets/models/planet.model';

@Component({
  selector: 'app-planet-sphere',
  imports: [],
  templateUrl: './planet-sphere.html',
  styleUrl: './planet-sphere.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class PlanetSphere {
  planet = input.required<Planet>();
  size = input<'small' | 'medium' | 'large'>('medium');

  private readonly planetTypeClassifiers = [
    {
      type: 'desert',
      matchers: ['desert', 'arid']
    },
    {
      type: 'ice',
      matchers: ['frozen', 'ice', 'cold', 'tundra']
    },
    {
      type: 'ocean',
      matchers: ['ocean', 'water', 'aquatic']
    },
    {
      type: 'forest',
      matchers: ['forest', 'jungle', 'rainforest', 'tropical', 'grassland']
    },
    {
      type: 'urban',
      matchers: ['urban', 'city', 'cityscape']
    },
    {
      type: 'gas-giant',
      matchers: ['gas', 'giant']
    },
    {
      type: 'volcanic',
      matchers: ['volcanic', 'lava']
    },
    {
      type: 'crystal',
      matchers: ['crystal', 'crystalline']
    },
    {
      type: 'toxic',
      matchers: ['toxic', 'poisonous']
    },
    {
      type: 'swamp',
      matchers: ['swamp', 'marsh', 'murky', 'bog']
    },
    {
      type: 'rocky',
      matchers: ['rocky', 'rock', 'mountain', 'cave', 'hill']
    }
  ];

  private readonly planetTypeClassMap: Record<string, string> = {
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

  private readonly sizeClassMap = {
    'small': 'w-16 h-16 sm:w-20 sm:h-20',
    'medium': 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32',
    'large': 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56'
  };

  isPlanetSummary(planet: Planet): planet is PlanetSummary {
    return 'uid' in planet && 'url' in planet && !('climate' in planet);
  }

  sphereTransitionName = computed(() => {
    const planet = this.planet();
    return 'uid' in planet ? `planet-sphere-${planet.uid}` : '';
  });

  planetType = computed(() => {
    const planetData = this.planet();
    
    if (!planetData || !planetData.name) {
      return 'terrestrial';
    }
    
    if ('climate' in planetData && 'terrain' in planetData) {
      const climate = (planetData.climate || '').toLowerCase();
      const terrain = (planetData.terrain || '').toLowerCase();
      const combinedText = `${climate} ${terrain}`;
      
      for (const classifier of this.planetTypeClassifiers) {
        if (classifier.matchers.some(matcher => combinedText.includes(matcher))) {
          return classifier.type;
        }
      }
    }
    
    return 'terrestrial';
  });

  planetClasses = computed(() => {
    const type = this.planetType();
    return this.planetTypeClassMap[type] || this.planetTypeClassMap['terrestrial'];
  });

  sizeClasses = computed(() => {
    const size = this.size();
    return this.sizeClassMap[size] || this.sizeClassMap['medium'];
  });
}
