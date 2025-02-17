import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEinvoiceComponent } from './create-einvoice.component';

describe('CreateEinvoiceComponent', () => {
  let component: CreateEinvoiceComponent;
  let fixture: ComponentFixture<CreateEinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEinvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
