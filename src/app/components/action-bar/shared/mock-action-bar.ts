import { IActionBar } from './action-bar-model';

export const ACTIONLIST: IActionBar[] = [
  {
    icon: 'card-icon',
    label: 'cobrar',
    path: '/cobrar',
    id: 'ab-charge'
  },
  {
    icon: 'deposit-icon',
    label: 'depositar',
    path: '/depositar',
    id: 'ab-deposit',
  },
  {
    icon: 'plus-icon',
    label: 'pagar',
    path: '/pagar',
    id: 'ab-pay'
  },
  {
    icon: 'arrows-icon',
    label: 'transferir',
    path: '/transferir',
    id: 'ab-transfer',
  },
  // {
  //   icon: 'chart-icon',
  //   label: 'relatórios',
  //   path: '/relatorios',
  //   id: 'ab-report',
  // }
];
