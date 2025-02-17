import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiDraftComponent } from './si-draft.component';

describe('SiDraftComponent', () => {
  let component: SiDraftComponent;
  let fixture: ComponentFixture<SiDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiDraftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
