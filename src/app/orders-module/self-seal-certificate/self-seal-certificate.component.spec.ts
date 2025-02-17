import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfSealCertificateComponent } from './self-seal-certificate.component';

describe('SelfSealCertificateComponent', () => {
  let component: SelfSealCertificateComponent;
  let fixture: ComponentFixture<SelfSealCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfSealCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfSealCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
