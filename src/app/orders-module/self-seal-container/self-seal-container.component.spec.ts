import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfSealContainerComponent } from './self-seal-container.component';

describe('SelfSealContainerComponent', () => {
  let component: SelfSealContainerComponent;
  let fixture: ComponentFixture<SelfSealContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfSealContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfSealContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
