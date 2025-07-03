import { TestBed } from '@angular/core/testing';

import { Planets } from './planets';

describe('Planets', () => {
  let service: Planets;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Planets);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
