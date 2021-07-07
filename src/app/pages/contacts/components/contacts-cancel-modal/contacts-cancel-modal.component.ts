import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { ISubPeople } from '../../shared/contacts.model';
import { ContactsService } from '../../shared/contacts.service';


interface DialogData {
  info: ISubPeople;
}
@Component({
  selector: 'app-contacts-cancel-modal',
  templateUrl: './contacts-cancel-modal.component.html',
  styleUrls: ['./contacts-cancel-modal.component.scss'],
})
export class ContactsCancelModalComponent implements OnInit {
  loading = false;
  canceled = false;
  deleted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public contactDialog: DialogData,
    private dialogRef: MatDialogRef<ContactsCancelModalComponent>,
    private contactService: ContactsService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void { }

  public deleteContact(contactID: string): void {
    this.loading = true;
    this.contactService.getContactBankAccounts(contactID).subscribe(
      bankAccount => {
        if (bankAccount.length > 0) {
          for (const bank in bankAccount) {
            if (bank) {
              this.contactService.deleteContactBankaccounts(contactID, bankAccount[bank].id).subscribe(
                deletedBank => {
                  if (Number(bank) === bankAccount.length - 1) {
                    this.checkGroups(contactID);
                  }
                },
                derror => this.toastr.error('Não foi possível deletar os dados bancários.'),
              );
            }
          }
        } else {
          this.checkGroups(contactID);
        }
      },
      berror => this.toastr.error('Não foi possível buscar dados bancários.'),
    );
  }

  checkGroups(contactID: string): void {
    this.contactService.getSubGroups().subscribe(
      groups => {
        if (groups.length > 0) {
          let sended = false;
          for (const group in groups) {
            if (!sended) {
              this.contactService.deleteUnlinkGroupToContact(contactID, groups[group].id).subscribe(
                (deleteUnlinkGroupToContact) => {
                  if (Number(group) === groups.length - 1) {
                    sended = true;
                    this.deleteContactData(contactID);
                  }
                },
                deletedError => {
                  if (!sended && Number(group) === groups.length - 1) {
                    sended = true;
                    this.deleteContactData(contactID);
                  }
                });
            }
          }
        } else {
          this.deleteContactData(contactID);
        }
      },
      gerror => this.toastr.error('Não foi possível buscar grupos.'),
    );
  }

  deleteContactData(contactID: string): void {
    if (!this.deleted) {
      this.contactService.deleteContact(contactID).subscribe(
        response => {
          this.deleted = true;
          this.dialogRef.close({ deleted: true });
          this.toastr.success('Contato removido.');
        },
        error => {
          this.deleted = false;
          this.toastr.error('Não foi possível remover contato.');
        },
      ).add(() => this.loading = false);
    }
  }

}
