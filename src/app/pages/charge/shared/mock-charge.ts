import { IPaymanetMethod } from './charge.model';


export const PAYMENTMETHODS: IPaymanetMethod[] = [
  { name: 'Cartão de Crédito', value: 'CREDIT_CARD' },
  { name: 'Boleto bancário', value: 'BILLET' },
  { name: 'Conta Nix', value: 'NIX_ACCOUNT' },
  { name: 'Todas as opções', value: 'ALL' },
];
