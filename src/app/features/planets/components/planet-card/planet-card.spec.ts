import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetCard } from './planet-card';

describe('PlanetCard', () => {
  let component: PlanetCard;
  let fixture: ComponentFixture<PlanetCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
