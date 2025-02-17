import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdpsDeclarationComponent } from './ndps-declaration.component';

describe('NdpsDeclarationComponent', () => {
  let component: NdpsDeclarationComponent;
  let fixture: ComponentFixture<NdpsDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NdpsDeclarationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NdpsDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
