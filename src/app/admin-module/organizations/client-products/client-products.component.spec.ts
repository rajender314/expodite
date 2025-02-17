import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProductsComponent } from './client-products.component';

describe('ClientProductsComponent', () => {
  let component: ClientProductsComponent;
  let fixture: ComponentFixture<ClientProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
