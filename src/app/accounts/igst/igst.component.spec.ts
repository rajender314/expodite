import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IgstComponent } from './igst.component';

describe('IgstComponent', () => {
  let component: IgstComponent;
  let fixture: ComponentFixture<IgstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IgstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IgstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
