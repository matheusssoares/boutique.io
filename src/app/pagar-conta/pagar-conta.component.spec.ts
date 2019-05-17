import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagarContaComponent } from './pagar-conta.component';

describe('PagarContaComponent', () => {
  let component: PagarContaComponent;
  let fixture: ComponentFixture<PagarContaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagarContaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagarContaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
