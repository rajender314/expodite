import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDrumsComponent } from './add-drums.component';

describe('AddDrumsComponent', () => {
  let component: AddDrumsComponent;
  let fixture: ComponentFixture<AddDrumsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDrumsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDrumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
