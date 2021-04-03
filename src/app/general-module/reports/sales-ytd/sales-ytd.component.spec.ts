import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesYtdComponent } from './sales-ytd.component';

describe('SalesYtdComponent', () => {
  let component: SalesYtdComponent;
  let fixture: ComponentFixture<SalesYtdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesYtdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesYtdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
