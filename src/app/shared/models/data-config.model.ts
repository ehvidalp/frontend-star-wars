import { PlanetDetail } from '@features/planets/models/planet.model';

/**
 * Configuration for a single data field
 */
export interface FieldConfig {
  key: keyof PlanetDetail;
  label: string;
  formatter?: (value: string) => string;
}

/**
 * Configuration for a section containing multiple fields
 */
export interface SectionConfig {
  title: string;
  fields: FieldConfig[];
  condition?: (planet: PlanetDetail) => boolean;
}

/**
 * Supported variants for data display
 */
export type DataVariant = 'card' | 'detail';

/**
 * Configuration for data formatters
 */
export interface FormatterConfig {
  key: string;
  format: (value: string) => string;
}
