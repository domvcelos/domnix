import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { slideInOutAnimation } from 'src/app/common/animations/animations';
import { NewContactModalComponent } from 'src/app/components/new-contact-modal/new-contact-modal.component';
import { environment } from 'src/environments/environment';

import { ChargeService } from '../charge/shared/charge.service';
import { ISubPeople } from '../contacts/shared/contacts.model';
import { ContactsService } from '../contacts/shared/contacts.service';
import { RecurrenceConfirmModalComponent } from './components/recurrence-confirm-modal/recurrence-confirm-modal.component';
import {
  IPaymentType,
  IRecurrencePlan,
} from './shared/recurrence-management.model';
import { RecurrenceManagementService } from './shared/recurrence-management.service';

@Component({
  selector: 'app-recurrence-management',
  templateUrl: './recurrence-management.component.html',
  styleUrls: ['./recurrence-management.component.scss'],
  animations: [slideInOutAnimation],
})
export class RecurrenceManagementComponent implements OnInit {
  creditCardFee = 0;
  myControl = new FormControl();
  filteredOptions$!: Observable<ISubPeople[]>;
  subPeopleList: ISubPeople[] = [];
  buttonControl = {
    visibleButton: true,
    enableButton: false,
  };
  showForm = false;
  selectedSubPeople!: ISubPeople;
  panelOpenState = false;
  recurrencePlans: IRecurrencePlan[] = [];
  paymentTypes: IPaymentType[] = [];
  recurrenceFormGroup: FormGroup;
  expireSelecet = [
    {
      value: true,
      label: 'Sim',
    },
    {
      value: false,
      label: 'Não',
    },
  ];
  loading = false;
  minDate: Date;

  constructor(
    public recurrenceManagementService: RecurrenceManagementService,
    private dialog: MatDialog,
    private chargeService: ChargeService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private contactsService: ContactsService
  ) {
    this.minDate = new Date();
    this.recurrenceFormGroup = this.formBuilder.group({
      plan: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: '',
      payment_type: ['CREDIT_CARD', Validators.required],
      expire: [false, Validators.required],
      comments: '',
    });
  }

  ngOnInit(): void {
    this.getFees();
    this.getContactList();
    this.getPlans();
    this.getPaymentTypes();
  }

  getPaymentTypes(): void {
    this.recurrenceManagementService
      .getPaymentTypes()
      .then((PAYMENTTYPES) => (this.paymentTypes = PAYMENTTYPES));
  }

  getPlans(): void {
    this.loading = true;
    this.recurrenceManagementService.getPlans().subscribe(
      plans => {
        plans.sort(
          (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
        );
        this.recurrencePlans = plans.filter((plan: IRecurrencePlan) => plan.active);
      },
      error => this.toastr.error('Não foi possível buscar planos.')
    ).add(() => (this.loading = false));
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
      this.panelOpenState = false;
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
    this.panelOpenState = true;
  }

  openDialog(): void {
    this.dialog.open(NewContactModalComponent, {
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
  }

  openConfirmDialog(form: any): void {
    if (this.recurrenceFormGroup.valid) {
      const dialogRef = this.dialog.open(RecurrenceConfirmModalComponent, {
        width: '100%',
        height: 'auto',
        maxWidth: '900px',
        maxHeight: '95vh',
        data: {
          people: this.myControl.value,
          plan: this.recurrenceFormGroup.controls['plan'].value,
          fee: this.getFeeValue(),
          totalToReceive:
            this.recurrenceFormGroup.controls['plan'].value.amount / 100 -
            this.getFeeValue(),
          paymentType: this.recurrenceFormGroup.value.payment_type,
          initialDate: this.recurrenceFormGroup.value.start_date,
          finalDate: this.recurrenceFormGroup.value.end_date,
          comments: this.recurrenceFormGroup.value.comments,
        },
      });
      dialogRef.afterClosed().subscribe((_) => {
        this.recurrenceManagementService.showOffAutocomplete();
        form.resetForm();
      });
      dialogRef.backdropClick().subscribe((_) => {
        this.recurrenceManagementService.showOffAutocomplete();
        form.resetForm();
      });
    }
  }

  getFeeValue(): number {
    return (
      (Number(this.creditCardFee) *
        (this.recurrenceFormGroup.controls['plan'].value.amount / 100)) /
      100
    );
  }

  back(): void {
    this.recurrenceManagementService.showOffAutocomplete();
    this.myControl.setValue('');
    this.panelOpenState = false;
    this.recurrenceFormGroup.reset();
  }

  getFees(): void {
    this.loading = true;
    this.recurrenceManagementService
      .getFees()
      .subscribe(
        (data) => {
          if (data.results) {
            this.creditCardFee = Number(
              data.results.filter(
                (d: { transaction_type: string; installment: number }) =>
                  d.transaction_type === 'CREDIT' && d.installment === 1
              )[0].amount
            );
          }
        },
        (error) => this.toastr.error('Falha ao buscar taxas.')
      )
      .add(() => (this.loading = false));
  }
}
