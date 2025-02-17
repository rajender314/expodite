import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoSettingsComponent } from './po-settings.component';

describe('PoSettingsComponent', () => {
  let component: PoSettingsComponent;
  let fixture: ComponentFixture<PoSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
