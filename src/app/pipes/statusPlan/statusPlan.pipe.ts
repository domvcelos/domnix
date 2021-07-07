import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'statusPlan',
})
export class StatusPlanPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: boolean): SafeHtml {
    if (value) {
      return this.sanitizer.bypassSecurityTrustHtml(
        '<p style=\'color:green\'>Ativo</p>'
      );
    } else {
      return this.sanitizer.bypassSecurityTrustHtml(
        '<p style=\'color:red\'>Inativo</p>'
      );
    }
  }
}
