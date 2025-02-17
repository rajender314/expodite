import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadShippingDocsComponent } from './upload-shipping-docs.component';

describe('UploadShippingDocsComponent', () => {
  let component: UploadShippingDocsComponent;
  let fixture: ComponentFixture<UploadShippingDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadShippingDocsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadShippingDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
