import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailDocumentsComponent } from './email-documents.component';

describe('EmailDocumentsComponent', () => {
  let component: EmailDocumentsComponent;
  let fixture: ComponentFixture<EmailDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
