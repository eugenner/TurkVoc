/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VocService } from './voc-service';

describe('Service: VocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VocService]
    });
  });

  it('should ...', inject([VocService], (service: VocService) => {

    expect(service).toBeTruthy();
  }));
});
