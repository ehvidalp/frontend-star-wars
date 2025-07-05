import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetDetails } from './planet-details';

describe('PlanetDetails', () => {
  let component: PlanetDetails;
  let fixture: ComponentFixture<PlanetDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
