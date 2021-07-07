import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { StorageService } from 'src/app/common/services/storage/storage.service';
import { LoginService } from 'src/app/pages/login/shared/login.service';
import { environment } from 'src/environments/environment';
import { IEmailSupport } from './support-modal';


@Component({
  selector: 'app-support-modal',
  templateUrl: './support-modal.component.html',
  styleUrls: ['./support-modal.component.scss'],
})
export class SupportModalComponent implements OnInit {
  loading = false;
  supportFormGroup: FormGroup;
  subjects = ['Pagamentos', 'Transferências', 'Cobranças', 'Pix', 'Fluxo de caixa',
    'Recorrências', 'Conciliação de Cartões', 'Outros Assuntos', 'Cancelamento'];
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<SupportModalComponent>,
    private storageService: StorageService,
    private loginService: LoginService
  ) {
    this.supportFormGroup = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        subject: ['', [Validators.required]],
        comments: ['', [Validators.required, Validators.minLength(10)]],
      }
    );
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.supportFormGroup.valid) {
      this.loading = true;
      this.loginService.sendEmail(this.getPayload()).subscribe(
        response => {
          this.dialogRef.close();
          this.toastr.success('Sua mensagem foi enviada com sucesso. Assim que possível, entraremos em contato.');
        },
        error => this.toastr.error('Falha ao enviar a mensagem, favor tentar novamente mais tarde.'),
      ).add(() => this.loading = false);
    }
  }

  getPayload(): IEmailSupport {
    let content = '<div>';
    content = `${content} <p><bold>Nome do solicitante</bold>: ${this.supportFormGroup.value.name}</p>`;
    content = `${content} <p><bold>CPF</bold>: ${this.storageService.currentUser.user_info.username}</p>`;
    content = `${content} <p><bold>CNPJ</bold>: ${this.storageService.cnpjCompany}</p>`;
    content = `${content} <p><bold>Conta</bold>: ${this.storageService.accountNumber}-${this.storageService.accountNumberDigit}</p>`;
    content = `${content} <p><bold>Email</bold>: ${this.storageService.currentUser.user_info.email}</p>`;
    content = `${content} <p><bold>Mensagem</bold>: ${this.supportFormGroup.value.comments}</p>`;
    content = `${content} </div>`;

    return {
      to: environment.SUPPORT_EMAIL,
      from:  environment.NO_REPLY_EMAIL,
      content,
      subject: `[NixEmpresas] - Contato via Portal - ${this.supportFormGroup.value.subject}`,
    };
  }

}
