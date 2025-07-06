import { TestBed } from '@angular/core/testing';
import { PlanetsApi } from './planets';
describe('PlanetsApi', () => {
  let service: PlanetsApi;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanetsApi);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
