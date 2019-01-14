import { TestBed, inject } from '@angular/core/testing';

import { CustomPreloadingService } from './custom-preloading.service';

describe('CustomPreloadingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomPreloadingService]
    });
  });

  it('should be created', inject([CustomPreloadingService], (service: CustomPreloadingService) => {
    expect(service).toBeTruthy();
  }));
});
