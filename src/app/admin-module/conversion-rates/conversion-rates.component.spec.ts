import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionRatesComponent } from './conversion-rates.component';

describe('ConversionRatesComponent', () => {
  let component: ConversionRatesComponent;
  let fixture: ComponentFixture<ConversionRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversionRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversionRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
