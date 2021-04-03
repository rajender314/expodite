import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryPackageListComponent } from './primary-package-list.component';

describe('PrimaryPackageListComponent', () => {
  let component: PrimaryPackageListComponent;
  let fixture: ComponentFixture<PrimaryPackageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryPackageListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryPackageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
