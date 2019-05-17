//import { MyPedidoCompra } from './mypedidocompra.class';

export interface PedidoCompraTemp {
    key?: string,
    solicitante?: string,
    data_emissao?: string,
    total?: number,
    item?: any[],
    status?: boolean,
    key_solicitante?: string
}