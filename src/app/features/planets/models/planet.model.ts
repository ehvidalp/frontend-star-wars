export interface PlanetDetail {
  created: string;
  edited: string;
  climate: string;
  surface_water: string;
  name: string;
  diameter: string;
  rotation_period: string;
  terrain: string;
  gravity: string;
  orbital_period: string;
  population: string;
  url: string;
}

export interface PlanetSummary {
  uid: string;
  name: string;
  url: string;
}

// Nueva interfaz para el formato expandido que incluye todos los datos
export interface PlanetExpanded {
  properties: PlanetDetail;
  description: string;
  _id: string;
  uid: string;
  __v: number;
}

export type Planet = PlanetDetail | PlanetSummary | (PlanetDetail & { uid: string });

// Interfaces para UI/UX del planet details
export interface PlanetStatistic {
  readonly label: string;
  readonly value: string;
  readonly unit?: string;
  readonly isVisible: boolean;
}

export interface PlanetDataSection {
  readonly title: string;
  readonly fields: PlanetStatistic[];
  readonly isVisible: boolean;
}

export interface PlanetViewModel {
  readonly name: string;
  readonly uid: string;
  readonly quickStats: PlanetStatistic[];
  readonly environmentalData: PlanetDataSection;
  readonly orbitalData: PlanetDataSection;
  readonly systemInfo: PlanetDataSection;
  readonly transitions: {
    readonly card: string;
    readonly sphere: string;
    readonly title: string;
  };
}
export interface IPlanetsStore {
  planets: Planet[];
  selectedPlanet: Planet | null;
  nextPageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}
export interface PlanetListResponse {
  message: string;
  total_records: number;
  total_pages: number;
  previous: string | null;
  next: string | null;
  results: PlanetExpanded[];
  apiVersion: string;
  timestamp: string;
}
export interface PlanetDetailResponse {
  message: string;
  result: {
    properties: PlanetDetail;
    description: string;
    _id: string;
    uid: string;
    __v: number;
  };
  apiVersion: string;
  timestamp: string;
}
export const EMPTY_PLANET_STORE: IPlanetsStore = {
  planets: [],
  selectedPlanet: null,
  nextPageUrl: null,
  isLoading: false,
  error: null,
};