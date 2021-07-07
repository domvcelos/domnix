import { IBrand, IPayListSelect } from './pay.model';

export const PAYLISTSELECT: IPayListSelect[] = [
  // {
  //   payment_type: 'CREDIT_CARD',
  //   label: 'Cartão de Crédito',
  // },
  {
    payment_type: 'NIX',
    label: 'Conta Nix',
  },
];

export const BRANDLIST: IBrand[] = [
  {
    name: 'Outros',
    value: 'none',
    logo: 'none',
    color: '#716b6b',
  },
  {
    name: 'Visa',
    value: 'visa',
    logo: 'visa',
    color: '#122D98',
  },
  {
    name: 'MasterCard',
    value: 'mastercard',
    logo: 'mastercard',
    color: '#4A4A4A',
  },
  { name: 'JCB', value: 'jcb', logo: 'jcb', color: '#0063BF' },
  { name: 'Elo', value: 'elo', logo: 'elo', color: '#231F20' },
  {
    name: 'Discover',
    value: 'discover',
    logo: 'discover',
    color: '#0074B4',
  },
  {
    name: 'Amex',
    value: 'amex',
    logo: 'amex',
    color: '#63A388',
  },
  {
    name: 'Diners Club',
    value: 'dinersclub',
    logo: 'dinersclub',
    color: '#b3b3b5',
  },
  {
    name: 'Aura',
    value: 'aura',
    logo: 'aura',
    color: '#DB4444',
  },
];
