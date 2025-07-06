import { Injectable } from '@angular/core';
import { DataSection, DataField } from '@shared/components/data-table/data-table';
import { Planet, PlanetDetail, PlanetSummary } from '@features/planets/models/planet.model';
import { FieldConfig, SectionConfig, DataVariant } from '@shared/models/data-config.model';

@Injectable({
  providedIn: 'root'
})
export class PlanetDataService {
  
  private readonly cardSections: SectionConfig[] = [
    {
      title: 'Environment',
      fields: [
        { key: 'climate', label: 'Climate', formatter: this.formatValue },
        { key: 'terrain', label: 'Terrain', formatter: this.formatValue },
        { key: 'surface_water', label: 'Surface Water', formatter: this.formatSurfaceWater }
      ],
      condition: (planet) => !!(planet.climate || planet.terrain)
    },
    {
      title: 'Physical',
      fields: [
        { key: 'population', label: 'Population', formatter: this.formatPopulation },
        { key: 'diameter', label: 'Diameter', formatter: this.formatDiameter }
      ],
      condition: (planet) => !!(planet.population || planet.diameter)
    }
  ];

  private readonly detailSections: SectionConfig[] = [
    {
      title: 'Quick Stats',
      fields: [
        { key: 'population', label: 'Population', formatter: this.formatPopulation },
        { key: 'diameter', label: 'Diameter', formatter: this.formatDiameter },
        { key: 'gravity', label: 'Gravity', formatter: this.formatGravity }
      ]
    },
    {
      title: 'Environmental Data',
      fields: [
        { key: 'climate', label: 'Climate', formatter: this.formatValue },
        { key: 'terrain', label: 'Terrain', formatter: this.formatValue },
        { key: 'surface_water', label: 'Surface Water', formatter: this.formatSurfaceWater }
      ]
    },
    {
      title: 'Orbital Data',
      fields: [
        { key: 'orbital_period', label: 'Orbital Period', formatter: this.formatOrbitalPeriod },
        { key: 'rotation_period', label: 'Rotation Period', formatter: this.formatRotationPeriod },
        { key: 'gravity', label: 'Gravity', formatter: this.formatGravity }
      ]
    },
    {
      title: 'System Information',
      fields: [
        { key: 'created', label: 'Created', formatter: this.formatDate },
        { key: 'edited', label: 'Edited', formatter: this.formatDate }
      ]
    }
  ];

  formatForCard(planet: Planet): DataSection[] {
    return this.isPlanetDetail(planet) 
      ? this.buildSections(planet, this.cardSections, 'card')
      : [];
  }
  
  formatForDetail(planet: Planet): DataSection[] {
    return this.isPlanetDetail(planet) 
      ? this.buildSections(planet, this.detailSections, 'detail')
      : [];
  }

  private buildSections(
    planet: PlanetDetail, 
    sections: SectionConfig[], 
    variant: DataVariant
  ): DataSection[] {
    return sections
      .map(section => this.buildSection(planet, section, variant))
      .filter(section => section.fields.length > 0);
  }

  private buildSection(
    planet: PlanetDetail, 
    config: SectionConfig, 
    variant: DataVariant
  ): DataSection {
    const shouldInclude = config.condition ? config.condition(planet) : true;
    
    const fields = shouldInclude 
      ? this.buildFields(planet, config.fields)
      : [];

    return {
      title: config.title,
      fields,
      variant
    };
  }

  private buildFields(planet: PlanetDetail, fieldConfigs: FieldConfig[]): DataField[] {
    return fieldConfigs
      .map(config => this.buildField(planet, config))
      .filter((field): field is DataField => field !== null);
  }

  private buildField(planet: PlanetDetail, config: FieldConfig): DataField | null {
    const value = planet[config.key];
    
    if (!value || this.isEmptyValue(value)) {
      return null;
    }

    const formattedValue = config.formatter 
      ? config.formatter.call(this, String(value))
      : String(value);

    return {
      label: config.label,
      value: formattedValue,
      key: config.key
    };
  }

  private isPlanetDetail(planet: Planet): planet is PlanetDetail {
    return 'climate' in planet && 'terrain' in planet;
  }

  private isPlanetSummary(planet: Planet): planet is PlanetSummary {
    return 'uid' in planet && 'url' in planet && !('climate' in planet);
  }

  private isEmptyValue(value: unknown): boolean {
    return value === null || 
           value === undefined || 
           value === '' || 
           value === 'unknown' || 
           value === 'n/a';
  }

  // Formatting methods
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
