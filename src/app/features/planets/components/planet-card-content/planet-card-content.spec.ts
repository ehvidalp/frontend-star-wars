import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanetCardContent } from './planet-card-content';

describe('PlanetCardContent', () => {
  let component: PlanetCardContent;
  let fixture: ComponentFixture<PlanetCardContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetCardContent]
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
