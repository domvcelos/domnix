import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'interval',
})
export class IntervalPipe implements PipeTransform {
  transform(interval: number): string {
    switch (interval) {
      case 1: {
        return 'Mensal';
      }
      case 2: {
        return 'Bimestral';
      }
      case 3: {
        return 'Trimestral';
      }
      case 4: {
        return 'Semestral';
      }
      case 5: {
        return 'Anual';
      }
      case 6: {
        return 'Semanal';
      }
      default: {
        return '';
      }
    }
  }
}
