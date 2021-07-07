import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'statusRecurrence',
})
export class StatusRecurrencePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(status: number): SafeHtml {
    switch (status) {
      case 0: {
        return this.sanitizer.bypassSecurityTrustHtml('<p>Não Iniciado</p>');
      }
      case 1: {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:green\'>Ativo</p>'
        );
      }
      case 2: {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:green\'>Finalizado</p>'
        );
      }
      case 3: {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:red\'>Desabilitado pelo estabelecimento</p>'
        );
      }
      case 4: {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:red\'>Desabilitado por excesso de tentativas</p>'
        );
      }
      case 5: {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:red\'>Cartão expirado</p>'
        );
      }
      case 6: {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:red\'>Boleto expirado</p>'
        );
      }
      case 9: {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:#F2994A\'>Processando</p>'
        );
      }
      default: {
        return '';
      }
    }
  }
}
