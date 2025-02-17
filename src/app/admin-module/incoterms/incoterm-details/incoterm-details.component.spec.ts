import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncotermDetailsComponent } from './incoterm-details.component';

describe('IncotermDetailsComponent', () => {
  let component: IncotermDetailsComponent;
  let fixture: ComponentFixture<IncotermDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncotermDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncotermDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
