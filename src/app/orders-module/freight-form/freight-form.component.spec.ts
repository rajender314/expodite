import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightFormComponent } from './freight-form.component';

describe('FreightFormComponent', () => {
  let component: FreightFormComponent;
  let fixture: ComponentFixture<FreightFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
