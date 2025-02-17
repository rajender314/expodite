import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationSettingsComponent } from './quotation-settings.component';

describe('QuotationSettingsComponent', () => {
  let component: QuotationSettingsComponent;
  let fixture: ComponentFixture<QuotationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
