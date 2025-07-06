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
export type Planet = PlanetDetail | PlanetSummary;
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
  results: PlanetSummary[];
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