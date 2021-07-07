import { IPayListSelect, IPayStatusListSelect } from '../../pay/shared/pay.model';


export const PAYMENTTRANSACTIONTYPES: IPayListSelect[] = [
  {
    payment_type: 'CREDIT_CARD',
    label: 'Cartão de Crédito',
  },
  {
    payment_type: 'NIX',
    label: 'Conta Nix',
  },
  {
    payment_type: 'MULTI',
    label: 'Saldo Nix + Crédito',
  },
];

export const PAYMENTSTATUSTYPES: IPayStatusListSelect[] = [
  {
    status_type: 'PENDING',
    label: 'Pendente',
  },
  {
    status_type: 'PAYED',
    label: 'Pago',
  },
  {
    status_type: 'CHARGEBACK',
    label: 'Estornada',
  },
  {
    status_type: 'EXTERNAL_REJECTION',
    label: 'Não aceito',
  },
];
