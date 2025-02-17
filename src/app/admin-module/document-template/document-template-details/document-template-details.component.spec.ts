import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTemplateDetailsComponent } from './document-template-details.component';

describe('DocumentTemplateDetailsComponent', () => {
  let component: DocumentTemplateDetailsComponent;
  let fixture: ComponentFixture<DocumentTemplateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentTemplateDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
