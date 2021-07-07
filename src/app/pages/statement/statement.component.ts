import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { StatementService } from './shared/statement.service';
import { IStatementNameTranslate, IStatementResponse } from './shared/statement.model';
import { ActionBarService } from 'src/app/components/action-bar/shared/action-bar.service';
import { PAGESIZEOPTIONS } from 'src/app/common/utils';


@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss'],
})
export class StatementComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'amount',
    'origin',
    'timestamp',
  ];
  dataSource: MatTableDataSource<IStatementResponse>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  length = 0;
  pageSize = 15;
  pageSizeOptions: number[] = PAGESIZEOPTIONS;
  loading = false;
  names: IStatementNameTranslate[];
  balance = 0;

  constructor(
    private service: StatementService,
    private toastr: ToastrService,
    private actionBarService: ActionBarService,
  ) { }

  ngOnInit(): void {
    this.getStatement();
    this.getNamesToTranslate();
    this.getBalance();
  }

  getBalance(): void {
    this.loading = true;
    this.actionBarService.getBalance().subscribe(
      response => this.balance = response.balance.available.amount,
      error => this.toastr.error('Não foi possível obter o saldo da conta.'),
    ).add(() => this.loading = false);
  }

  getNamesToTranslate(): void {
    this.service.getTranslateNames().then(
      PAYMENTTRANSACTIONTYPES => this.names = PAYMENTTRANSACTIONTYPES
    );
  }

  getStatement(): void {
    this.loading = true;
    this.service.getStatement().subscribe(
      response => {
        this.dataSource = new MatTableDataSource<IStatementResponse>(response);
        this.length = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
      },
      error => this.toastr.error('Não foi possível obter o extrato da conta.'),
    ).add(() => this.loading = false);
  }

  translateName(transaction: string): string {
    const element = this.names.filter(item => item.english === transaction)[0];
    return element ? element.portuguese : '-';
  }

  formatDate(date: string): string {
    return moment(date).format('DD/MM/YYYY HH:mm:ss');
  }

  getOtherPartName(element: IStatementResponse): string {
    let name = '-';
    if (element.data.Assignor) {
      name = element.data.Assignor;
    } else if (element.data.TransactionReceipt) {
      name = element.data.TransactionReceipt.DestinationName;
    } else if (element.data.SenderAccount) {
      name = element.data.SenderAccount.Name;
    }
    return name;
  }

}
