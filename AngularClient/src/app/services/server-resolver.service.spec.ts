import { TestBed } from '@angular/core/testing';

import { ServerResolverService } from './server-resolver.service';

describe('ServerResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerResolverService = TestBed.get(ServerResolverService);
    expect(service).toBeTruthy();
  });
});
