import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePfiComponent } from './create-pfi.component';

describe('CreatePfiComponent', () => {
  let component: CreatePfiComponent;
  let fixture: ComponentFixture<CreatePfiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePfiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePfiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
