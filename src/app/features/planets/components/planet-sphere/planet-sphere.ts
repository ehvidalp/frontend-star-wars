import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { Planet, PlanetSummary } from '../../models/planet.model';

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
  
  // Type guard para verificar si es PlanetSummary
  isPlanetSummary(planet: Planet): planet is PlanetSummary {
    return 'uid' in planet && 'url' in planet;
  }

  // Computed para view-transition-name
  sphereTransitionName = computed(() => {
    const planet = this.planet();
    return this.isPlanetSummary(planet) ? `planet-sphere-${planet.uid}` : '';
  });

  // Computed para determinar el tipo de planeta basado en sus características (sin aleatoriedad)
  planetType = computed(() => {
    const planetData = this.planet();
    
    // Solo usar información real cuando esté disponible (PlanetDetail)
    if ('climate' in planetData && 'terrain' in planetData) {
      const climate = planetData.climate?.toLowerCase() || '';
      const terrain = planetData.terrain?.toLowerCase() || '';
      
      // Detección basada en datos reales del planeta
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
    
    // Para PlanetSummary o casos sin información específica, usar tipo estándar
    return 'terrestrial';
  });

  // Computed para las clases CSS basadas en el tipo de planeta
  planetClasses = computed(() => {
    const type = this.planetType();
    
    // Mapa completo de estilos por tipo de planeta
    const classMap: Record<string, string> = {
      'desert': 'bg-gradient-to-br from-yellow-300/80 via-orange-400/70 to-amber-600/60',
      'ice': 'bg-gradient-to-br from-blue-100/80 via-cyan-200/70 to-blue-300/60',
      'ocean': 'bg-gradient-to-br from-blue-300/80 via-blue-500/70 to-blue-700/60',
      'forest': 'bg-gradient-to-br from-green-300/80 via-green-500/70 to-green-700/60',
      'urban': 'bg-gradient-to-br from-gray-300/80 via-slate-400/70 to-gray-600/60',
      'gas-giant': 'bg-gradient-to-br from-purple-300/80 via-pink-400/70 to-purple-600/60',
      'volcanic': 'bg-gradient-to-br from-red-400/80 via-orange-500/70 to-red-700/60',
      'crystal': 'bg-gradient-to-br from-pink-200/80 via-purple-300/70 to-indigo-400/60',
      'toxic': 'bg-gradient-to-br from-lime-300/80 via-green-400/70 to-emerald-600/60',
      'swamp': 'bg-gradient-to-br from-green-500/80 via-amber-600/70 to-green-800/60',
      'rocky': 'bg-gradient-to-br from-stone-300/80 via-gray-500/70 to-stone-700/60',
      'terrestrial': 'bg-gradient-to-br from-cyan-300/80 via-blue-400/70 to-purple-500/60'
    };
    
    return classMap[type] || classMap['terrestrial'];
  });

  // Computed para las clases de tamaño
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
