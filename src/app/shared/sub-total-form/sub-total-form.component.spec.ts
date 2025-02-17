import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTotalFormComponent } from './sub-total-form.component';

describe('SubTotalFormComponent', () => {
  let component: SubTotalFormComponent;
  let fixture: ComponentFixture<SubTotalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubTotalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTotalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
