import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { merge, of as observableOf } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


import { PAGESIZEOPTIONS, Utils } from 'src/app/common/utils';
import { NotificationInfoModalComponent } from './components/notification-info-modal/notification-info-modal.component';
import { ConfigNotificationModalComponent } from './components/config-notification-modal/config-notification-modal.component';
import { INotification, INotificationsFilter, INotificationStatusListSelect, INotificationTopicsListSelect } from './shared/notifications.model';
import { NotificationsService } from './shared/notifications.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'category',
    'read',
    'message',
    'created',
    'actions',
  ];
  dataSource: MatTableDataSource<INotification>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  length = 0;
  pageSize = 15;
  pageSizeOptions: number[] = PAGESIZEOPTIONS;
  filterRangeFormGroup: FormGroup;
  panelOpenState = false;
  loading = false;
  date: {
    start: moment.Moment;
    end: moment.Moment;
  };
  exapansionText = 'Filtros avançados ▼';
  topicTypes: INotificationTopicsListSelect[];
  statusTypes: INotificationStatusListSelect[];

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private service: NotificationsService,
    private utils: Utils,
    private toastr: ToastrService,
  ) {
    const currentMonth = this.utils.currentMonthRange();
    this.date = { start: currentMonth[0], end: currentMonth[1] };
    this.filterRangeFormGroup = this.formBuilder.group({
      search: '',
      dueStartDate: '',
      dueEndDate: '',
      topicType: '',
      statusType: '',
    });
    this.dataSource = new MatTableDataSource<INotification>();
  }

  ngOnInit(): void {
    this.getNotificationListSelect();
  }

  ngAfterViewInit(): void {
    this.buildFiltersAndFetch();
  }

  buildFiltersAndFetch(): void {
    const dueStartDateCtrl = this.filterRangeFormGroup.controls['dueStartDate'];
    const dueEndDateCtrl = this.filterRangeFormGroup.controls['dueEndDate'];
    const topicTypeCtrl = this.filterRangeFormGroup.controls['topicType'];
    const statusTypeCtrl = this.filterRangeFormGroup.controls['statusType'];
    const searchCtrl = this.filterRangeFormGroup.controls['search'];
    merge(
      this.paginator.page,
      dueStartDateCtrl.statusChanges,
      dueEndDateCtrl.statusChanges,
      topicTypeCtrl.statusChanges,
      statusTypeCtrl.statusChanges,
      searchCtrl.statusChanges,
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          const customFilters: INotificationsFilter = {
            message: searchCtrl.value,
            category: topicTypeCtrl.value,
            read: statusTypeCtrl.value,
            initial_created: dueStartDateCtrl.value ? this.utils.dateToStringUSA(dueStartDateCtrl.value) : '',
            final_created: dueEndDateCtrl.value ? this.utils.dateToStringUSA(dueEndDateCtrl.value) : '',
            offset: this.paginator.pageIndex,
            limit: this.paginator.pageSize,
            ordering: '-created',
          };
          return this.service.getAllNotifications(customFilters);
        }),
        map((dataPayment) => {
          this.loading = false;
          this.length = dataPayment.count;
          return dataPayment.results;
        }),
        catchError(() => {
          this.loading = false;
          return observableOf([]);
        })
      )
      .subscribe(
        (payments) =>
          (this.dataSource = new MatTableDataSource<INotification>(payments))
      );
  }

  openExpansion(): void {
    this.panelOpenState = !this.panelOpenState;
    if (this.exapansionText === 'Filtros avançados ▼') {
      this.exapansionText = 'Filtros avançados ▲';
    } else {
      this.exapansionText = 'Filtros avançados ▼';
    }
  }

  clearForm(): void {
    this.filterRangeFormGroup.controls['dueStartDate'].setValue('');
    this.filterRangeFormGroup.controls['dueEndDate'].setValue('');
    this.filterRangeFormGroup.controls['search'].setValue('');
    this.filterRangeFormGroup.controls['topicType'].setValue('');
    this.filterRangeFormGroup.controls['statusType'].setValue('');
  }

  getNotificationListSelect(): void {
    this.service.getTopicListSelect().then(
      (PAYMENTTRANSACTIONTYPES) =>
        (this.topicTypes = PAYMENTTRANSACTIONTYPES)
    );
    this.service.getPaymentStatusListSelect().then(
      (PAYMENTSTATUSTYPES) =>
        (this.statusTypes = PAYMENTSTATUSTYPES)
    );
  }

  openDetailsModal(row: INotification): void {
    this.dialog.open(NotificationInfoModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '545px',
      data: row,
    });
  }

  openConfigModal(): void {
    this.dialog.open(ConfigNotificationModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '845px',
    });
  }

  checkAsRead(row: INotification): void {
    this.loading = true;
    this.service.readNotification(row.id).subscribe(
      data => {
        this.toastr.success('A notificação foi marcada como lida.');
        this.buildFiltersAndFetch();
      },
      error => this.toastr.error('Não foi possível marcar a notificação como lida.'),
    ).add(() => this.loading = false);
  }

  checkAllAsReaded(): void {
    this.loading = true;
    this.service.readAllNotifications().subscribe(
      data => {
        this.toastr.success('Todas as notificações foram marcadas como lidas.');
        this.buildFiltersAndFetch();
      },
      (error) => this.toastr.error('Não foi possível marcar as notificações como lida.'),
    ).add(() => this.loading = false);
  }

  translateCategory(category: string): string {
    const element = this.topicTypes.filter(item => item.topic_type === category)[0];
    return element.label;
  }

}
