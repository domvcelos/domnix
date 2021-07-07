import * as moment from 'moment';
import { Moment } from 'moment';

interface IExpDate {
  expDate: true;
}

export const currencyRegex = '^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:.[0-9]{2})?$';
export const dateRegex =
  '(^(((0[1-9]|1[0-9]|2[0-8])[/](0[1-9]|1[012]))|((29|30|31)[/](0[13578]|1[02]))|((29|30)[/](0[4,6,9]|11)))[/](19|[2-9][0-9])dd$)|(^29[/]02[/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)';

export enum SignUpStatus {
  active = 'Active',
  waiting = 'Waiting',
  pending = 'Pending',
  error = 'Error',
  inactive = 'Inactive',
}

export const PAGESIZEOPTIONS = [15, 30, 50, 100];

export class Utils {
  private eloResult = '';

  isEmpty = (obj: any): boolean => {
    if (obj === undefined || obj === null) {
      return true;
    }
    if (typeof obj === 'object') {
      return Object.keys(obj).length === 0;
    }
    if (typeof obj === 'string') {
      return obj.trim().length === 0;
    }
    return false;
  }

  getCurrentDate(format: string): string {
    const today = new Date();
    const todayWrapper = moment(today);
    return todayWrapper.format(format);
  }

  currentMonthRange(): Moment[] {
    return [moment().startOf('month'), moment().endOf('month')];
  }

  currentYearRange(): Moment[] {
    return [moment().startOf('year'), moment().endOf('year')];
  }

  nDaysBeforeTodayRange(n: number): Moment[] {
    return [moment().subtract(n, 'd'), moment()];
  }

  nDaysAfterToday(n: number): Moment {
    return moment().add(n, 'days');
  }


  dateToStringUSA(date: any): string {
    return moment(date).format('YYYY-MM-DD');
  }

  dateToStringPTBR(date: any): string {
    return moment(date).format('DD/MM/YYYY');
  }

  isUUID(uuid: string): boolean {
    const sUuid = '' + uuid;
    const rgUuid = sUuid.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    if (rgUuid === null) {
      return false;
    }
    return true;
  }

  maskBarcode(barcode: string): string {
    if (barcode.length === 47) {
      return '00000.00000 00000.000000 00000.000000 0 00 000000000000';
    } else if (barcode.length === 48) {
      return '00000000000-0 00000000000-0 00000000000-0 00000000000-0';
    }
    return '0'.padStart(barcode.length, '0');
  }

  getCardFlag(cardnumber: string): string {
    let flag = '';
    if (cardnumber.length < 6) {
      return 'none';
    }
    this.eloRegex();
    cardnumber = cardnumber.replace(/[^0-9]+/g, '');
    while (cardnumber.length < 16) {
      cardnumber += '0';
    }
    const cards = {
      elo: new RegExp('(' + this.eloResult + ')'),
      visa: /^4[0-9]{12}(?:[0-9]{3})/,
      mastercard: /^5[1-5][0-9]{14}/,
      amex: /^3[47][0-9]{13}/,
      dinersclub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}/,
    };
    Object.entries(cards).forEach(([key, value]) => {
      if (value.test(cardnumber)) {
        flag = key;
      }
    });
    if (flag === '') {
      return 'none';
    }
    return flag;
  }

  eloRegex(): void {
    if (this.eloResult !== '') {
      return;
    }
    const bins = [];
    bins.push('^4011');
    bins.push('^5067');
    bins.push('^4576');
    bins.push('^4576');
    bins.push('^431274');
    bins.push('^438935');
    bins.push('^451416');
    bins.push('^457393');
    bins.push('^457631');
    bins.push('^457632');
    bins.push('^504175');
    bins.push('^627780');
    bins.push('^636297');
    bins.push('^636368');
    bins.push('^636369');
    bins.push('^655000');
    bins.push('^655001');
    bins.push('^(65165[2-4])');
    bins.push('^(65048[5-8])');
    bins.push('^655002');
    bins.push('^655003');
    bins.push('^650489');
    bins.push('^(65049[0-4])');
    bins.push('^(506699|5067[0-6][0-9]|50677[0-8])');
    bins.push('^(509[0-8][0-9]{2}|5099[0-8][0-9]|50999[0-9])');
    bins.push('^(65003[1-3])');
    bins.push('^(65003[5-9]|65004[0-9]|65005[01])');
    bins.push('^(65040[5-9]|6504[1-3][0-9])');
    bins.push('^(65048[5-9]|65049[0-9]|6505[0-2][0-9]|65053[0-8])');
    bins.push('^(65054[1-9]|6505[5-8][0-9]|65059[0-8])');
    bins.push('^(65070[0-9]|65071[0-8])');
    bins.push('^(65072[7-9]|6507[3-9][0-9]|6508[0-9]{2}|6509[01][0-9]|650920)');
    bins.push('^(65165[2-9]|6516[67][0-9])');
    bins.push('^(65500[0-9]|65501[0-9])');
    bins.push('^(65502[1-9]|6550[34][0-9]|65505[0-8])');
    bins.push('^(65090[1-9]|65091[0-9]|650920)');
    this.eloResult = bins.join('|');
  }

  translateStatus(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Em aberto';
      case 'PAYED':
        return 'Paga';
      case 'CHARGEBACK':
        return 'Estornada';
      case 'EXPIRED':
        return 'Expirada';
      case 'PARTIALLY_PAID':
        return 'Parcialmente paga';
      case 'CANCELED':
        return 'Cancelada';
      case 'EXTERNAL_REJECTION':
        return 'Não aceito';
      default:
        return '-';
    }
  }

  isEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  onlyNumbers(fieldValue: string): string {
    return fieldValue.replace(/\D/g, '');
  }

  isCpf(CPF: string): boolean {
    let sum: number;
    let leftover: number;
    const strCPF = this.onlyNumbers(CPF);
    sum = 0;
    if (strCPF === '00000000000') {
      return false;
    }
    if (strCPF === '11111111111') {
      return false;
    }
    if (strCPF === '22222222222') {
      return false;
    }
    if (strCPF === '33333333333') {
      return false;
    }
    if (strCPF === '44444444444') {
      return false;
    }
    if (strCPF === '55555555555') {
      return false;
    }
    if (strCPF === '66666666666') {
      return false;
    }
    if (strCPF === '77777777777') {
      return false;
    }
    if (strCPF === '88888888888') {
      return false;
    }
    if (strCPF === '99999999999') {
      return false;
    }
    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(strCPF.substring(i - 1, i), 10) * (11 - i);
    }
    leftover = (sum * 10) % 11;
    if (leftover === 10 || leftover === 11) {
      leftover = 0;
    }
    if (leftover !== parseInt(strCPF.substring(9, 10), 10)) {
      return false;
    }
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(strCPF.substring(i - 1, i), 10) * (12 - i);
    }
    leftover = (sum * 10) % 11;
    if (leftover === 10 || leftover === 11) {
      leftover = 0;
    }
    if (leftover !== parseInt(strCPF.substring(10, 11), 10)) {
      return false;
    }
    return true;
  }

  isCnpj(c: any): boolean {
    const b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let n = 0;
    let p = 0;
    c = c.replace(/[^\d]/g, '');
    if (c.length !== 14) {
      return false;
    }
    if (/0{14}/.test(c)) {
      return false;
    }
    for (let i = 0; i < 12; i++) {
      n += c[i] * b[i + 1];
    }
    let rest = (n %= 11);
    if (parseInt(c[12], 10) !== (rest < 2 ? 0 : 11 - n)) {
      return false;
    }
    for (let i = 0; i <= 12; i++) {
      p += c[i] * b[i];
    }
    rest = p %= 11;
    if (parseInt(c[13], 10) !== (rest < 2 ? 0 : 11 - p)) {
      return false;
    }
    return true;
  }

}
