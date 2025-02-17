import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCostsTransportChargesComponent } from './other-costs-transport-charges.component';

describe('OtherCostsTransportChargesComponent', () => {
  let component: OtherCostsTransportChargesComponent;
  let fixture: ComponentFixture<OtherCostsTransportChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherCostsTransportChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherCostsTransportChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
