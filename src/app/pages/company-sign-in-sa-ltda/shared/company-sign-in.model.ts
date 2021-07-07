export interface ISelectCompanyType {
    label: string;
    value: string;
}

export interface ISelectCompanySize {
    label: string;
    value: string;
}

export interface ICreateCompanyResponse {
    checkout_url: string;
    company: ICreateCompany;
}

export interface ICreateCompany {
    account_branch: any;
    account_number: any;
    bankly_status: any;
    cadun_pj_id: string;
    activated: boolean;
    cashflow_created: boolean;
    channel: number;
    account_status: string;
    cadun_user_id: string;
    checkout_link: string;
    cnpj: string;
    cpf: string;
    created: string;
    data: any;
    document_analysis_status: any;
    document_back_status: any;
    document_back_token: any;
    document_front_status: any;
    document_front_token: any;
    error: any;
    gateway_id: any;
    document_type: string;
    email: string;
    id: string;
    modified: string;
    name: string;
    official_name: string;
    nix_account_id: any;
    selfie_status: any;
    selfie_token: any;
}
