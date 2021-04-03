import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeMailComponent } from './authorize-mail.component';

describe('AuthorizeMailComponent', () => {
  let component: AuthorizeMailComponent;
  let fixture: ComponentFixture<AuthorizeMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizeMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
