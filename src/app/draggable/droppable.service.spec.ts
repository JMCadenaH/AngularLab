import { TestBed, inject } from '@angular/core/testing';

import { DroppableService } from './droppable.service';

describe('DroppableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DroppableService]
    });
  });

  it('should be created', inject([DroppableService], (service: DroppableService) => {
    expect(service).toBeTruthy();
  }));
});
