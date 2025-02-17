import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VgmComponent } from './vgm.component';

describe('VgmComponent', () => {
  let component: VgmComponent;
  let fixture: ComponentFixture<VgmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VgmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
