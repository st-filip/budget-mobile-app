import { TestBed } from '@angular/core/testing';

import { EnvelopesService } from './envelopes.service';

describe('EnvelopesService', () => {
  let service: EnvelopesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvelopesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
