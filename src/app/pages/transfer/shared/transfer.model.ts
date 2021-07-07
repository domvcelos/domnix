
export interface ITransferListSelect {
    transfer_type: 'NIX' | 'BANK' | 'OWN_ACCOUNT';
    label:
    | 'Para uma Conta Nix'
    | 'Para outros bancos'
    | 'Para minha conta bancária cadastrada';
}

export interface IBankAccount {
    account_branch: string;
    account_branch_digit: string;
    account_digit: string;
    account_number: string;
    account_type: string;
    bank_number: string;
    id: string;
}

export interface ITransferPayload {
    amount: string;
    recipient_account: string;
    recipient_account_digit?: string;
    recipient_name: string;
    recipient_social_number: string;
    recipient_branch: string;
    recipient_branch_digit?: string;
    recipient_bank_code: string;
    recipient_account_type: string;
    description: string;
    recipient_bank_name?: string;
}

export interface ITransferExtraData {
    destinataryName: string;
    bankCodeName: string;
    bankShortName: string;
    fee: string;
    transferType: string;
}

export interface INixAccount {
    account_check_digit: string;
    account_number: string;
    account_type: string;
    bank_number: string;
    branch_number: string;
    customer_id: string;
    email: string;
    id: string;
    name: string;
    phone: string;
}
