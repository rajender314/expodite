import { TestBed } from '@angular/core/testing';

import { ContactsViewService } from './contacts-view.service';

describe('ContactsViewService', () => {
  let service: ContactsViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactsViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
