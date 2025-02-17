import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorclientSettingsComponent } from './vendorclient-settings.component';

describe('VendorclientSettingsComponent', () => {
  let component: VendorclientSettingsComponent;
  let fixture: ComponentFixture<VendorclientSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorclientSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorclientSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
