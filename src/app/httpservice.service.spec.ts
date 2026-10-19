import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { HttpserviceService } from './httpservice.service';

describe('HttpserviceService', () => {
  let service: HttpserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(HttpserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
