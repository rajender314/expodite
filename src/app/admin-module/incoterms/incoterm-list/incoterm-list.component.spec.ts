import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncotermListComponent } from './incoterm-list.component';

describe('IncotermListComponent', () => {
  let component: IncotermListComponent;
  let fixture: ComponentFixture<IncotermListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncotermListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncotermListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
