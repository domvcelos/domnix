export interface IPlanPayload {
    plan_name: string;
    partner_document_number: string;
    products: string[];
    id_product_establishment: {
        NIX_EMPRESAS: string,
        NIX_PROXY: string,
        GATEWAY: string,
    };
    frequency: string;
    parent_id?: string;
    fees: IFee[];
}

export interface IFee {
    event_type: string;
    fee_amount: string;
    tariff_value: string;
    free_quantities: number;
}

export interface IPlan {
    id: string;
    client: string;
    created: string;
    modified: string;
    plan_name: string;
    partner_document_number: string;
    products: string[];
    id_product_establishment: string;
    frequency: string;
    parent_id?: string;
    fees: IFee[];
}

export interface IPlanResponse {
    count: number;
    limite: number;
    offset: number;
    results: IPlan[];
}

export interface IChannelPayload {
    fee_plan_id: string;
    partner_document_number: string;
    name: string;
    code: string;
    free: boolean;
    activated: boolean;
}

export interface IChannelCreateResponse {
    code: string;
    created: string;
    fee_plan_id: string;
    modified: string;
    name: string;
    partner_document_number: string;
    id: number;
    free: boolean;
    activated: boolean;
    plan_id?: any;
}

export interface IChannelGetResponse {
    count: number;
    next: any;
    previous: any;
    results: IChannelCreateResponse[];
}

export interface IFeeClient {
    client?: string;
    created?: string;
    customer_document_number?: string;
    event_type?: string;
    fee_amount: string;
    id?: string;
    id_product_establishment?: string;
    modified?: string;
    plan?: string;
    product?: string;
    tariff_value: string;
    free_quantities: number;
}

export interface IFeeClientResponse {
    count: number;
    limit: number;
    offset: number;
    results: IFeeClient[];
}
