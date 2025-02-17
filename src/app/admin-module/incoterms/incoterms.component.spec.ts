import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncotermsComponent } from './incoterms.component';

describe('IncotermsComponent', () => {
  let component: IncotermsComponent;
  let fixture: ComponentFixture<IncotermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncotermsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncotermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
