import { ITransferListSelect } from './transfer.model';

export const TRANSFERLISTSELECT: ITransferListSelect[] = [
    // {
    //     transfer_type: 'NIX',
    //     label: 'Para uma Conta Nix',
    // },
    {
        transfer_type: 'BANK',
        label: 'Para outros bancos',
    },
];

export enum NixAccountSearchTypes {
    CPFCNPJ = 'customer_id',
    PHONE = 'phone',
    EMAIL = 'email',
    ACCOUNT_NUMBER = 'account_number',
}
