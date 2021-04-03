import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryPackagingComponent } from './primary-packaging.component';

describe('PrimaryPackagingComponent', () => {
  let component: PrimaryPackagingComponent;
  let fixture: ComponentFixture<PrimaryPackagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryPackagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryPackagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
