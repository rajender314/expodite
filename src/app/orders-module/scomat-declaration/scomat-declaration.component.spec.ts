import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScomatDeclarationComponent } from './scomat-declaration.component';

describe('ScomatDeclarationComponent', () => {
  let component: ScomatDeclarationComponent;
  let fixture: ComponentFixture<ScomatDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScomatDeclarationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScomatDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
