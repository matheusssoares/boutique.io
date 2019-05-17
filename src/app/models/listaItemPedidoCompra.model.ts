import { ItemPedidoCompra } from './itemPedidoCompra.model';

export class ListaItemPedidoCompra {
  constructor(
    public itemPedidoCompra: ItemPedidoCompra,
    public qtde: number = 1
  ){
    
  }
}