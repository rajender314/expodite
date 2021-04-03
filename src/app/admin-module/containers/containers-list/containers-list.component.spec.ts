import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainersListComponent } from './containers-list.component';

describe('ContainersListComponent', () => {
  let component: ContainersListComponent;
  let fixture: ComponentFixture<ContainersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
