import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IgstDetailComponent } from './igst-detail.component';

describe('IgstDetailComponent', () => {
  let component: IgstDetailComponent;
  let fixture: ComponentFixture<IgstDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IgstDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IgstDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
