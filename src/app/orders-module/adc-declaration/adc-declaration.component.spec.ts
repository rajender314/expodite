import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdcDeclarationComponent } from './adc-declaration.component';

describe('AdcDeclarationComponent', () => {
  let component: AdcDeclarationComponent;
  let fixture: ComponentFixture<AdcDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdcDeclarationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdcDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
