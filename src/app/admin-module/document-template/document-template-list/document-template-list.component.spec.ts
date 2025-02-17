import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTemplateListComponent } from './document-template-list.component';

describe('DocumentTemplateListComponent', () => {
  let component: DocumentTemplateListComponent;
  let fixture: ComponentFixture<DocumentTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentTemplateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
