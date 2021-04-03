import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreEmailsComponent } from './more-emails.component';

describe('MoreEmailsComponent', () => {
  let component: MoreEmailsComponent;
  let fixture: ComponentFixture<MoreEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
