import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoCompraNovoComponent } from './pedido-compra-novo.component';

describe('PedidoCompraNovoComponent', () => {
  let component: PedidoCompraNovoComponent;
  let fixture: ComponentFixture<PedidoCompraNovoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoCompraNovoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoCompraNovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
