import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUploadComponent } from './delete-upload.component';

describe('DeleteUploadComponent', () => {
  let component: DeleteUploadComponent;
  let fixture: ComponentFixture<DeleteUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
