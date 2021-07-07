import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ISubPeople } from 'src/app/common/services/contact/contact.model';
import { ContactService } from 'src/app/common/services/contact/contact.service';
import { NewContactModalComponent } from 'src/app/components/new-contact-modal/new-contact-modal.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-select-contact-modal',
  templateUrl: './select-contact-modal.component.html',
  styleUrls: ['./select-contact-modal.component.scss'],
})
export class SelectContactModalComponent implements OnInit {
  loading = false;
  subPeopleList: ISubPeople[] = [];
  filteredOptions: ISubPeople[] = [];
  searchInput = '';

  constructor(
    private contactService: ContactService,
    private dialogRef: MatDialogRef<SelectContactModalComponent>,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getContactList();
  }

  getContactList(): void {
    this.loading = true;
    this.contactService.getSubPeopleList().subscribe(
      SUBPEOPLE => {
        this.subPeopleList = SUBPEOPLE;
        this.filteredOptions = SUBPEOPLE;
        this.loading = false;
      });
  }

  onChangeSearch(): void {
    this.filteredOptions = this.subPeopleList.filter(subPeople => subPeople.name.toLowerCase().match(this.searchInput.toLowerCase()));
  }

  getSelectedSubPeople(people: ISubPeople): void {
    this.contactService.selectedContact = people;
    this.dialogRef.close();
  }

  newContact(): void {
    const dialogRef = this.dialog.open(NewContactModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '900px',
      data: {
        info: {
          person: {
            name: '',
            document_type: '',
            document_value: '',
            email: '',
            phone: '',
          },
          address: {
            city: '',
            complement: '',
            neighborhood: '',
            number: '',
            state: '',
            street: '',
            zip_code: '',
          },
          bank: null,
          groups: [environment.KEYS.GROUP_ID]
        },
        type: 'create',
        contactID: '',
      }
    });
    dialogRef.afterClosed().subscribe(result => this.getContactList());
  }

}
