import { Injectable } from '@angular/core';
import { DataSection, DataField } from '@shared/components/data-table/data-table';
import { Planet, PlanetDetail, PlanetSummary } from '@features/planets/models/planet.model';

@Injectable({
  providedIn: 'root'
})
export class PlanetDataService {
  
  formatForCard(planet: Planet): DataSection[] {
    const sections: DataSection[] = [];
    
    if (this.hasEnvironmentalData(planet)) {
      sections.push({
        title: 'Environment',
        fields: this.getEnvironmentalFields(planet),
        variant: 'card'
      });
    }
    
    if (this.hasPhysicalData(planet)) {
      sections.push({
        title: 'Physical',
        fields: this.getPhysicalFields(planet),
        variant: 'card'
      });
    }
    
    return sections;
  }
  
  formatForDetail(planet: Planet): DataSection[] {
    const sections: DataSection[] = [];
    
    const quickStats = this.getQuickStats(planet);
    if (quickStats.length > 0) {
      sections.push({
        title: 'Quick Stats',
        fields: quickStats,
        variant: 'detail'
      });
    }
    
    const environmentalData = this.getEnvironmentalFields(planet);
    if (environmentalData.length > 0) {
      sections.push({
        title: 'Environmental Data',
        fields: environmentalData,
        variant: 'detail'
      });
    }
    
    const orbitalData = this.getOrbitalFields(planet);
    if (orbitalData.length > 0) {
      sections.push({
        title: 'Orbital Data',
        fields: orbitalData,
        variant: 'detail'
      });
    }
    
    const systemData = this.getSystemFields(planet);
    if (systemData.length > 0) {
      sections.push({
        title: 'System Information',
        fields: systemData,
        variant: 'detail'
      });
    }
    
    return sections;
  }
  
  private isPlanetDetail(planet: Planet): planet is PlanetDetail {
    return 'climate' in planet && 'terrain' in planet;
  }
  
  private isPlanetSummary(planet: Planet): planet is PlanetSummary {
    return 'uid' in planet && 'url' in planet && !('climate' in planet);
  }
  
  private hasEnvironmentalData(planet: Planet): boolean {
    if (!this.isPlanetDetail(planet)) return false;
    return !!(planet.climate || planet.terrain);
  }
  
  private hasPhysicalData(planet: Planet): boolean {
    if (!this.isPlanetDetail(planet)) return false;
    return !!(planet.population || planet.diameter);
  }
  
  private getQuickStats(planet: Planet): DataField[] {
    const fields: DataField[] = [];
    
    if (this.isPlanetDetail(planet)) {
      if (planet.population) {
        fields.push({
          label: 'Population',
          value: this.formatPopulation(planet.population),
          key: 'population'
        });
      }
      
      if (planet.diameter) {
        fields.push({
          label: 'Diameter',
          value: this.formatDiameter(planet.diameter),
          key: 'diameter'
        });
      }
      
      if (planet.gravity) {
        fields.push({
          label: 'Gravity',
          value: this.formatGravity(planet.gravity),
          key: 'gravity'
        });
      }
    }
    
    return fields;
  }
  
  private getEnvironmentalFields(planet: Planet): DataField[] {
    const fields: DataField[] = [];
    
    if (this.isPlanetDetail(planet)) {
      if (planet.climate) {
        fields.push({
          label: 'Climate',
          value: this.formatValue(planet.climate),
          key: 'climate'
        });
      }
      
      if (planet.terrain) {
        fields.push({
          label: 'Terrain',
          value: this.formatValue(planet.terrain),
          key: 'terrain'
        });
      }
      
      if (planet.surface_water) {
        fields.push({
          label: 'Surface Water',
          value: this.formatSurfaceWater(planet.surface_water),
          key: 'surface_water'
        });
      }
    }
    
    return fields;
  }
  
  private getOrbitalFields(planet: Planet): DataField[] {
    const fields: DataField[] = [];
    
    if (this.isPlanetDetail(planet)) {
      if (planet.orbital_period) {
        fields.push({
          label: 'Orbital Period',
          value: this.formatOrbitalPeriod(planet.orbital_period),
          key: 'orbital_period'
        });
      }
      
      if (planet.rotation_period) {
        fields.push({
          label: 'Rotation Period',
          value: this.formatRotationPeriod(planet.rotation_period),
          key: 'rotation_period'
        });
      }
      
      if (planet.gravity) {
        fields.push({
          label: 'Gravity',
          value: this.formatGravity(planet.gravity),
          key: 'gravity'
        });
      }
    }
    
    return fields;
  }
  
  private getPhysicalFields(planet: Planet): DataField[] {
    const fields: DataField[] = [];
    
    if (this.isPlanetDetail(planet)) {
      if (planet.population) {
        fields.push({
          label: 'Population',
          value: this.formatPopulation(planet.population),
          key: 'population'
        });
      }
      
      if (planet.diameter) {
        fields.push({
          label: 'Diameter',
          value: this.formatDiameter(planet.diameter),
          key: 'diameter'
        });
      }
    }
    
    return fields;
  }
  
  private getSystemFields(planet: Planet): DataField[] {
    const fields: DataField[] = [];
    
    if (this.isPlanetDetail(planet)) {
      if (planet.created) {
        fields.push({
          label: 'Created',
          value: this.formatDate(planet.created),
          key: 'created'
        });
      }
      
      if (planet.edited) {
        fields.push({
          label: 'Edited',
          value: this.formatDate(planet.edited),
          key: 'edited'
        });
      }
    }
    
    return fields;
  }
  
  private formatValue(value: string): string {
    return value.split(',').map(v => v.trim()).join(', ');
  }
  
  private formatPopulation(population: string): string {
    const num = parseInt(population);
    if (isNaN(num)) return population;
    return num.toLocaleString();
  }
  
  private formatDiameter(diameter: string): string {
    const num = parseInt(diameter);
    if (isNaN(num)) return diameter;
    return `${num.toLocaleString()} km`;
  }
  
  private formatGravity(gravity: string): string {
    return gravity.includes('standard') ? gravity : `${gravity} standard`;
  }
  
  private formatSurfaceWater(water: string): string {
    const num = parseInt(water);
    if (isNaN(num)) return water;
    return `${num}%`;
  }
  
  private formatOrbitalPeriod(period: string): string {
    const num = parseInt(period);
    if (isNaN(num)) return period;
    return `${num} days`;
  }
  
  private formatRotationPeriod(period: string): string {
    const num = parseInt(period);
    if (isNaN(num)) return period;
    return `${num} hours`;
  }
  
  private formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
