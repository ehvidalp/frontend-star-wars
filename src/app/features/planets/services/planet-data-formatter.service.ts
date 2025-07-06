import { Injectable } from '@angular/core';
import { Planet, PlanetViewModel, PlanetStatistic, PlanetDataSection } from '@features/planets/models/planet.model';

/**
 * Service for formatting planet data and creating view models
 * Follows the project's service architecture pattern
 */
@Injectable({
  providedIn: 'root'
})
export class PlanetDataFormatterService {

  /**
   * Creates a formatted view model from planet data
   */
  createPlanetViewModel(planet: Planet): PlanetViewModel {
    const planetData = planet as any;
    const hasUid = planet && 'uid' in planet;
    const uid = hasUid ? planet.uid : '';
    
    return {
      name: planetData.name || 'Planeta Desconocido',
      uid: uid || 'N/A',
      transitions: {
        card: hasUid ? `planet-card-${uid}` : '',
        sphere: hasUid ? `planet-sphere-${uid}` : '',
        title: hasUid ? `planet-title-${uid}` : ''
      },
      quickStats: this.createQuickStats(planetData),
      environmentalData: this.createEnvironmentalData(planetData),
      orbitalData: this.createOrbitalData(planetData),
      systemInfo: this.createSystemInfo(planetData)
    };
  }

  private createQuickStats(planetData: any): PlanetStatistic[] {
    const stats = [
      {
        label: 'Población',
        value: this.formatPopulation(planetData.population),
        isVisible: this.hasValidProperty(planetData, 'population')
      },
      {
        label: 'Diámetro',
        value: this.formatDiameter(planetData.diameter),
        isVisible: this.hasValidProperty(planetData, 'diameter')
      },
      {
        label: 'Gravedad',
        value: this.formatGravity(planetData.gravity),
        isVisible: this.hasValidProperty(planetData, 'gravity')
      }
    ];
    
    return stats.filter(stat => stat.isVisible);
  }

  private createEnvironmentalData(planetData: any): PlanetDataSection {
    const fields = [
      {
        label: 'Clima',
        value: this.formatValue(planetData.climate),
        isVisible: this.hasValidProperty(planetData, 'climate')
      },
      {
        label: 'Terreno',
        value: this.formatValue(planetData.terrain),
        isVisible: this.hasValidProperty(planetData, 'terrain')
      },
      {
        label: 'Agua Superficial',
        value: this.formatSurfaceWater(planetData.surface_water),
        isVisible: this.hasValidProperty(planetData, 'surface_water')
      }
    ].filter(field => field.isVisible);

    return {
      title: 'Datos Ambientales',
      isVisible: fields.length > 0,
      fields
    };
  }

  private createOrbitalData(planetData: any): PlanetDataSection {
    const fields = [
      {
        label: 'Período de Rotación',
        value: this.formatPeriod(planetData.rotation_period, 'día'),
        isVisible: this.hasValidProperty(planetData, 'rotation_period')
      },
      {
        label: 'Período Orbital',
        value: this.formatPeriod(planetData.orbital_period, 'año'),
        isVisible: this.hasValidProperty(planetData, 'orbital_period')
      }
    ].filter(field => field.isVisible);

    return {
      title: 'Datos Orbitales',
      isVisible: fields.length > 0,
      fields
    };
  }

  private createSystemInfo(planetData: any): PlanetDataSection {
    const fields = [
      {
        label: 'Fecha de Registro',
        value: this.formatDate(planetData.created),
        isVisible: this.hasValidProperty(planetData, 'created')
      },
      {
        label: 'Última Actualización',
        value: this.formatDate(planetData.edited),
        isVisible: this.hasValidProperty(planetData, 'edited')
      }
    ].filter(field => field.isVisible);

    return {
      title: 'Información del Sistema',
      isVisible: fields.length > 0,
      fields
    };
  }

  private formatPopulation(population: string): string {
    if (!population || this.isUnknownValue(population)) return 'Desconocido';
    
    const num = parseInt(population.replace(/,/g, ''));
    if (isNaN(num)) return population;
    
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)} mil millones`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)} millones`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    
    return num.toLocaleString();
  }

  private formatDiameter(diameter: string): string {
    if (!diameter || this.isUnknownValue(diameter)) return 'Desconocido';
    
    const num = parseInt(diameter.replace(/,/g, ''));
    if (isNaN(num)) return diameter;
    
    return `${num.toLocaleString()} km`;
  }

  private formatGravity(gravity: string): string {
    if (!gravity || this.isUnknownValue(gravity)) return 'Desconocido';
    
    if (gravity.includes('standard')) return gravity;
    
    const num = parseFloat(gravity);
    if (!isNaN(num)) return `${num} G estándar`;
    
    return gravity;
  }

  private formatPeriod(period: string, unit: 'día' | 'año'): string {
    if (!period || this.isUnknownValue(period)) return 'Desconocido';
    
    const num = parseFloat(period);
    if (!isNaN(num)) {
      const unitText = num === 1 ? `${unit} estándar` : `${unit}s estándares`;
      return `${num} ${unitText}`;
    }
    
    return period;
  }

  private formatSurfaceWater(surfaceWater: string): string {
    if (!surfaceWater || this.isUnknownValue(surfaceWater)) return 'Desconocido';
    
    const num = parseFloat(surfaceWater);
    if (!isNaN(num)) return `${num}%`;
    
    return surfaceWater;
  }

  private formatDate(dateString: string): string {
    if (!dateString || this.isUnknownValue(dateString)) return 'Desconocido';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  private formatValue(value: string): string {
    if (!value || this.isUnknownValue(value)) return 'Desconocido';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private isUnknownValue(value: string): boolean {
    return value === 'unknown' || value === 'n/a';
  }

  private hasValidProperty(planet: any, property: string): boolean {
    return planet && 
           property in planet && 
           planet[property] && 
           !this.isUnknownValue(planet[property]);
  }
}
