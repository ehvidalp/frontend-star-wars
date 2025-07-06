import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanetCardContent } from './planet-card-content';
import { PlanetCardDirective } from './planet-card';

describe('PlanetCardContent', () => {
  let component: PlanetCardContent;
  let fixture: ComponentFixture<PlanetCardContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetCardContent, PlanetCardDirective]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanetCardContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
