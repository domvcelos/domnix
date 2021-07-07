import { INotificationStatusListSelect, INotificationTopicsListSelect } from './notifications.model';


export const NOTIFICATIONSTATUSTYPES: INotificationStatusListSelect[] = [
  {
    status_type: true,
    label: 'Lido',
  },
  {
    status_type: false,
    label: 'Não lido',
  },
];

export const NOTIFICATIONTOPICSTYPES: INotificationTopicsListSelect[] = [
  {
    topic_type: 'CREDIT',
    label: 'CRÉDITO',
  },
  {
    topic_type: 'DEBIT',
    label: 'DÉBITO',
  },
  {
    topic_type: 'CHARGE',
    label: 'COBRANÇA',
  },
  {
    topic_type: 'DEPOSIT',
    label: 'DEPÓSITO',
  },
  {
    topic_type: 'PAYMENT',
    label: 'PAGAMENTO',
  },
  {
    topic_type: 'TRANSFER',
    label: 'TRANSFERÊNCIA',
  },
  {
    topic_type: 'PAYMENT_BILLET_SUCCESS',
    label: 'PAGAMENTO DE BOLETO',
  },
  {
    topic_type: 'PAYMENT_BILLET_FAIL',
    label: 'PAGAMENTO DE BOLETO COM FALHA',
  },
  {
    topic_type: 'PAYMENT_WALLET',
    label: 'PAGAMENTO VIA CARTEIRA VIRTUAL',
  },
  {
    topic_type: 'WITHDRAWAL',
    label: 'RETIRADA',
  },
  {
    topic_type: 'INFO',
    label: 'INFORMAÇÃO',
  },
  {
    topic_type: 'WARNING',
    label: 'AVISO',
  },
  {
    topic_type: 'NEWS',
    label: 'NOTÍCIAS',
  },
  {
    topic_type: 'PUBLICITY',
    label: 'PUBLICIDADE',
  },
  {
    topic_type: 'BARCODE_CHARGEBACK',
    label: 'REEMBOLSO DE CÓDIGO DE BARRAS',
  },
  {
    topic_type: 'BANK_TRANSFER_CHARGEBACK',
    label: 'REEMBOLSO DE TRANSFERÊNCIA BANCÁRIA',
  },
];
