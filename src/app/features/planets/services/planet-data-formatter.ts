import { Injectable } from '@angular/core';
import { Planet, PlanetViewModel, PlanetStatistic, PlanetDataSection } from '@features/planets/models/planet.model';

@Injectable({
  providedIn: 'root'
})
export class PlanetDataFormatterService {

  createPlanetViewModel(planet: Planet): PlanetViewModel {
    const planetData = planet as any;
    const hasUid = planet && 'uid' in planet;
    const uid = hasUid ? planet.uid : '';
    
    return {
      name: planetData.name || 'Unknown Planet',
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
        label: 'Population',
        value: this.formatPopulation(planetData.population),
        isVisible: this.hasValidProperty(planetData, 'population')
      },
      {
        label: 'Diameter',
        value: this.formatDiameter(planetData.diameter),
        isVisible: this.hasValidProperty(planetData, 'diameter')
      },
      {
        label: 'Gravity',
        value: this.formatGravity(planetData.gravity),
        isVisible: this.hasValidProperty(planetData, 'gravity')
      }
    ];
    
    return stats.filter(stat => stat.isVisible);
  }

  private createEnvironmentalData(planetData: any): PlanetDataSection {
    const fields = [
      {
        label: 'Climate',
        value: this.formatValue(planetData.climate),
        isVisible: this.hasValidProperty(planetData, 'climate')
      },
      {
        label: 'Terrain',
        value: this.formatValue(planetData.terrain),
        isVisible: this.hasValidProperty(planetData, 'terrain')
      },
      {
        label: 'Surface Water',
        value: this.formatSurfaceWater(planetData.surface_water),
        isVisible: this.hasValidProperty(planetData, 'surface_water')
      }
    ].filter(field => field.isVisible);

    return {
      title: 'Environmental Data',
      isVisible: fields.length > 0,
      fields
    };
  }

  private createOrbitalData(planetData: any): PlanetDataSection {
    const fields = [
      {
        label: 'Rotation Period',
        value: this.formatPeriod(planetData.rotation_period, 'day'),
        isVisible: this.hasValidProperty(planetData, 'rotation_period')
      },
      {
        label: 'Orbital Period',
        value: this.formatPeriod(planetData.orbital_period, 'year'),
        isVisible: this.hasValidProperty(planetData, 'orbital_period')
      }
    ].filter(field => field.isVisible);

    return {
      title: 'Orbital Data',
      isVisible: fields.length > 0,
      fields
    };
  }

  private createSystemInfo(planetData: any): PlanetDataSection {
    const fields = [
      {
        label: 'Registration Date',
        value: this.formatDate(planetData.created),
        isVisible: this.hasValidProperty(planetData, 'created')
      },
      {
        label: 'Last Updated',
        value: this.formatDate(planetData.edited),
        isVisible: this.hasValidProperty(planetData, 'edited')
      }
    ].filter(field => field.isVisible);

    return {
      title: 'System Information',
      isVisible: fields.length > 0,
      fields
    };
  }

  private formatPopulation(population: string): string {
    if (!population || this.isUnknownValue(population)) return 'Unknown';
    
    const num = parseInt(population.replace(/,/g, ''));
    if (isNaN(num)) return population;
    
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)} billion`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)} million`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    
    return num.toLocaleString();
  }

  private formatDiameter(diameter: string): string {
    if (!diameter || this.isUnknownValue(diameter)) return 'Unknown';
    
    const num = parseInt(diameter.replace(/,/g, ''));
    if (isNaN(num)) return diameter;
    
    return `${num.toLocaleString()} km`;
  }

  private formatGravity(gravity: string): string {
    if (!gravity || this.isUnknownValue(gravity)) return 'Unknown';
    
    if (gravity.includes('standard')) return gravity;
    
    const num = parseFloat(gravity);
    if (!isNaN(num)) return `${num} standard G`;
    
    return gravity;
  }

  private formatPeriod(period: string, unit: 'day' | 'year'): string {
    if (!period || this.isUnknownValue(period)) return 'Unknown';
    
    const num = parseFloat(period);
    if (!isNaN(num)) {
      const unitText = num === 1 ? `standard ${unit}` : `standard ${unit}s`;
      return `${num} ${unitText}`;
    }
    
    return period;
  }

  private formatSurfaceWater(surfaceWater: string): string {
    if (!surfaceWater || this.isUnknownValue(surfaceWater)) return 'Unknown';
    
    const num = parseFloat(surfaceWater);
    if (!isNaN(num)) return `${num}%`;
    
    return surfaceWater;
  }

  private formatDate(dateString: string): string {
    if (!dateString || this.isUnknownValue(dateString)) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  private formatValue(value: string): string {
    if (!value || this.isUnknownValue(value)) return 'Unknown';
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
