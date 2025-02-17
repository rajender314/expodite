import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactMainviewComponent } from './contact-mainview.component';

describe('ContactMainviewComponent', () => {
  let component: ContactMainviewComponent;
  let fixture: ComponentFixture<ContactMainviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactMainviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactMainviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
