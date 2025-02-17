import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RodtepreportComponent } from './rodtepreport.component';

describe('RodtepreportComponent', () => {
  let component: RodtepreportComponent;
  let fixture: ComponentFixture<RodtepreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RodtepreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RodtepreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
