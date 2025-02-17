import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonScomatDeclarationComponent } from './non-scomat-declaration.component';

describe('NonScomatDeclarationComponent', () => {
  let component: NonScomatDeclarationComponent;
  let fixture: ComponentFixture<NonScomatDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonScomatDeclarationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonScomatDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
