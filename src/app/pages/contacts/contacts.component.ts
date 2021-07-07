import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { NewContactModalComponent } from 'src/app/components/new-contact-modal/new-contact-modal.component';
import { ContactsCancelModalComponent } from './components/contacts-cancel-modal/contacts-cancel-modal.component';
import { ISubPeople } from './shared/contacts.model';
import { ContactsService } from './shared/contacts.service';
import { environment } from 'src/environments/environment';
import { PAGESIZEOPTIONS } from 'src/app/common/utils';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'document_type',
    'document_value',
    'actions',
  ];
  loading = false;
  dataSource: MatTableDataSource<ISubPeople>;
  selection = new SelectionModel<ISubPeople>(true, []);
  length = 0;
  pageSize = 15;
  pageSizeOptions: number[] = PAGESIZEOPTIONS;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private contactService: ContactsService,
    private dialog: MatDialog,
  ) {
    this.getContactList();
    this.dataSource = new MatTableDataSource<ISubPeople>();
  }

  ngOnInit(): void { }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource!.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  checkboxLabel(row?: ISubPeople): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id
      }`;
  }

  getContactList(): void {
    this.loading = true;
    this.contactService.getSubPeopleList().subscribe(
      SUBPEOPLELIST => {
        this.dataSource = new MatTableDataSource<ISubPeople>(SUBPEOPLELIST);
        this.dataSource.paginator = this.paginator;
      }).add(() => this.loading = false);
  }

  openDialogNewContact(): void {
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
      },
    });
    dialogRef.afterClosed().subscribe(result => this.getContactList());
  }

  openDialogEditContact(subPeople: ISubPeople): void {
    this.loading = true;
    this.contactService.getContactBankAccounts(subPeople.id).subscribe(
      bank => {
        const contactData = {
          person: {
            email: subPeople.email,
            name: subPeople.name,
            phone: subPeople.phone,
            document_type: subPeople.document_type,
            document_value: subPeople.document_value,
          },
          address: {
            city: subPeople.city,
            complement: subPeople.complement,
            neighborhood: subPeople.neighborhood,
            number: subPeople.number,
            state: subPeople.state,
            street: subPeople.street,
            zip_code: subPeople.zip_code,
          },
          bank: {},
          groups: [environment.KEYS.GROUP_ID]
        };
        if (bank.length > 0) {
          contactData.bank = {
            bank: bank[0].bank,
            agency: bank[0].agency,
            agency_cd: bank[0].agency_cd,
            account: bank[0].account,
            account_cd: bank[0].account_cd,
            account_type: bank[0].account_type,
          };
        }
        this.loading = false;
        const dialogRef = this.dialog.open(NewContactModalComponent, {
          width: '100%',
          height: 'auto',
          maxWidth: '900px',
          data: {
            info: contactData,
            type: 'edit',
            contactID: subPeople.id,
            bankID: bank[0] ? bank[0].id : null,
          },
        });
        dialogRef.afterClosed().subscribe(result => this.getContactList());
      },
    );
  }

  openDialogDeleteContact(subPeople: ISubPeople): void {
    const dialogRef = this.dialog.open(ContactsCancelModalComponent, {
      height: 'auto',
      width: '545px',
      data: { info: subPeople },
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.getContactList();
        }
      });
  }

}
