export interface ContasAPagar {
    key?: string,
    codebar?: number,
    classificacao?: string,
    beneficiario?: string,
    observacao?: string,
    vencimento?: any,
    total?: number,
    total_pago?: number,
    resto?: number,
    recorrente?: boolean,
    num_parcelas?: number,
    data_emissao?: string,
    data_pagamento?: any,
    criado_por?: string,
    paga?: boolean,
    juros?: number,
    descontos?: number,
    troco?: number,
    processoupg?: any,
    forma_de_pagamento?: string,
    conta_corrente?: string
    pagamentos?: any
}