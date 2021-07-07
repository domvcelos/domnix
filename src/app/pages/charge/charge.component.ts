import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { NewContactModalComponent } from '../../components/new-contact-modal/new-contact-modal.component';
import { ISubPeople } from '../contacts/shared/contacts.model';
import { ContactsService } from '../contacts/shared/contacts.service';
import { ChargeService } from './shared/charge.service';


@Component({
  selector: 'app-charge',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.scss'],
})
export class ChargeComponent implements OnInit {
  @ViewChild(MatAccordion)
  accordion: MatAccordion = new MatAccordion();
  myControl = new FormControl();
  subPeopleList: ISubPeople[] = [];
  filteredOptions$!: Observable<ISubPeople[]>;
  buttonControl = {
    visibleButton: true,
    enableButton: false,
  };
  showForm = false;
  selectedSubPeople!: ISubPeople;
  productRadio = 'card';

  constructor(
    private chargeService: ChargeService,
    private dialog: MatDialog,
    private contactsService: ContactsService
  ) {
    this.accordion.openAll();
  }

  ngOnInit(): void {
    this.getContactList();
  }

  getContactList(): void {
    this.contactsService.getSubPeopleList().subscribe((SUBPEOPLELIST) => {
      this.subPeopleList = SUBPEOPLELIST;
      this.filteredOptions$ = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) => (name ? this._filter(name) : this.subPeopleList.slice()))
      );
    });
  }

  displayFn(subPeople: ISubPeople): string {
    return subPeople ? subPeople.name : '';
  }

  _filter(filterValue: string): ISubPeople[] {
    const filteredValue = this.subPeopleList.filter(
      (subPeople) =>
        subPeople.name.toLowerCase().indexOf(filterValue.toLowerCase()) === 0
    );
    if (filteredValue.length === 0) {
      this.buttonControl.visibleButton = true;
      this.buttonControl.enableButton = true;
      this.accordion.closeAll();
    } else {
      this.buttonControl.visibleButton = true;
      this.buttonControl.enableButton = false;
    }
    return filteredValue;
  }

  getSelectedSubPeople(people: ISubPeople): void {
    this.buttonControl.visibleButton = false;
    this.selectedSubPeople = people;
    this.chargeService.setPayer(people);
    this.accordion.openAll();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewContactModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '900px',
      data: {
        info: {
          person: {
            name: this.myControl.value,
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
    dialogRef.afterClosed().subscribe(
      result => {
        this.myControl.reset();
        this.getContactList();
      });
  }

}
