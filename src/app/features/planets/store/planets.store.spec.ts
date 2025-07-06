import { TestBed } from '@angular/core/testing';
import { PlanetsStore } from './planets.store';
describe('PlanetsStore', () => {
  let service: PlanetsStore;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanetsStore);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
