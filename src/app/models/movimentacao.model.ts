export interface Movimentacao {
    key?: string,
    tipo?: number, //1 para entrada, 2 para saída
    classificacao?: string,
    vencimento?: Date,
    conta_corrente?: string,
    valor?: number,
    forma_de_pg?: string,
    obs?: string,
    paga?: boolean,
    data_pg?: Date,
    criado_por?: string,
}