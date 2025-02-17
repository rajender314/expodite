import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelEinvoiceComponent } from './cancel-einvoice.component';

describe('CancelEinvoiceComponent', () => {
  let component: CancelEinvoiceComponent;
  let fixture: ComponentFixture<CancelEinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelEinvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelEinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
