import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContasPagarNovaComponent } from './contas-pagar-nova.component';

describe('ContasPagarNovaComponent', () => {
  let component: ContasPagarNovaComponent;
  let fixture: ComponentFixture<ContasPagarNovaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContasPagarNovaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContasPagarNovaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
