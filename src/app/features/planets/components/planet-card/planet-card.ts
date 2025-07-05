import { Component, input, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Planet, PlanetSummary } from '../../models/planet.model';

@Component({
  selector: 'app-planet-card',
  imports: [],
  templateUrl: './planet-card.html',
  styleUrl: './planet-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanetCard {
  planet = input.required<Planet>();
  
  private router = inject(Router);

  // Type guard para verificar si es PlanetSummary
  isPlanetSummary(planet: Planet): planet is PlanetSummary {
    return 'uid' in planet && 'url' in planet;
  }

  // Computed properties para view-transition-names
  cardTransitionName = computed(() => {
    const planet = this.planet();
    return this.isPlanetSummary(planet) ? `planet-card-${planet.uid}` : '';
  });

  sphereTransitionName = computed(() => {
    const planet = this.planet();
    return this.isPlanetSummary(planet) ? `planet-sphere-${planet.uid}` : '';
  });

  titleTransitionName = computed(() => {
    const planet = this.planet();
    return this.isPlanetSummary(planet) ? `planet-title-${planet.uid}` : '';
  });

  /**
   * Navega a la página de detalle del planeta
   */
  onCardClick(): void {
    try {
      console.log('🚀 Planet card clicked');
      const planet = this.planet();
      console.log('🌍 Planet data:', planet);
      
      if (this.isPlanetSummary(planet)) {
        console.log('✅ Valid planet summary, navigating to:', `/planets/${planet.uid}`);
        
        // Navegar a la página de detalle
        this.router.navigate(['/planets', planet.uid]);
      } else {
        console.warn('⚠️ Planet is not a valid PlanetSummary:', planet);
      }
    } catch (error) {
      console.error('❌ Error in onCardClick:', error);
    }
  }

  // Computed para determinar el tipo de planeta basado en sus características (optimizado)
  planetType = computed(() => {
    const planetData = this.planet();
    
    // Cache para evitar recálculos
    if (!planetData?.name) return 'terrestrial';
    
    // Si es PlanetDetail, usar información específica
    if ('climate' in planetData && 'terrain' in planetData) {
      const climate = planetData.climate?.toLowerCase() || '';
      const terrain = planetData.terrain?.toLowerCase() || '';
      
      // Búsqueda optimizada con includes más eficiente
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
    
    // Para PlanetSummary, usar hash simple del nombre (optimizado)
    const name = planetData.name;
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) & 0xffffffff;
    }
    
    // Array más pequeño para mejor performance
    const types = ['desert', 'ice', 'ocean', 'forest', 'urban', 'gas-giant', 'volcanic', 'terrestrial'];
    return types[Math.abs(hash) % types.length];
  });

  // Computed para las clases CSS basadas en el tipo de planeta (optimizado)
  planetClasses = computed(() => {
    const type = this.planetType();
    
    // Mapa optimizado para lookup directo
    const classMap: Record<string, string> = {
      'desert': 'bg-gradient-to-br from-yellow-300/80 via-orange-400/70 to-amber-600/60',
      'ice': 'bg-gradient-to-br from-blue-100/80 via-cyan-200/70 to-blue-300/60',
      'ocean': 'bg-gradient-to-br from-blue-300/80 via-blue-500/70 to-blue-700/60',
      'forest': 'bg-gradient-to-br from-green-300/80 via-green-500/70 to-green-700/60',
      'urban': 'bg-gradient-to-br from-gray-300/80 via-slate-400/70 to-gray-600/60',
      'gas-giant': 'bg-gradient-to-br from-purple-300/80 via-pink-400/70 to-purple-600/60',
      'volcanic': 'bg-gradient-to-br from-red-400/80 via-orange-500/70 to-red-700/60',
      'terrestrial': 'bg-gradient-to-br from-cyan-300/80 via-blue-400/70 to-purple-500/60'
    };
    
    return classMap[type] || classMap['terrestrial'];
  });
}
