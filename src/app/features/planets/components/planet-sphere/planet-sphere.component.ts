import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Planet } from '../../models/planet.model';

@Component({
  selector: 'app-planet-sphere',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planet-sphere.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      animation: float 6s ease-in-out infinite;
    }
    
    .planet-sphere {
      animation: holo-flicker 8s ease-in-out infinite;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-4px); }
    }
    
    @keyframes holo-flicker {
      0%, 100% { opacity: 0.9; }
      50% { opacity: 1; }
    }
    
    .animate-spin-slow {
      animation: spin-slow 20s linear infinite;
    }
    
    .animate-spin-reverse {
      animation: spin-reverse 15s linear infinite;
    }
    
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes spin-reverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    
    @media (prefers-reduced-motion: reduce) {
      :host,
      .planet-sphere,
      .animate-spin-slow,
      .animate-spin-reverse {
        animation: none !important;
      }
    }
  `]
})
export class PlanetSphereComponent {
  // Input para recibir el planeta
  planet = input.required<Planet>();
  
  // Input opcional para el tamaño
  size = input<'small' | 'medium' | 'large'>('medium');
  
  // Input opcional para el tipo visual
  variant = input<'holographic' | 'realistic' | 'minimal'>('holographic');

  // Computed para determinar el tipo de planeta basado en sus características
  planetType = computed(() => {
    const planetData = this.planet();
    
    // Lista de tipos de planetas disponibles para variedad visual
    const planetTypes = [
      'desert', 'ice', 'ocean', 'forest', 'urban', 'gas-giant', 
      'volcanic', 'crystal', 'toxic', 'swamp', 'rocky', 'terrestrial'
    ];
    
    // Si es PlanetDetail, podemos usar más información
    if ('climate' in planetData && 'terrain' in planetData) {
      const climate = planetData.climate?.toLowerCase() || '';
      const terrain = planetData.terrain?.toLowerCase() || '';
      
      if (climate.includes('desert') || terrain.includes('desert')) {
        return 'desert';
      } else if (climate.includes('frozen') || climate.includes('ice')) {
        return 'ice';
      } else if (terrain.includes('ocean') || terrain.includes('water')) {
        return 'ocean';
      } else if (terrain.includes('forest') || terrain.includes('jungle')) {
        return 'forest';
      } else if (terrain.includes('urban') || terrain.includes('city')) {
        return 'urban';
      } else if (terrain.includes('gas') || climate.includes('gas')) {
        return 'gas-giant';
      } else if (climate.includes('volcanic') || terrain.includes('volcanic')) {
        return 'volcanic';
      } else if (terrain.includes('crystal') || terrain.includes('crystalline')) {
        return 'crystal';
      } else if (climate.includes('toxic') || terrain.includes('toxic')) {
        return 'toxic';
      } else if (terrain.includes('swamp') || terrain.includes('marsh')) {
        return 'swamp';
      } else if (terrain.includes('rocky') || terrain.includes('rock')) {
        return 'rocky';
      }
    }
    
    // Para casos donde no hay información específica, usar aleatorio basado en el nombre
    const planetName = planetData.name?.toLowerCase() || '';
    const nameHash = planetName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomIndex = nameHash % planetTypes.length;
    
    return planetTypes[randomIndex];
  });

  // Computed para las clases CSS basadas en el tipo de planeta
  planetClasses = computed(() => {
    const type = this.planetType();
    const variant = this.variant();
    const size = this.size();
    
    let classes = '';
    
    // Classes base por variante
    if (variant === 'holographic') {
      classes += 'text-cyan-400 ';
    } else if (variant === 'realistic') {
      classes += 'text-blue-400 ';
    } else {
      classes += 'text-gray-400 ';
    }
    
    // Classes por tipo de planeta - Estilo Star Wars
    switch (type) {
      case 'desert':
        classes += 'bg-gradient-to-br from-yellow-300/80 via-orange-400/70 to-amber-600/60';
        break;
      case 'ice':
        classes += 'bg-gradient-to-br from-blue-100/80 via-cyan-200/70 to-blue-300/60';
        break;
      case 'ocean':
        classes += 'bg-gradient-to-br from-blue-300/80 via-blue-500/70 to-blue-700/60';
        break;
      case 'forest':
        classes += 'bg-gradient-to-br from-green-300/80 via-green-500/70 to-green-700/60';
        break;
      case 'urban':
        classes += 'bg-gradient-to-br from-gray-300/80 via-slate-400/70 to-gray-600/60';
        break;
      case 'gas-giant':
        classes += 'bg-gradient-to-br from-purple-300/80 via-pink-400/70 to-purple-600/60';
        break;
      case 'volcanic':
        classes += 'bg-gradient-to-br from-red-400/80 via-orange-500/70 to-red-700/60';
        break;
      case 'crystal':
        classes += 'bg-gradient-to-br from-pink-200/80 via-purple-300/70 to-indigo-400/60';
        break;
      case 'toxic':
        classes += 'bg-gradient-to-br from-lime-300/80 via-green-400/70 to-emerald-600/60';
        break;
      case 'swamp':
        classes += 'bg-gradient-to-br from-green-500/80 via-amber-600/70 to-green-800/60';
        break;
      case 'rocky':
        classes += 'bg-gradient-to-br from-stone-300/80 via-gray-500/70 to-stone-700/60';
        break;
      default: // terrestrial
        if (variant === 'holographic') {
          classes += 'bg-gradient-to-br from-cyan-300/80 via-blue-400/70 to-purple-500/60';
        } else {
          classes += 'bg-gradient-to-br from-blue-300/80 via-blue-400/70 to-green-300/60';
        }
        break;
    }
    
    return classes;
  });
}
