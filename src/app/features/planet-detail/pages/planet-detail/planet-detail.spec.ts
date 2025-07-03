import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetDetail } from './planet-detail';

describe('PlanetDetail', () => {
  let component: PlanetDetail;
  let fixture: ComponentFixture<PlanetDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
