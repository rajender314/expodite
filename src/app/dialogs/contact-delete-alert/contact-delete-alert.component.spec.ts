import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDeleteAlertComponent } from './contact-delete-alert.component';

describe('ContactDeleteAlertComponent', () => {
  let component: ContactDeleteAlertComponent;
  let fixture: ComponentFixture<ContactDeleteAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDeleteAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDeleteAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
