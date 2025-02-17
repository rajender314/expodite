import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainersDetailsComponent } from './add-containers.component';

describe('ContainersDetailsComponent', () => {
  let component: ContainersDetailsComponent;
  let fixture: ComponentFixture<ContainersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
