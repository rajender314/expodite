import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDesciptionModelComponent } from './edit-desciption-model.component';

describe('EditDesciptionModelComponent', () => {
  let component: EditDesciptionModelComponent;
  let fixture: ComponentFixture<EditDesciptionModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDesciptionModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDesciptionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
