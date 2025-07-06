import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanetCardDirective } from './planet-card-directive';

describe('PlanetCardDirective', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlanetCardDirective]
    });
  });

  it('should create', () => {
    // TODO: Add proper directive testing setup with host element
    expect(PlanetCardDirective).toBeTruthy();
  });
});
